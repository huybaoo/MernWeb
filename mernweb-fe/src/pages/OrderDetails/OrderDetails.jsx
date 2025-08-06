import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { convertPrice } from '../../utils'
import { useSelector } from 'react-redux'
import { Row, Col, Image, message } from 'antd'
import {
    WrapperInfo,
    WrapperStyleHeader,
    WrapperTotal,
    WrapperValue
} from './style'
import { WrapperInputNumber, WrapperQualityProduct } from '../../components/ProductDetailsComponent/style'
import { orderContant } from '../../contant'

const OrderDetails = () => {
    const { orderId } = useParams()
    const user = useSelector((state) => state.user)
    const [order, setOrder] = useState(null)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await OrderService.getOrderById(orderId, user.access_token)
                if (res.status === 'OK') {
                    setOrder(res.data)
                } else {
                    message.error('Không tìm thấy đơn hàng')
                }
            } catch (err) {
                message.error('Lỗi khi lấy chi tiết đơn hàng')
            }
        }

        if (orderId && user?.access_token) {
            fetchOrder()
        }
    }, [orderId, user])

    

    if (!order) return <div>Đang tải chi tiết đơn hàng...</div>

    return (
        <div style={{ width: '1000px', margin: '0 auto', background: '#fff', padding: 20 }}>
            <WrapperStyleHeader>Chi tiết đơn hàng</WrapperStyleHeader>
            <WrapperTotal style={{ marginBottom: 10, marginRight: 10 }}>
                <h3>Thông tin người đặt hàng:</h3>
                <p><strong>Họ tên:</strong> {order.shippingAddress.name}</p>
                <p><strong>Số điện thoại:</strong> {order.shippingAddress.phone}</p>
                <p><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress.address}</p>
            </WrapperTotal>
            <WrapperTotal style={{ marginBottom: 10, marginRight: 10 }}>
                <h3>Phương thức giao hàng: 
                    <WrapperValue><span style={{ fontWeight: 600 }}>{orderContant.shippingMethod[order.shippingMethod]}</span></WrapperValue>
                </h3>
                <h3>Phương thức thanh toán: 
                    <WrapperValue><span style={{ fontWeight: 600 }}>{orderContant.paymentMethod[order.paymentMethod]}</span></WrapperValue>
                </h3>
                <h3>Phí giao hàng: 
                    <WrapperValue><span style={{ fontWeight: 600 }}>{convertPrice(order.shippingPrice)}</span></WrapperValue>
                </h3>
                <h3>Tổng hóa đơn: 
                    <WrapperValue><span style={{ fontWeight: 600, color: 'red' }}>{convertPrice(order.totalPrice)}</span></WrapperValue>
                </h3>
                <h3>Danh sách sản phẩm:</h3>
                <Row style={{ borderBottom: '1px solid #ccc', paddingBottom: 12 }}>
                    <Col span={8}>Sản phẩm</Col>
                    <Col span={6}>Đơn giá</Col>
                    <Col span={6}>Số lượng</Col>
                    <Col span={4}>Thành tiền</Col>
                </Row>
                <WrapperInfo>
                    {order.orderItems.map((item, idx) => (
                        <Row key={idx} style={{ alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <Col span={8}>
                                <Row>
                                    <Col span={8}><Image src={item.image} alt="" width={60} height={60} /></Col>
                                    <Col span={16}><div style={{ marginLeft: 10, fontWeight: 500 }}>{item.name}</div></Col>
                                </Row>
                            </Col>
                            <Col span={6}><span style={{ textDecoration: item?.discount ? 'line-through' : 'none' }}>
                                    {convertPrice(item?.price)}
                                    </span>
                                    {item?.discount > 0 && (
                                    <div style={{ color: 'green', fontSize: 12 }}>
                                        -{item?.discount}% = {convertPrice(item?.price * (1 - item.discount / 100))}
                                    </div>
                                    )}</Col>
                            <Col span={6}>
                                <WrapperQualityProduct style={{ width: 'fit-content' }}>
                                    <WrapperInputNumber readOnly size="small" value={item.amount} />
                                </WrapperQualityProduct>
                            </Col>
                            <Col span={4}>
                                <div style={{ color: 'red', fontWeight: 600 }}>{convertPrice(item?.price * item?.amount * (1 - (item?.discount || 0) / 100))}</div>
                            </Col>
                        </Row>
                    ))}
                </WrapperInfo>
            </WrapperTotal>
        </div>
    )
}

export default OrderDetails
