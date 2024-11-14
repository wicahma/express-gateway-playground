module.exports = {
  $id: "", // TODO: add $id
  type: "object",
  definitions: {
    addRemove: {
      type: "object",
      properties: {
        add: {
          type: "object",
          additionalProperties: {
            type: ["string", "number"],
          },
          minProperties: 1,
        },
        remove: {
          type: ["array"],
          items: {
            type: "string",
          },
        },
      },
      anyOf: [{ required: ["add"] }, { required: ["remove"] }],
    },
  },
  properties: {
    headers: { $ref: "#/definitions/addRemove" },
    body: { $ref: "#/definitions/addRemove" },
    secretKey: {
      type: "string",
      description: "The secret key to use for the ApiKey Validation.",
    },
    secureHeaders: {
      type: "object",
      additionalProperties: {
        type: "string",
      },
      description: "The default secure headers to validate. ex: { X-Content-Type-Options : 'nosniff' }",
    }
  },
  anyOf: [{ required: ["headers"] }, { required: ["body"] }],
};