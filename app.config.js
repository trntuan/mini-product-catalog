const { config: dotenvConfig } = require('dotenv');

dotenvConfig();

module.exports = ({ config: expoConfig }) => ({
  ...expoConfig,
  extra: {
    ...expoConfig.extra,
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    baseUrl: process.env.API_BASE_URL,
    timeout: process.env.TIMEOUT,
  },
  eas: {
    ...expoConfig.eas,
    projectId: process.env.EAS_PROJECT_ID,
  },
});
