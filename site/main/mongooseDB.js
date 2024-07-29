const mongoose = require('mongoose');

const uri = "mongodb+srv://tinisticbusiness:fLq5cEA399HAX5nG@beanandbrewdatabase.9txkjup.mongodb.net/?retryWrites=true&w=majority&appName=BeanAndBrewDatabase";
const clientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: { version: '1', strict: true, deprecationErrors: true }
};

mongoose.connect(uri, clientOptions)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

module.exports = mongoose;


// connect,
    // disconnect

// Connect to MongoDB
// async function connect() {
//     try {
//         await mongoose.connect(uri, clientOptions);
//         await mongoose.connection.db.admin().command({ ping: 1 });
//         console.log("Connected to MongoDB");
//         return mongoose.connection;
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         throw error;
//     }
// }

// Disconnect from MongoDB
// async function disconnect() {
//     try {
//         await mongoose.disconnect();
//         console.log("Disconnected from MongoDB");
//     } catch (error) {
//         console.error("Error disconnecting from MongoDB:", error);
//         throw error;
//     }
// }
