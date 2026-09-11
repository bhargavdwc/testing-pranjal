const requiredEnv = [
  "MONGODB_URI",
  "JWT_SECRET",
  "FRONTEND_URL",
  "BREVO_API_KEY_OFFICE",
  "RECAPTCHA_SECRET_KEY",
  "BLOG_ADMIN_USERNAME",
  "BLOG_ADMIN_PASSWORD",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

requiredEnv.forEach((key) => {

  if (!process.env[key]) {

    throw new Error(`Missing required environment variable: ${key}`);

  }

});