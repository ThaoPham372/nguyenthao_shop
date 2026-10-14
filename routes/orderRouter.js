const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, authorizeRole } = require('../middlewares/authMiddleware');

// Tất cả các route quản lý đơn hàng đều yêu cầu PHẢI ĐĂNG NHẬP
router.use(isAuthenticated);

// Xem danh sách và Tạo mới: Cả 'admin' và 'staff' đều có quyền
router.get('/', orderController.getAllOrders);
router.get('/create', orderController.renderCreateForm);
router.post('/create', orderController.createOrder);

// Cập nhật và Xóa: CHỈ 'admin' mới có quyền thực hiện
router.get('/update/:id', authorizeRole('admin'), orderController.renderUpdateForm);
router.post('/update/:id', authorizeRole('admin'), orderController.updateOrder);
router.post('/delete/:id', authorizeRole('admin'), orderController.deleteOrder);

module.exports = router;
