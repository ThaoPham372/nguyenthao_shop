// 1. Authentication (Xác thực: Đã đăng nhập chưa?)
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect('/auth/login');
};

// 2. Authorization (Phân quyền: Có đúng quyền cho phép không?)
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/auth/login');
        }
        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).send(`
                <div style="font-family: Arial; text-align: center; margin-top: 50px;">
                    <h2 style="color: #D32F2F;">403 Forbidden - Bạn không có quyền thực hiện thao tác này!</h2>
                    <p>Chức năng này chỉ dành cho tài khoản có quyền: <b>${allowedRoles.join(', ')}</b>.</p>
                    <a href="/orders" style="display: inline-block; padding: 8px 16px; background-color: #1976D2; color: white; text-decoration: none; border-radius: 4px;">Quay lại danh sách đơn hàng</a>
                </div>
            `);
        }
        next();
    };
};

module.exports = { isAuthenticated, authorizeRole };
