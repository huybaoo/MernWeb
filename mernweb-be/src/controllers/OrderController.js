const OrderService = require('../services/OrderService');

const createOrder = async (req,res) => {
    try {
        const { shippingMethod, paymentMethod, itemsPrice, shippingPrice, totalPrice, name, address, phone, status } = req.body
        if ( !shippingMethod || !paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !name || !address || !phone || !status ) {
            return res.status(200).json({
                status:'ERR',
                message:'The input is required'
            })
        }
        const respone = await OrderService.createOrder(req.body)
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const getDetailsOrder = async (req,res) => {
    try {
        const userId = req.params.id
        if ( !userId){
            return res.status(200).json({
                status:'ERR',
                message:'The userId is required'
            })
        }
        const respone = await OrderService.getDetailsOrder(userId)
        return res.status(200).json(respone)
    } catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Order ID is required'
            });
        }

        const order = await OrderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            status: 'OK',
            message: 'SUCCESS',
            data: order
        });

    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await OrderService.cancelOrder(orderId);
        if (!order) {
            return res.status(404).json({ status: 'ERR', message: 'Order not found or already cancelled' });
        }

        return res.status(200).json({ status: 'OK', message: 'Order cancelled successfully', data: order });
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: error.message });
    }
};

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder();
        return res.status(200).json(data)
    }  catch (e) {
        return res.status(404).json({ 
            message: e
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status, isDelivered, isPaid } = req.body

        const order = await OrderService.updateOrderStatus(orderId, status, isDelivered, isPaid)
        if (!order) {
                return res.status(404).json({ status: 'ERR', message: 'Order not found' })
        }

        return res.status(200).json({ status: 'OK', message: 'Order updated', data: order })
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: error.message })
    }
}

const getRevenueStats = async (req, res) => {
    try {
        const response = await OrderService.getRevenueStats();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
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
