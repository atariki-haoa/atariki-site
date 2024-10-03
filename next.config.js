require('dotenv').config();

module.exports = {
  env: {
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    LLM_API_URL: process.env.LLM_API_URL,
    CSRF_SECRET: process.env.CSRF_SECRET,
  },
};
