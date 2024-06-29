const express = require('express');
const auth = require('../middleware/auth');
const Score = require('../models/Score');
const User = require('../models/User');

const router = express.Router();

router.post('/submit/:rollno',async (req, res) => {
    const { rollno} = req.params;
    const { score } = req.body;

    try {
        const user = await User.findOne({ rollno });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const newScore = new Score({
            userId: user._id,
            score
        });

        const savedScore = await newScore.save();
        res.json(savedScore);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Get top scores route
router.get('/top', async (req, res) => {
    try {
        const scores = await Score.find().sort({ score: -1 }).limit(10).populate('userId', 'rollno');
        res.json(scores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
