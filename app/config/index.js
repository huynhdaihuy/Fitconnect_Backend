const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    uri: "mongodb://127.0.0.1:27017/recipe",
  },
  secretKey: "onodamichi-secret-key",
  jwt: {
    refreshExpiresIn: 86400,
    accessExpiresIn: 60*60,
    refreshSecret: "Blackism coder",
  },
};

module.exports = config;
