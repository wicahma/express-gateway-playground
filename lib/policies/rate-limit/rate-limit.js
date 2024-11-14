const erl = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const logger = require("../../logger").policy;

module.exports = (params) => {
  if (params.rateLimitBy) {
    params.keyGenerator = (req) => {
      try {
        return req.egContext.evaluateAsTemplateString(params.rateLimitBy);
      } catch (err) {
        logger.error(
          "Failed to generate rate-limit key with config: %s; %s",
          params.rateLimitBy,
          err.message
        );
      }
    };
  }
  return erl.rateLimit(
    Object.assign(params, {
      store: new RedisStore({
        sendCommand: (command, ...args) =>
          require("../../db").send_command(command, ...args),
      }),
    })
  );
};
