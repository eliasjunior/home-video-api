const dotenv = require("dotenv");

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "test";
}

dotenv.config({ path: ".env.test" });
