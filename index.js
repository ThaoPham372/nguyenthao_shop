require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');
const orderRouter = require('./routes/orderRouter');
const authRouter = require('./routes/authRouter');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình Session quản lý đăng nhập
app.use(session({
    secret: process.env.SESSION_SECRET || 'sdn302_nguyenthao_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 ngày
}));

// Truyền thông tin currentUser vào mọi file EJS
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// Điều hướng mặc định
app.get('/', (req, res) => res.redirect('/orders'));

app.use('/auth', authRouter);
app.use('/orders', orderRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
