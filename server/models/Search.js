const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchSchema= new Schema({
    fromCity: {type: String, required: true},
    fromDate: {type: Date, required: true},
    toDate: {type: Date, required: true},
    fromTemp: {type: Number, required: true},
    toTemp: {type: Number, required: true},
    maxPrice: Number,
    flightDuration: Number,
});
const Search = mongoose.model("Search", searchSchema);

module.exports = Search;