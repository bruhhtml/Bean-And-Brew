const express = require('express');
const router = express.Router();
const path = require('path');
const { createProduct, getAllProducts } = require('./DBFunctions/productsFunctions');

function generateItemId(productId, selectedOptions) {
    // Implement your logic to generate a unique item ID based on productId and selectedOptions

    const customizationsString = JSON.stringify(selectedOptions);
    const uniqueString = `${productId}-${customizationsString}`;

    const timestamp = new Date().getTime();
    return `${uniqueString}-${timestamp}`;
}

router.get('/', (req, res) => {
    res.render(path.join(__dirname, 'ejs/home.ejs'));
});

router.get('/order', async (req, res) => {
    try {
        const allProducts = await getAllProducts();
        if (!allProducts) {
            return res.status(404).json({ error: "Products not found" });
        }
        res.render(path.join(__dirname, 'ejs/order.ejs'), { allProducts });
    } catch (err) {
        console.error("Error getting products:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/basket', (req, res) => {
    res.render(path.join(__dirname, 'ejs/basket.ejs'), { basket: req.session.basket || {} });
});

router.post('/order/basket/add', (req, res) => {
    const { product, selectedOptions, quantity } = req.body;

    if (!req.session.basket) {
        req.session.basket = {};
    }

    const itemId = generateItemId(product._id, selectedOptions);
    req.session.basket[itemId] = {
        productId: product._id,
        productName: product.productName,
        productPrice: product.productPrice,
        quantity: quantity,
        customisations: selectedOptions
    };

    res.status(200).send({ message: 'Item added to basket', basket: req.session.basket });
});

router.post('/order/basket/remove', (req, res) => {
    const { productID } = req.body;

    if (!req.session.basket) {
        req.session.basket = {};
    }

    delete req.session.basket[productID]

    res.status(200).send({ message: 'Item removed from basket', basket: req.session.basket });
});

router.get('/order/basket', (req, res) => {
    res.status(200).send({ basket: req.session.basket || {} });
});

router.post('/order/basket/clear', (req, res) => {
    req.session.basket = {};
    res.status(200).send({ message: 'Basket cleared' });
});

router.get('/products', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

module.exports = router;
