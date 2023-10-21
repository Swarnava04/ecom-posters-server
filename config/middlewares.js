module.exports = [
  // ...
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "res.cloudinary.com",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "market-assets.strapi.io",
            "res.cloudinary.com",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::poweredBy",
  {
    name: "strapi::cors",
    config: {
      origin: ["http://localhost:1337", "http://localhost:3000"],
      headers: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization", // Include any additional headers your app uses
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      expose: ["Content-Type", "Authorization"],
      credentials: true,
    },
  },
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  // ...
];
