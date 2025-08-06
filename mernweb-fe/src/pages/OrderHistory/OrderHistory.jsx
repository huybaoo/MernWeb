import React from 'react';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import {
    WrapperOrderHistory,
    WrapperStyleHeader,
    OrderCard,
    OrderInfoRow,
    ProductList,
    OrderStatus,
    ButtonGroup
} from './style';
import { useNavigate } from 'react-router-dom';
import { Button, Popconfirm, message } from 'antd';

const OrderHistory = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const fetchOrderHistory = async () => {
        const res = await OrderService.getOrderByUserId(user?.id, user?.access_token);
        return res.data;
    };

    const { isLoading, data, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchOrderHistory,
        enabled: !!user?.id && !!user?.access_token,
    });

    const handleCancelOrder = async (orderId) => {
        try {
            await OrderService.cancelOrderById(orderId, user.access_token);
            message.success('Đã hủy đơn hàng');
            refetch();
        } catch (error) {
            message.error('Hủy đơn thất bại');
        }
    };
    

    const handleViewDetail = (order) => {
        navigate(`/order-details/${order._id}`);
    };

    const handleMarkAsReceived = async (orderId) => {
        try {
            await OrderService.updateOrderStatus(orderId, user.access_token, 'Completed', true, true);
            message.success('Cảm ơn bạn đã xác nhận đã nhận hàng!');
            refetch();
        } catch (error) {
            message.error('Xác nhận thất bại');
        }
    };    

    if (isLoading) return <WrapperOrderHistory>Loading...</WrapperOrderHistory>;

    return (
        <WrapperOrderHistory>
            <WrapperStyleHeader>Lịch sử đơn hàng</WrapperStyleHeader>
    
            {!user?.id || !user?.access_token ? (
                <p>Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>
            ) : isLoading ? (
                <p>Đang tải đơn hàng...</p>
            ) : !data || !Array.isArray(data) ? (
                <p>Không thể tải lịch sử đơn hàng.</p>
            ) : data.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                data.map((order) => (
                    <OrderCard key={order._id}>
                        <OrderInfoRow>
                            <span><strong>Mã đơn hàng:</strong> {order._id}</span>
                            <span><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</span>
                        </OrderInfoRow>
                        <OrderInfoRow>
                            <span><strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()}₫</span>
                        </OrderInfoRow>
                        <ProductList>
                            {order.orderItems.map((item, idx) => (
                                <li key={idx}>{item.name} x{item.amount}</li>
                            ))}
                        </ProductList>
                        <OrderStatus>
                            <span className={order.isPaid ? 'paid' : 'unpaid'}>
                                {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </span>
                            {" / "}
                            <span className={order.isDelivered ? 'delivered' : 'undelivered'}>
                                {order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}
                            </span>
                            {" | "}
                            <span className={`status ${order.status?.toLowerCase()}`}>
                                {
                                order.status === 'Cancelled' ? 'Đã hủy' :
                                order.status === 'Delivering' ? 'Đang giao hàng' :
                                order.status === 'Delivered' ? 'Đã giao hàng' :
                                order.status === 'Pending' ? 'Đang xử lý' :
                                order.status === 'Confirmed' ? 'Đã xác nhận' :
                                order.status === 'Completed' ? 'Giao thành công' :
                                order.status || 'Chưa xác định'
                                }
                            </span>
                        </OrderStatus>
                        <ButtonGroup>
                            <Button type="primary" onClick={() => handleViewDetail(order)}>
                                Xem chi tiết
                            </Button>
                            <Popconfirm
                                title="Bạn chắc chắn muốn hủy đơn này?"
                                onConfirm={() => handleCancelOrder(order._id)}
                                okText="Có"
                                cancelText="Không"
                                disabled={order.isPaid || order.isDelivered || order.status === 'Cancelled' || order.status === 'Confirmed' || order.status === 'Delivering'}
                            >
                                <Button
                                    type="default"
                                    danger
                                    disabled={order.isPaid || order.isDelivered || order.status === 'Cancelled' || order.status === 'Confirmed' || order.status === 'Delivering'}
                                >
                                    Hủy đơn
                                </Button>
                            </Popconfirm>
                            {order.status === 'Delivering' && (
                                <Popconfirm
                                    title="Xác nhận đơn hàng"
                                    onConfirm={() => handleMarkAsReceived(order._id)}
                                    okText="Đã nhận"
                                    cancelText="Chưa nhận"
                                >
                                    <Button type="primary" ghost>
                                        Đã nhận hàng
                                    </Button>
                                </Popconfirm>
                            )}
                        </ButtonGroup>
                    </OrderCard>
                ))
            )}
        </WrapperOrderHistory>
    );
};

export default OrderHistory;
