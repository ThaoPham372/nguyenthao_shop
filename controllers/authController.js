const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// 1. Hiển thị trang đăng nhập
exports.renderLogin = (req, res) => {
    // Nếu đã đăng nhập rồi thì chuyển thẳng vào trang quản lý đơn hàng
    if (req.session && req.session.user) {
        return res.redirect('/orders');
    }
    res.render('login', { errorMessage: null });
};

// 2. Xử lý logic đăng nhập
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

        // Lưu thông tin người dùng vào Session (trừ mật khẩu)
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

// 3. Xử lý đăng xuất
exports.handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};
