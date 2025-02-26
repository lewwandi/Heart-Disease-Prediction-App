const Feature = require('../models/featureModel');
const mongoose = require('mongoose');


//get all workouts
const getFeatures = async (req, res) => {

    const user_id = req.user._id
    const features = await Feature.find({ user_id }).sort({ createdAt: -1 })
    res.status(200).json(features)

};


//get a single workout
const getFeature = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such feature' });
    }

    try {
        const feature = await Feature.findById(id);

        if (!feature) {
            return res.status(404).json({ error: 'No such feature' });
        }

        res.status(200).json(feature);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};



const createFeature = async (req, res) => {
    try {

        const requiredFields = [
            "title",
            "age",
            "gender",
            "chestPainType",
            "BPValue",
            "cholesterolLevels",
            "fastingBloodSugar",
            "restingECG",
            "maxHeartRate",
            "exercise",
            "oldPeak",
            "STSlope"
        ];

        const emptyFields = requiredFields.filter(field => !req.body[field]);


        if (emptyFields.length > 0) {
            return res.status(400).json({ error: "Please fill all the fields.", emptyFields })
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: "Unauthorized request. User ID is missing." });
        }

        const user_id = req.user._id;

        // Create feature document in database
        const feature = await Feature.create({ ...req.body, user_id });

        res.status(201).json(feature);
    } catch (error) {
        console.error("Error creating feature:", error.message);
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

//delete a workout
const deleteFeature = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such feature' })
    }
    try {
        const feature = await Feature.findByIdAndDelete(id);

        if (!feature) {
            return res.status(404).json({ error: 'No such feature' });
        }

        res.status(200).json({ message: 'Features deleted successfully', feature });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

//update a workout
const updateFeature = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Type.objectId.isValid(id)) {
        return res.status(404).json({ error: 'No such feature' })
    }
    const feature = await Fetaure.findOneAndDelete({ _id: id }, {})
    //...req.body
}


// app.post("/api/predict", async (req, res) => {
//     try {
//         const response = await fetch("http://localhost:3001/api/predict", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(req.body),
//         });

//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: "Server error" });
//     }
// });

module.exports = {
    getFeatures,
    getFeature,
    createFeature,
    deleteFeature,
    updateFeature
}