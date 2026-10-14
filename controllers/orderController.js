const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.render('order', { orders });
    } catch (error) {
        next(error);
    }
};

exports.renderCreateForm = (req, res) => {
    res.render('createOrder', { errorMessage: null });
};

exports.createOrder = async (req, res, next) => {
    try {
        const { customerName, productName, quantity, orderDate } = req.body;
        const product = await Product.findOne({ productName: productName.trim() });
        if (!product) {
            return res.render('createOrder', {
                errorMessage: `Sản phẩm "${productName}" không tồn tại trong hệ thống!`
            });
        }

        const totalPrice = Number(quantity) * product.unitPrice;

        await Order.create({
            customerName: customerName.trim(),
            productName: product.productName,
            quantity: Number(quantity),
            orderDate: orderDate ? new Date(orderDate) : new Date(),
            totalPrice
        });

        res.redirect('/orders');
    } catch (error) {
        next(error);
    }
};

exports.renderUpdateForm = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.redirect('/orders');
        }
        res.render('updateOrder', { order, errorMessage: null });
    } catch (error) {
        next(error);
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { customerName, productName, quantity, orderDate } = req.body;

        const product = await Product.findOne({ productName: productName.trim() });
        if (!product) {
            const order = await Order.findById(id);
            return res.render('updateOrder', {
                order,
                errorMessage: `Sản phẩm "${productName}" không tồn tại trong hệ thống!`
            });
        }

        const totalPrice = Number(quantity) * product.unitPrice;

        await Order.findByIdAndUpdate(id, {
            customerName: customerName.trim(),
            productName: product.productName,
            quantity: Number(quantity),
            orderDate: orderDate ? new Date(orderDate) : new Date(),
            totalPrice
        });

        res.redirect('/orders');
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.redirect('/orders');
    } catch (error) {
        next(error);
    }
};
