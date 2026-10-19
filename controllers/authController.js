const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.renderLogin = (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/orders');
    }
    res.render('login', { errorMessage: null });
};

exports.handleLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username ? username.trim() : '' });
        if (!user) {
            return res.render('login', { errorMessage: 'Tài khoản không tồn tại!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { errorMessage: 'Mật khẩu không chính xác!' });
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            role: user.role
        };

        res.redirect('/orders');
    } catch (error) {
        next(error);
    }
};

exports.handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};
