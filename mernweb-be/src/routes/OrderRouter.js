const express = require("express");
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authMiddleWare, authUserMiddleWare } = require('../middleware/authMiddleWare');

router.post('/create', authUserMiddleWare ,OrderController.createOrder)
router.get('/get-order-details/:id', OrderController.getDetailsOrder)
router.get('/order-details/:id', OrderController.getOrderById);
router.put('/cancel-order/:orderId', authUserMiddleWare, OrderController.cancelOrder);
router.get('/get-all-order', authMiddleWare, OrderController.getAllOrder);
router.put('/update-status/:orderId', authMiddleWare, OrderController.updateOrderStatus);
router.get('/revenue-stats', authMiddleWare, OrderController.getRevenueStats);

module.exports = router;