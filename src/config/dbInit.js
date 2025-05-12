const sequelize = require('./dbConfig');
const User = require('../models/User');
const Student = require('../models/Student');
const Education = require('../models/Education');
const WorkExperience = require('../models/WorkExperience');
const ProjectExperience = require('../models/ProjectExperience');
const Certification = require('../models/Certification');
const Task = require('../models/Task');
const Note = require('../models/Note');
const ImportedJob = require('../models/ImportedJob');
const Contact = require('../models/Contact');
const Document = require('../models/Document');
const AwardAchievement = require('../models/AwardAchievement');
const ResumeCollection = require('../models/ResumeCollection');
const Recruiter = require('../models/Recruiter');
const RecruiterJob = require('../models/RecruiterJob');
const RecruiterJobApplication = require('../models/RecruiterJobApplication');
const RecruiterCompanyProfile = require('../models/RecruiterCompanyProfile');
const Preference = require('../models/Preference');
const Location = require('../models/Location');
const JobProfile = require('../models/JobProfile');
const JobData = require('../models/JobData');

// Define associations
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Student, { foreignKey: 'user_id', as: 'studentProfile' });

// Recruiter associations
Recruiter.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Recruiter, { foreignKey: 'user_id', as: 'recruiterProfile' });

// RecruiterJob associations
RecruiterJob.belongsTo(Recruiter, { foreignKey: 'recruiter_id', as: 'recruiter' });
Recruiter.hasMany(RecruiterJob, { foreignKey: 'recruiter_id', as: 'jobs' });

// RecruiterCompanyProfile associations
RecruiterCompanyProfile.belongsTo(Recruiter, { foreignKey: 'recruiter_id', as: 'recruiter' });
Recruiter.hasOne(RecruiterCompanyProfile, { foreignKey: 'recruiter_id', as: 'companyProfile' });

// RecruiterJobApplication associations
RecruiterJobApplication.belongsTo(RecruiterJob, { foreignKey: 'job_id', as: 'job' });
RecruiterJob.hasMany(RecruiterJobApplication, { foreignKey: 'job_id', as: 'applications' });
RecruiterJobApplication.belongsTo(Student, { foreignKey: 'applicant_id', as: 'applicant' });
Student.hasMany(RecruiterJobApplication, { foreignKey: 'applicant_id', as: 'jobApplications' });

// Use unique alias names for each association
Education.belongsTo(Student, { foreignKey: 'student_id', as: 'studentInfo' });
Student.hasMany(Education, { foreignKey: 'student_id', as: 'education' });

WorkExperience.belongsTo(Student, { foreignKey: 'student_id', as: 'studentData' });
Student.hasMany(WorkExperience, { foreignKey: 'student_id', as: 'workExperiences' });

ProjectExperience.belongsTo(Student, { foreignKey: 'student_id', as: 'studentDetails' });
Student.hasMany(ProjectExperience, { foreignKey: 'student_id', as: 'projectExperiences' });

Certification.belongsTo(Student, { foreignKey: 'student_id', as: 'studentProfile' });
Student.hasMany(Certification, { foreignKey: 'student_id', as: 'certifications' });

// New associations for Task
Task.belongsTo(Student, { foreignKey: 'jobseeker_id', as: 'student' });
Student.hasMany(Task, { foreignKey: 'jobseeker_id', as: 'tasks' });
Task.belongsTo(ImportedJob, { foreignKey: 'imported_job_id', as: 'importedJob' });
ImportedJob.hasMany(Task, { foreignKey: 'imported_job_id', as: 'tasks' });

// New associations for Note
Note.belongsTo(Student, { foreignKey: 'jobseeker_id', as: 'student' });
Student.hasMany(Note, { foreignKey: 'jobseeker_id', as: 'notes' });
Note.belongsTo(ImportedJob, { foreignKey: 'imported_job_id', as: 'importedJob' });
ImportedJob.hasMany(Note, { foreignKey: 'imported_job_id', as: 'notes' });

// New associations for ImportedJob
ImportedJob.belongsTo(Student, { foreignKey: 'jobseeker_id', as: 'student' });
Student.hasMany(ImportedJob, { foreignKey: 'jobseeker_id', as: 'importedJobs' });

// New associations for Contact
Contact.belongsTo(Student, { foreignKey: 'jobseeker_id', as: 'student' });
Student.hasMany(Contact, { foreignKey: 'jobseeker_id', as: 'contacts' });
Contact.belongsTo(ImportedJob, { foreignKey: 'imported_job_id', as: 'importedJob' });
ImportedJob.hasMany(Contact, { foreignKey: 'imported_job_id', as: 'contacts' });

