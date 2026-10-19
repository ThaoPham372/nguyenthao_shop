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

app.set('trust proxy', 1);

app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !req.secure && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'sdn302_nguyenthao_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

app.get('/', (req, res) => res.redirect('/orders'));

app.use('/auth', authRouter);
app.use('/orders', orderRouter);

const PORT = process.env.PORT || 3000;

const keyPath = path.join(__dirname, 'cert', 'server.key');
const certPath = path.join(__dirname, 'cert', 'server.crt');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    const sslOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    };

    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`🔒 HTTPS Server đang chạy an toàn tại: https://localhost:${PORT}`);
    });
} else {
    app.listen(PORT, () => {
        console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    });
}
