const jsonParser = require("express").json();
const urlEncoded = require("express").urlencoded({ extended: true });
const formUrlEncoded = require("form-urlencoded/form-urlencoded.js");
const { PassThrough } = require("stream");

const defaultSecureHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Frame-Options": "SAMEORIGIN",
  "Content-Type": "application/json",
};

const lowercaseTrimmer = (str) => str.toLowerCase().replace(/\s/g, "");

module.exports = {
  schema: require("./schema"),
  policy: ({
    headers,
    body,
    secretKey = "123456",
    secureHeaders = defaultSecureHeaders,
  }) => {
    return (req, res, next) => {
      for (const header in secureHeaders) {
        const val = req.headers[header];
        if (lowercaseTrimmer(val) !== lowercaseTrimmer(secureHeaders[header])) {
          res.status(400).json({
            status: false,
            message: "Invalid header!",
          });
          return;
        }
      }

      if (secretKey) {
        const apiKey = req.headers["APIKey"];
        if (apiKey !== secretKey) {
          res.status(400).json({
            status: false,
            message: "Invalid API key!",
          });
          return;
        }
      }

      let contentType = "application/x-www-form-urlencoded";

      if (headers) {
        transformObject(headers, req.egContext, req.headers);
      }

      if (body) {
        jsonParser(req, res, (err) => {
          if (err) return next(err);
          if (Object.keys(req.body).length !== 0)
            contentType = "application/json";

          urlEncoded(req, res, (err) => {
            if (err) return next(err);
            if (Object.keys(req.body).length === 0)
              contentType = "application/json";

            const serializeFn =
              contentType === "application/json"
                ? JSON.stringify
                : formUrlEncoded;

            const bodyData = serializeFn(
              transformObject(body, req.egContext, req.body)
            );

            req.headers["content-length"] = Buffer.byteLength(bodyData);
            req.headers["content-type"] = contentType;

            req.egContext.requestStream = new PassThrough();
            req.egContext.requestStream.write(bodyData);

            next();
          });
        });
      } else {
        next();
      }
    };
  },
};
