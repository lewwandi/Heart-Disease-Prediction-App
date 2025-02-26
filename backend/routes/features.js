const express = require('express')
const {
    createFeature,
    getFeatures,
    getFeature,
    deleteFeature,
    updateFeature
} = require('../controllers/featureController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get('/', getFeatures)

//GET a single workout
router.get('/:id', getFeature)

// POST a new workout
router.post('/', createFeature)

// DELETE a workout
router.delete('/:id', deleteFeature)

// UPDATE a workout
router.patch('/:id', updateFeature)


module.exports = router