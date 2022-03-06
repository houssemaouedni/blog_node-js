const mongosse = require("mongoose");

const categorySchema = mongosse.Schema({
  title: String,
  description: String,

});

module.exports = mongosse.model("Category", categorySchema);
