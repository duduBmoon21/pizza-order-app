// Pizza.js (Pizza Schema)
const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
    base: { type: String, required: true },
    sauce: { type: String, required: true },
    cheese: { type: String, required: true },
    veggies: [{ type: String }],
    meat: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Pizza', pizzaSchema);
