const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const cityCodeSchema= new Schema({
    city: String,
    airportCode: String
});
const CityCode = mongoose.model("CityCode",cityCodeSchema);

module.exports = CityCode;