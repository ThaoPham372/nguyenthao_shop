require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
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

// 1. Cho phép tin cậy Reverse Proxy (khi deploy Render/Cloud)
app.set('trust proxy', 1);

// 2. Tự động ép chuyển hướng từ HTTP sang HTTPS khi chạy trên Production (Render/Cloud)
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !req.secure && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});

// 3. Cấu hình Session quản lý đăng nhập an toàn
app.use(session({
    secret: process.env.SESSION_SECRET || 'sdn302_nguyenthao_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 ngày
        secure: process.env.NODE_ENV === 'production' // Chỉ gửi cookie qua HTTPS khi trên Production
    }
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

// 4. KIỂM TRA VÀ KHỞI ĐỘNG SERVER BẰNG HTTPS HOẶC HTTP
const keyPath = path.join(__dirname, 'cert', 'server.key');
const certPath = path.join(__dirname, 'cert', 'server.crt');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    // Khi chạy ở Local (có chứng chỉ SSL tự ký)
    const sslOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    };

    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`🔒 HTTPS Server đang chạy an toàn tại: https://localhost:${PORT}`);
    });
} else {
    // Khi chạy trên Render (Render sẽ tự động bọc tầng SSL Let's Encrypt ở bên ngoài)
    app.listen(PORT, () => {
        console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    });
}
