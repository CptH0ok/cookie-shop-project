const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const router = express.Router();
const { authenticateJWT } = require('./middlewares');

// using the authenticateJWT just to parse the token
// Remote google login using Google OAuth API
// savev to DB also for later use
router.get('/googlelogin', authenticateJWT, async(req, res) => {
    const [googleId, email, name] = [req.user.sub, req.user.email, req.user.name];

    let user = await User.findOne({ email });

    if (user) {
        console.info('User already exists in db');
    }

    else{
        user = new User({ googleId, email, name, role: 'admin' });
        await user.save();
    }

    res.sendStatus('200');
});
  
// Local email signup via mongodb
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
        return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ email, password: hashedPassword, name });
        await user.save();

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
  
// Local email login via mongodb
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
        return res.status(400).json({ message: 'No such user' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
        return res.status(400).json({ message: 'Wrong password' });
        }

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Token verification route
router.get('/verify-token', authenticateJWT, (req, res) => {
    res.status(200).json({ name: req.user.name}); // Send 200 OK if the token is valid
});

  module.exports = router;