const Order = require("../models/OrderProduct");
const bcrypt =  require("bcrypt");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, shippingMethod, paymentMethod, itemsPrice, shippingPrice, totalPrice, name, address, phone, user, isPaid, email, status } = newOrder
        try {
            const updatedOrderItems = []

            for (const order of orderItems) {
                const productData = await Product.findById(order.product)
                if (!productData || productData.countInStock < order.amount) {
                    return resolve({
                        status: 'ERR',
                        message: `Sản phẩm ${order.product} không đủ hàng`,
                    })
                }

                await Product.findByIdAndUpdate(order.product, {
                    $inc: {
                        countInStock: -order.amount,
                        selled: +order.amount
                    }
                })

                updatedOrderItems.push({
                    ...order,
                    discount: productData.discount,
                })
            }

            const createOrder = await Order.create({
                orderItems: updatedOrderItems,
                shippingAddress: {
                    name,
                    address,
                    phone
                },
                shippingMethod,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user,
                isPaid,
                status
            })
            try {
                await EmailService.sendEmailCreateOrder(
                    email,
                    updatedOrderItems, 
                    {
                      name,
                      phone,
                      address
                    },
                    shippingMethod,
                    paymentMethod,
                    shippingPrice,
                    totalPrice
                  )
                  
            } catch (error) {
                console.error("Gửi email tạo đơn hàng thất bại:", error.message)
            }

            if (createOrder) {
                return resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createOrder
                })
            } else {
                return resolve({
                    status: 'ERR',
                    message: 'Tạo đơn hàng thất bại'
                })
            }
    
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find({ user: id }).sort({ createdAt: -1 }); // lấy tất cả đơn, mới nhất trước
            if (!orders || orders.length === 0) {
                resolve({
                    status: 'OK',
                    message: 'No orders found for this user',
                    data: []
                });
            } else {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: orders
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getOrderById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(id);
            resolve(order);
        } catch (e) {
            reject(e);
        }
    });
};

const cancelOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId);
            if (!order || order.status === 'Cancelled') {
                return resolve(null);
            }
            for (let item of order.orderItems) {
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            countInStock: item.amount,
                            selled: -item.amount
                        }
                    }
                );
            }

            order.status = 'Cancelled';
            await order.save();

            resolve(order);
        } catch (error) {
            reject(error);
        }
    });
};

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()

            resolve({
                status:'OK',
                message:'SUCCESS',
                data: allOrder
            })
        } catch (e) {
            reject(e) 
        }
    })
}

const updateOrderStatus = (orderId, status, isDelivered, isPaid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId)
            if (!order) return resolve(null)
            
            order.status = status
            if (typeof isDelivered === 'boolean') order.isDelivered = isDelivered;
            if (typeof isPaid === 'boolean') order.isPaid = isPaid;

            await order.save()
            resolve(order);
        } catch (e) {
            reject(e)
        }
    })
}

const getRevenueStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const completedOrders = await Order.find({ status: 'Completed' });

            let totalRevenue = 0;
            let totalOrders = 0;
            let dailyRevenue = {};
            let monthlyRevenue = {};
            let paymentMethods = {};

            completedOrders.forEach(order => {
                totalRevenue += order.totalPrice;
                totalOrders++;

                const date = new Date(order.createdAt);
                const dayKey = date.toISOString().split('T')[0]; // yyyy-mm-dd
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // yyyy-mm

                dailyRevenue[dayKey] = (dailyRevenue[dayKey] || 0) + order.totalPrice;
                monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + order.totalPrice;

                const payment = order.paymentMethod;
                paymentMethods[payment] = (paymentMethods[payment] || 0) + order.totalPrice;
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: {
                    totalRevenue,
                    totalOrders,
                    dailyRevenue,
                    monthlyRevenue,
                    paymentMethods
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = {
    createOrder,
    getDetailsOrder,
    getOrderById,
    cancelOrder,
    getAllOrder,
    updateOrderStatus,
    getRevenueStats
}