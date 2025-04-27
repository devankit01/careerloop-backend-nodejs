const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('../utils/validator');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password, role } = req.body;

    // Validate registration data
    const { errors, isValid } = validator.validateRegistration(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      // If user exists with social login provider
      if (userExists.provider) {
        return res.status(400).json({
          success: false,
          message: `This email is already registered with ${userExists.provider}. Please sign in with ${userExists.provider}.`
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      first_name,
      last_name,
      password,
      role: role || 'student', // Default role is student
      is_active: false // Default is inactive until email verification
    });

    // Generate token
    const token = generateToken(user.id);

    // Return new user info
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_active: user.is_active,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    // Validate login data
    const { errors, isValid } = validator.validateLogin(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // If user is using social login and trying to login with password
    if (user.provider && !user.password) {
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.provider} login. Please sign in with ${user.provider}.`
      });
    }
    
    // Check if user exists and password is correct
    if (await user.comparePassword(password)) {
      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          is_active: user.is_active,
          provider: user.provider,
          token: generateToken(user.id)
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (user) {
      res.json({
        success: true,
        data: {
          ...user.dataValues,
          hasSocialLogin: !!user.provider
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    // Validate profile update data
    const { errors, isValid } = validator.validateProfileUpdate(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors
      });
    }

    const user = await User.findByPk(req.user.id);

    if (user) {
      user.first_name = req.body.first_name || user.first_name;
      user.last_name = req.body.last_name || user.last_name;
      user.email = req.body.email || user.email;
      
      // Only update password if provided
      if (req.body.password) {
        user.password = req.body.password;
      }

      // Save updated user
      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          role: updatedUser.role,
          is_active: updatedUser.is_active,
          token: generateToken(updatedUser.id)
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users,
        page,
        pages: Math.ceil(count / limit),
        total: count
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Update user by ID (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      user.first_name = req.body.first_name || user.first_name;
      user.last_name = req.body.last_name || user.last_name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.is_active = req.body.is_active !== undefined ? req.body.is_active : user.is_active;

      // Save updated user
      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          role: updatedUser.role,
          is_active: updatedUser.is_active
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (user) {
      await user.destroy();
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
};

// @desc    Allow social login users to set their role
// @route   POST /api/users/set-role
// @access  Private (Social login users only)
exports.setSocialUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate the role
    if (!role || !['student', 'recruiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Please select either "student" or "recruiter"'
      });
    }
    
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if this is a social login user
    if (!user.provider) {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is only for social login users'
      });
    }
    
    // Update the role
    user.role = role;
    await user.save();
    
    res.json({
      success: true,
      message: `Role successfully updated to ${role}`,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        provider: user.provider,
        is_active: user.is_active,
        token: generateToken(user.id)
      }
    });
  } catch (error) {
    console.error('Set social user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role',
      error: process.env.NODE_ENV === 'production' ? null : error.message
    });
  }
}; 