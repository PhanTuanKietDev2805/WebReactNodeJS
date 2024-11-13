const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  PRODUCTS_URI: process.env.PRODUCTS_URI,
  SHOPPING_URL: process.env.SHOPPING_URL,
  CUSTOMER_URL: process.env.CUSTOMER_URL,
};
