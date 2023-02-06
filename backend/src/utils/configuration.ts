export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: 'student',
    password: 'student',
    database: 'nest_project',
  },
  JWT_SECRET: 'jwt_secret',
});
