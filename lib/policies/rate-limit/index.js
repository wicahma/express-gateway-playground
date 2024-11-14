module.exports = {
  policy: require("./rate-limit"),
  schema: {
    $id: "http://express-gateway.io/schemas/policies/rate-limit.json",
    type: "object",
    properties: {
      rateLimitBy: {
        type: "string",
        description:
          "The criteria that is used to limit the number of requests by. Can be a JS Expression",
      },
      windowMs: {
        type: "integer",
        default: 60000,
        description: "How long to keep records of requests in memory.",
      },
      limit: {
        type: "integer",
        default: 5,
        description:
          "Limit a connections into a certain number during windowMs milliseconds before sending a 429 response. Set to 0 to disable.",
      },
      legacyHeaders: {
        type: "boolean",
        default: false,
        description: "Use X-RateLimit-* headers per response.",
      },
      passOnStoreError: {
        type: "boolean",
        default: false,
        description:
          "If true, the rate limiter will pass therequest if there is any error in the store.",
      },
      skipFailedRequests: {
        type: "boolean",
        default: false,
        description:
          "If true, the library will (by default) skip all requests that have a 4XX or 5XX status.",
      },
      message: {
        type: "string",
        default: "Too many requests, please try again later.",
        description: "Error message returned when max is exceeded.",
      },
      statusCode: {
        type: "integer",
        default: 429,
        description: "HTTP status code returned when max is exceeded.",
      },
    },
  },
};
