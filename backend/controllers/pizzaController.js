// pizzaController.js (Pizza Inventory Management)
const Pizza = require('../models/Pizza');

const getAllPizzas = async (req, res) => {
    try {
        const pizzas = await Pizza.find();
        res.json(pizzas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPizza = async (req, res) => {
    const { base, sauce, cheese, veggies, meat, stock } = req.body;

    try {
        const pizza = new Pizza({
            base,
            sauce,
            cheese,
            veggies,
            meat,
            stock,
        });

        const newPizza = await pizza.save();
        res.status(201).json(newPizza);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePizzaStock = async (req, res) => {
    const { stock } = req.body;

    try {
        const pizza = await Pizza.findById(req.params.id);
        if (!pizza) {
            return res.status(404).json({ message: 'Pizza not found' });
        }

        pizza.stock = stock;
        await pizza.save();

        res.json(pizza);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPizzas,
    createPizza,
    updatePizzaStock,
};
