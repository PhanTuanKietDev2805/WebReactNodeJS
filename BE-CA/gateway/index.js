const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const { PRODUCTS_URI, SHOPPING_URL, CUSTOMER_URL } = require("./config/index");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/customer", proxy(CUSTOMER_URL));
app.use("/shopping", proxy(SHOPPING_URL));
app.use("/", proxy(PRODUCTS_URI)); // products

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});
