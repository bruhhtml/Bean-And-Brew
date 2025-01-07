const express = require('express');
const router = express.Router();
const path = require('path');
const { createProduct, getAllProducts } = require('./DBFunctions/productsFunctions');
const { getUserByEmail, createUser, updateUserById} = require('./DBFunctions/userFunctions');
const { createOrder, getOrdersByUserId } = require('./DBFunctions/orderFunctions');
const { compareData } = require('./middleware/encryption');
const { error } = require('console');

function generateItemId(productId, selectedOptions) {

    const customizationsString = JSON.stringify(selectedOptions);
    const uniqueString = `${productId}-${customizationsString}`;

    const timestamp = new Date().getTime();
    return `${uniqueString}-${timestamp}`;
}

router.get('/account', (req, res) => {

    res.render(path.join(__dirname, 'ejs/account.ejs'), {user: req.session.user ? req.session.user : null, activeTab: 'personalInfo'})

})

router.get('/account/orders', async (req, res) => {

    const userOrders = await getOrdersByUserId(req.session.user?.id);

    res.render(path.join(__dirname, 'ejs/account.ejs'), {user: req.session.user ? req.session.user : null, activeTab: 'orders', orders: userOrders || null})

})

router.post('/login-user/:email/:password', async (req, res) => {
    const email = req.params.email; 
    const password = String(req.params.password);

    try {

        const user = await getUserByEmail(email);

        console.log(user);

        if (!user.email) {
            res.status(404).json({ error: "Account not found" });
        }

        const isMatch = await compareData(password, user.password);

        if (!isMatch) {
            res.status(401).json({ error: "Invalid password" });
        }

        req.session.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user._id,
            phone: user.phone,
        };
        res.json({message: 'success'});
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

router.post('/create-user/:email/:password', async (req, res) => {
    const email = req.params.email;
    const password = String(req.params.password);

    try {
        const existingUser = await getUserByEmail(email);

        if (existingUser.email) {
            res.status(409).json({ error: 'Account already exists.' });
        }

        const newUser = await createUser({ email, password });
        console.log('New user created with ID:', newUser._id);

        res.redirect('/account');
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

router.post('/create-user-finish/:firstName/:lastName/:phone', async (req, res) => {
    const { firstName, lastName, phone } = req.params;

    const userID = req.session.user?.id;

    if (!userID) {
        return res.status(400).json({ error: 'User is not authenticated.' });
    }

    try {
        const data = { firstName, lastName, phone };

        const updatedUser = await updateUserById(userID, data);
        console.log('User updated with ID:', userID);

        res.redirect('/account');
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

router.get('/signout', async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Failed to destroy session');
            }
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});


router.get('/', (req, res) => {
    res.render(path.join(__dirname, 'ejs/home.ejs'), {user: req.session.user ? req.session.user : null});
});

router.get('/order', async (req, res) => {
    try {
        const allProducts = await getAllProducts();
        if (!allProducts) {
            return res.status(404).json({ error: "Products not found" });
        }
        res.render(path.join(__dirname, 'ejs/order.ejs'), { allProducts, user: req.session.user ? req.session.user : null});
    } catch (err) {
        console.error("Error getting products:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/basket', (req, res) => {
    res.render(path.join(__dirname, 'ejs/basket.ejs'), { basket: req.session.basket || {}, user: req.session.user ? req.session.user : null });
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
    res.status(200).send({ basket: req.session.basket || {}, user: req.session.user ? req.session.user : null });
});

router.post('/order/basket/clear', (req, res) => {
    req.session.basket = {};
    res.status(200).send({ message: 'Basket cleared' });
});

router.post('/create-order/:firstName/:lastName/:email/:phone', async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.params;
        const userId = req.session.user?.id;
        const basket = req.session.basket;

        console.log(userId)

        const data = {
            user: userId || null,
            ...req.params,
            basket

        }
        
        console.log(data);

        console.log('Order Created')

        const newOrder = await createOrder(data)

        console.log(newOrder)
        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order', error });
    }
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
