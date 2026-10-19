const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, authorizeRole } = require('../middlewares/authMiddleware');

router.use(isAuthenticated);

router.get('/', orderController.getAllOrders);
router.get('/create', orderController.renderCreateForm);
router.post('/create', orderController.createOrder);

router.get('/update/:id', authorizeRole('admin'), orderController.renderUpdateForm);
router.post('/update/:id', authorizeRole('admin'), orderController.updateOrder);
router.post('/delete/:id', authorizeRole('admin'), orderController.deleteOrder);

module.exports = router;
