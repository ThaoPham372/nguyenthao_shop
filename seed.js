require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
const User = require('./models/userModel');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Đã kết nối MongoDB để khởi tạo dữ liệu...");

        await User.deleteMany({});
        const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
        const hashedPasswordStaff = await bcrypt.hash('staff123', 10);

        await User.create([
            {
                username: "admin",
                password: hashedPasswordAdmin,
                fullName: "Quản Trị Viên (Admin)",
                role: "admin"
            },
            {
                username: "staff",
                password: hashedPasswordStaff,
                fullName: "Nhân Viên Bán Hàng (Staff)",
                role: "staff"
            }
        ]);
        console.log("✅ Đã tạo tài khoản mẫu (Admin & Staff)!");

        await Product.deleteMany({});
        await Product.create([
            {
                productName: "Wireless Mouse",
                category: "Electronics",
                stockStatus: "in_stock",
                unitPrice: 250000,
                tags: ["bestseller", "wireless", "accessory"]
            },
            {
                productName: "Mechanical Keyboard",
                category: "Electronics",
                stockStatus: "in_stock",
                unitPrice: 1200000,
                tags: ["gaming", "keyboard"]
            },
            {
                productName: "Iphone 17 ProMax",
                category: "Electronics",
                stockStatus: "in_stock",
                unitPrice: 35000000,
                tags: ["phone", "bestseller"]
            }
        ]);

        await Order.deleteMany({});
        await Order.create([
            {
                customerName: "Nguyen Thi Lan",
                productName: "Wireless Mouse",
                quantity: 2,
                orderDate: new Date("2024-10-17"),
                totalPrice: 500000
            },
            {
                customerName: "Pham Van Duc",
                productName: "Mechanical Keyboard",
                quantity: 1,
                orderDate: new Date("2024-10-18"),
                totalPrice: 1200000
            }
        ]);

        console.log("✅ Đã tạo toàn bộ dữ liệu mẫu thành công!");
        process.exit();
    } catch (error) {
        console.error("❌ Lỗi seed:", error);
        process.exit(1);
    }
};

seedData();
