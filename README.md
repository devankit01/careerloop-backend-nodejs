# CareerFlow Backend API

A robust Node.js backend API using Express and MySQL with MVC architecture for a career platform.

## Features

- User authentication (register, login)
- Role-based authorization (student, recruiter, admin)
- User profile management
- Student profile management with education, work experience, projects, and certifications
- Secure password handling with bcrypt
- JWT-based authentication

## Tech Stack

- Node.js
- Express.js
- MySQL with Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing
- Helmet for security headers
- CORS enabled
- Dotenv for environment variables

## Database Schema

The project includes the following database models:

### Users Table
- `id`: Integer, primary key
- `email`: String(255), unique, not null
- `first_name`: String
- `last_name`: String
- `role`: String(255), either "student" or "recruiter"
- `created_at`: DateTime, default current timestamp
- `updated_at`: DateTime, auto-updated on change
- `is_active`: Boolean, default 'False'
- `password`: String(255), securely hashed

### Students Table
- `id`: Integer, primary key
- `user_id`: Foreign key to users.id, unique, not null
- `college_id`: Foreign key to colleges.id, not null
- `phone`: String(255), unique, optional
- `gender`: String(255), optional
- `dob`: String(255), optional
- `bio`: String(255), optional
- `location`: String(255), optional
- `social_media_links`: String(255), optional
- `degree`: String(255), optional
- `graduation_year`: Integer, optional
- `skills`: String(255), optional
- `eresume_url`: String(255), optional
- `profile_picture`: String(255), optional
- `professional_summary`: Text, optional
- `created_at`: DateTime fields
- `updated_at`: DateTime fields

### Related Tables
- **Education**: One-to-many relationship (Student to Education)
- **Work Experience**: One-to-many relationship (Student to WorkExperience)
- **Project Experience**: One-to-many relationship (Student to ProjectExperience)
- **Certification**: One-to-many relationship (Student to Certification)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL 

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd careerflow-backend
```

2. Install dependencies:
```
npm install
```

3. Set up your database:
```sql
CREATE DATABASE careerflow;
```

4. Create a `.env` file in the root directory with the following environment variables:
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=careerflow
JWT_SECRET=your_jwt_secret_key
```

5. Import the database schema from `database.sql`:
```
mysql -u root -p careerflow < database.sql
```

6. Start the development server:
```
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get token

### User Profile
- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update user profile (auth required)

### Admin Routes
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Student Routes
- `GET /api/students` - Get all students (public)
- `GET /api/students/:id` - Get student by ID (public)
- `POST /api/students/profile` - Create/update student profile (student only)
- `GET /api/students/profile/me` - Get current student profile (student only)

### Education Routes
- `POST /api/students/education` - Add education (student only)
- `PUT /api/students/education/:id` - Update education (student only)
- `DELETE /api/students/education/:id` - Delete education (student only)

### Work Experience Routes
- `POST /api/students/work-experience` - Add work experience (student only)
- `PUT /api/students/work-experience/:id` - Update work experience (student only)
- `DELETE /api/students/work-experience/:id` - Delete work experience (student only)

### Project Experience Routes
- `POST /api/students/project-experience` - Add project experience (student only)
- `PUT /api/students/project-experience/:id` - Update project experience (student only)
- `DELETE /api/students/project-experience/:id` - Delete project experience (student only)

### Certification Routes
- `POST /api/students/certification` - Add certification (student only)
- `PUT /api/students/certification/:id` - Update certification (student only)
- `DELETE /api/students/certification/:id` - Delete certification (student only)

## License

This project is licensed under the ISC License.

## Author

Your Name 