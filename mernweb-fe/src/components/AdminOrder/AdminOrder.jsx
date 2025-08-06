import React from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const AdminOrder = () => {
    const user = useSelector((state) => state?.user)
  
    const getAllOrders = async (token) => {
        const res = await OrderService.getAllOrder(token)
        return res
    }

    const queryOrder = useQuery({
        queryKey: ['orders', user?.access_token],
        queryFn: () => getAllOrders(user?.access_token),
        enabled: !!user?.access_token,
    });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder

    const handleUpdateStatus = async (orderId, newStatus, isDelivered, isPaid) => {
        try {
            await OrderService.updateOrderStatus(orderId, user?.access_token, newStatus, isDelivered, isPaid);
            queryOrder.refetch(); 
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
        }
    };

    const renderAction = (record) => {
        const status = record.status;
        return (
            <div style={{ display: 'flex', gap: '10px' }}>
                {status === 'Pending' && (
                    <button
                        onClick={() => handleUpdateStatus(record._id, 'Confirmed', false, record.isPaid)}
                        style={{ background: 'orange', color: '#fff', border: 'none', padding: '6px 10px', cursor: 'pointer' }}
                    >
                        Xác nhận
                    </button>
                )}
                {status === 'Confirmed' && (
                    <button
                        onClick={() => handleUpdateStatus(record._id, 'Delivering', false, record.isPaid)}
                        style={{ background: '#1677ff', color: '#fff', border: 'none', padding: '6px 10px', cursor: 'pointer' }}
                    >
                        Giao hàng
                    </button>
                )}
            </div>
        );
    };

    const columns = [
        {
          title: 'Id',
          dataIndex: '_id',
        },
        {
            title: 'Thông tin người đặt hàng',
            key: 'shippingInfo',
            render: (record) => {
                const { shippingAddress } = record;
                return (
                    <div>
                        <div><strong>Tên: </strong>{shippingAddress?.name}</div>
                        <div><strong>Địa chỉ: </strong>{shippingAddress?.address}</div>
                        <div><strong>SĐT: </strong>{shippingAddress?.phone}</div>
                    </div>
                )
            }
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'orderItems',
            render: (items) => items?.map(item => `${item.name} (${item.amount})`).join(', ')
        },
        {
            title: 'Phí vận chuyển',
            dataIndex: 'shippingPrice',
            render: (value) => `${value?.toLocaleString()}đ`
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            render: (value) => `${value?.toLocaleString()}đ`
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'Pending':
                        color = 'orange';
                        break;
                    case 'Confirmed':
                    case 'Delivering':
                        color = '#1677ff';
                        break;
                    case 'Completed':
                        color = 'green';
                        break;
                    case 'Cancelled':
                        color = 'red';
                        break;
                    default:
                        color = 'gray';
                }
        
                return (
                    <span style={{ 
                        color: '#fff', 
                        backgroundColor: color, 
                        padding: '4px 10px', 
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                    }}>
                        {status}
                    </span>
                );
            }
        },        
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'createdAt',
            render: (value) => new Date(value).toLocaleString()
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => renderAction(record)
        }
    ];

    const dataTable = orders?.data
    ?.slice() 
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.map((order) => ({
      ...order,
      key: order._id,
    }));

    return (
        <div>
            <WrapperHeader>QUẢN LÝ HÓA ĐƠN</WrapperHeader>
            <div style={{ marginTop: '20px'}}>
                <TableComponent isLoading={isLoadingOrders} columns={columns} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            
                        }
                    };
                }} />
            </div>
        </div>
    )
}

export default AdminOrder;