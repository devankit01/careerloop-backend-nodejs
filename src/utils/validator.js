/**
 * Validates user registration data
 * @param {Object} data - User registration data
 * @returns {Object} - Validation result
 */
exports.validateRegistration = (data) => {
  const errors = {};
  
  // Validate email
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Validate password
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Validate first name
  if (!data.first_name) {
    errors.first_name = 'First name is required';
  }

  // Validate last name
  if (!data.last_name) {
    errors.last_name = 'Last name is required';
  }

  // Validate role
  if (data.role && !['student', 'recruiter'].includes(data.role)) {
    errors.role = 'Role must be either student or recruiter';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validates user login data
 * @param {Object} data - User login data
 * @returns {Object} - Validation result
 */
exports.validateLogin = (data) => {
  const errors = {};
  
  // Validate email
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Validate password
  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validates profile update data
 * @param {Object} data - Profile update data
 * @returns {Object} - Validation result
 */
exports.validateProfileUpdate = (data) => {
  const errors = {};
  
  // Validate email if provided
  if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Validate password if provided
  if (data.password && data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
}; 