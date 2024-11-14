const { createLogger, format, transports } = require("winston");
const chalk = require("chalk").default;
const { combine, colorize, label, printf, splat, timestamp } = format;

const logFormat = (loggerLabel) =>
  combine(
    timestamp(),
    splat(),
    colorize(),
    label({ label: loggerLabel }),
    printf(
      (info) =>
        `${info.timestamp} ${chalk.cyan(info.label)} ${info.level}: ${
          info.message
        }`
    )
  );

const createLoggerWithLabel = (label) =>
  createLogger({
    level: process.env.LOG_LEVEL || "info",
    transports: [
      new transports.Console({}),
      new transports.File({
        filename: "error.log",
        level: "error",
        dirname: "logs",
      }),
      new transports.File({ filename: "combined.log", dirname: "logs" }),
    ],
    exceptionHandlers: [
      new transports.File({ filename: "exceptions.log", dirname: "logs" }),
    ],
    format: logFormat(label),
  });

module.exports = {
  gateway: createLoggerWithLabel("[EG-Ext:gateway]"),
  policy: createLoggerWithLabel("[EG-Ext:policy]"),
  config: createLoggerWithLabel("[EG-Ext:config]"),
  db: createLoggerWithLabel("[EG-Ext:db]"),
  admin: createLoggerWithLabel("[EG-Ext:admin]"),
  plugins: createLoggerWithLabel("[EG-Ext:plugins]"),
  createLoggerWithLabel,
};
