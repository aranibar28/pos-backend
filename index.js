require("dotenv").config();
const mongoose = require("mongoose");
const compression = require("compression");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_DB).then(() => console.log("DB Online"));

app.get("/", (req, res) => res.json({ welcome: "Server online" }));
app.use("/api/kpis", require("./routes/kpis"));
app.use("/api/seed", require("./routes/seed"));
app.use("/api/users", require("./routes/users"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/business", require("./routes/business"));
app.use("/api/suppliers", require("./routes/suppliers"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/sales", require("./routes/sales"));
app.use("/api/uploads", require("./routes/uploads"));

const swagger = require("./utils/swagger");
app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo Puerto: " + process.env.PORT);
  swagger(app, process.env.PORT);
});
