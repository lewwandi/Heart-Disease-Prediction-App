require("dotenv").config();


const express = require('express');
const featureRoutes = require('./routes/features');
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require("axios")

const app = express();

app.use(express.json());
app.use(cors());


const MONGO = process.env.MONGO;
//middleware to log requests
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000';

// Make sure this route matches what you're calling from React
app.post('/api/predict', async (req, res) => {
    try {
        console.log('Received request:', req.body);

        const response = await axios.post(`${ML_SERVICE_URL}/api/predict`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: error.message || 'Error communicating with ML service'
        });
    }
});



// const sendDataToBackend = async (inputData) => {
//     try {
//         console.log("Sending Data:", inputData);  // Debugging
//         const response = await axios.post('http://127.0.0.1:5000/predict', {
//             features: inputData  // Ensure this contains 20 values
//         }, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         console.log("Prediction:", response.data);
//     } catch (error) {
//         console.error("Error:", error.response ? error.response.data : error.message);
//     }
// };


app.use('/api/features', featureRoutes);
app.use('/api/users', userRoutes);




mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));


if (!process.env.MONGO) {
    console.error('MONGO is not defined in environment variables');
    process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    process.exit(1); // Stop the server
}


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
















