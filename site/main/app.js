const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { connect, disconnect } = require('./mongooseDB');
const { createProduct, getAllProducts } = require('./DBFunctions/productsFunctions');
const routes = require("./routes");
const mongoose = require('./mongooseDB');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(session({
    secret: '$2b$10$6Q4IH9TEmSGaqk2ESDLXO.tA54/bAgDV3XtnPSNZEHbQM7L618pUK',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://tinisticbusiness:fLq5cEA399HAX5nG@beanandbrewdatabase.9txkjup.mongodb.net/?retryWrites=true&w=majority&appName=BeanAndBrewDatabase',
        collectionName: 'sessions'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use('/', routes);

async function checkDBActive() {
  let connection;
  try {
      connection = await connect();
      console.log("From app => Connected successfully!");
  } catch (error) {
      console.error('Error running query:', error);
  } finally {
      if (connection) {
          await disconnect();
      }
  }
}

checkDBActive();

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
