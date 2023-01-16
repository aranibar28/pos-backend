const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Sistema Punto de Venta", version: "1.0.0" },
  },
  apis: ["../routes/categories"],
};

const swaggerSpec = swaggerJsdoc(options);

const swagger = (app, port) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (req, res) => {
    res.send(swaggerSpec);
  });
};

module.exports = swagger;
