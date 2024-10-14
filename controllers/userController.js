const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({
            message: "User created successfully.",
            user_id: newUser._id
        });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            status: false,
            message: "Invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            status: false,
            message: "Invalid email or password"
        });
    }

    res.status(200).json({
        message: "Login successful."
    });
};
