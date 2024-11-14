const logger = require("./instance");

module.exports = (params) => (req, res, next) => {
  try {
    const start = new Date();

    res.on("finish", () => {
      logger.info(
        `${req.egContext.evaluateAsTemplateString(params.message)} - ${
          start - new Date()
        }ms`
      );
    });
  } catch (e) {
    logger.error(`failed to build log message: ${e.message}`);
  }
  next();
};
