const mongoose = require('mongoose')
const Schema = mongoose.Schema

const featureSchema = new Schema({
    age: {
        type: Number,
        required: [true, 'Path `age` is required.'],
    },
    gender: {
        type: String,
        required: [true, 'Path `gender` is required.'],
        enum: ['Male', 'Female'],
    },
    chestPainType: {
        type: String,
        required: [true, 'Path `chestPainType` is required.'],
        enum: ['TA', 'ATA', 'NAP', 'ASY'],
    },
    BPValue: {
        type: Number,
        required: [true, 'Path `BPValue` is required.'],
    },
    cholesterolLevels: {
        type: Number,
        required: [true, 'Path `cholesterolLevels` is required.'],
    },
    fastingBloodSugar: {
        type: Boolean,
        required: [true, 'Path `fastingBloodSugar` is required.'],
    },
    restingECG: {
        type: String,
        required: [true, 'Path `restingECG` is required.'],
        enum: ['Normal', 'ST-T Wave Abnormality', 'Left Ventricular Hypertrophy'],
    },
    maxHeartRate: {
        type: Number,
        required: [true, 'Path `maxHeartRate` is required.'],
    },
    exercise: {
        type: String,
        required: [true, 'Path `exercise` is required.'],
    },
    oldPeak: {
        type: Number,
        required: [true, 'Path `oldPeak` is required.'],
    },
    STSlope: {
        type: String,
        required: [true, 'Path `STSlope` is required.'],
        enum: ['Upsloping', 'Flat', 'Downsloping'],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }


}, { timestamps: true })

module.exports = mongoose.model('Feature', featureSchema)