// New associations for Document
Document.belongsTo(Student, { foreignKey: 'jobseeker_id', as: 'student' });
Student.hasMany(Document, { foreignKey: 'jobseeker_id', as: 'documents' });
Document.belongsTo(ImportedJob, { foreignKey: 'imported_job_id', as: 'importedJob' });
ImportedJob.hasMany(Document, { foreignKey: 'imported_job_id', as: 'documents' });

// New associations for AwardAchievement
AwardAchievement.belongsTo(Student, { foreignKey: 'jobseeker_id', as: 'student' });
Student.hasMany(AwardAchievement, { foreignKey: 'jobseeker_id', as: 'awardAchievements' });

// New associations for ResumeCollection
ResumeCollection.belongsTo(Student, { foreignKey: 'jobseeker_id', as: 'student' });
Student.hasMany(ResumeCollection, { foreignKey: 'jobseeker_id', as: 'resumeCollections' });

// New associations for Preference
Preference.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Student.hasMany(Preference, { foreignKey: 'student_id', as: 'preferences' });

// Initialize database and create tables in the proper order
const initDatabase = async () => {
  try {
    // Force true will drop the table if it already exists (use with caution)
    // For production, you should use sync({ alter: true }) instead
    const forceSync = process.env.NODE_ENV === 'development' && process.env.DB_FORCE_SYNC === 'true';
    const alterSync = process.env.NODE_ENV === 'development' && !forceSync;
    
    console.log('Initializing database...');
    
    // Start by syncing the database
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models in proper order
    await User.sync({ alter: alterSync, force: forceSync });
    console.log('User model synchronized');
    
    await Student.sync({ alter: alterSync, force: forceSync });
    console.log('Student model synchronized');
    
    await Recruiter.sync({ alter: alterSync, force: forceSync });
    console.log('Recruiter model synchronized');
    
    // These models depend on Recruiter
    await RecruiterCompanyProfile.sync({ alter: alterSync, force: forceSync });
    console.log('RecruiterCompanyProfile model synchronized');
    
    await RecruiterJob.sync({ alter: alterSync, force: forceSync });
    console.log('RecruiterJob model synchronized');
    
    // These models depend on RecruiterJob and Student
    await RecruiterJobApplication.sync({ alter: alterSync, force: forceSync });
    console.log('RecruiterJobApplication model synchronized');
    
    // These models depend on Student
    await Education.sync({ alter: alterSync, force: forceSync });
    console.log('Education model synchronized');
    
    await WorkExperience.sync({ alter: alterSync, force: forceSync });
    console.log('WorkExperience model synchronized');
    
    await ProjectExperience.sync({ alter: alterSync, force: forceSync });
    console.log('ProjectExperience model synchronized');
    
    await Certification.sync({ alter: alterSync, force: forceSync });
    console.log('Certification model synchronized');
    
    // Sync new models that depend on Student
    await ImportedJob.sync({ alter: alterSync, force: forceSync });
    console.log('ImportedJob model synchronized');
    
    await AwardAchievement.sync({ alter: alterSync, force: forceSync });
    console.log('AwardAchievement model synchronized');
    
    await ResumeCollection.sync({ alter: alterSync, force: forceSync });
    console.log('ResumeCollection model synchronized');
    
    // Models that depend on Student and (potentially) ImportedJob
    await Task.sync({ alter: alterSync, force: forceSync });
    console.log('Task model synchronized');
    
    await Note.sync({ alter: alterSync, force: forceSync });
    console.log('Note model synchronized');
    
    await Contact.sync({ alter: alterSync, force: forceSync });
    console.log('Contact model synchronized');
    
    await Document.sync({ alter: alterSync, force: forceSync });
    console.log('Document model synchronized');
    
    await Preference.sync({ alter: alterSync, force: forceSync });
    console.log('Preference model synchronized');
    
    await Location.sync({ alter: alterSync, force: forceSync });
    console.log('Location model synchronized');
    
    await JobProfile.sync({ alter: alterSync, force: forceSync });
    console.log('JobProfile model synchronized');
    
    await JobData.sync({ alter: alterSync, force: forceSync });
    console.log('JobData model synchronized');
    
    console.log('All database tables have been synchronized successfully');
  } catch (error) {
    console.error('Unable to initialize database:', error);
    throw error;
  }
};

module.exports = initDatabase; 