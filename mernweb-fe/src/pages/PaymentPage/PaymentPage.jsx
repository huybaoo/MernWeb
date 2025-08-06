import React, { useEffect, useMemo, useState } from 'react'
import { Col, Form, Row, Radio } from 'antd'
import { WrapperStyleHeader, WrapperTotal } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { convertPrice } from '../../utils'
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import { useMutationHooks } from '../../hooks/useMutationHook';
import { updateUser } from '../../redux/slides/userSlide'
import Loading from '../../components/LoadingComponent/LoadingComponent'
import { useNavigate } from 'react-router-dom'
import { removeAllOrderProduct } from '../../redux/slides/orderSlide'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import * as PaymentService from '../../services/PaymentService'

const PaymentPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: ''
    })
    const [form] = Form.useForm();
    const [shippingMethod, setShippingMethod] = useState('FAST')
    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if(isOpenModalUpdateInfo){
            setStateUserDetails({
                ...stateUserDetails,
                name: user?.name,
                phone: user.phone,
                address: user?.address
            })
        }
    }, [isOpenModalUpdateInfo])

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const discountPrice = cur.price * (1 - (cur.discount || 0) / 100)
            return total + (discountPrice * cur.amount)
        }, 0)
        return result
    }, [order])   

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.discount * cur.amount))
        }, 0)
        if(Number(result)){
            return result
        }
        return 0
    }, [order])

    const deliveryPriceMemo = useMemo(() => {
        if(priceMemo > 200000){
            return 20000
        } else if(priceMemo === 0){
            return 0
        } else{
            return 10000
        }
    }, [priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo)  + Number(deliveryPriceMemo)
    }, [priceMemo, deliveryPriceMemo])

    const handleAddOrderCOD = () => {
        if(user?.access_token && order?.orderItemsSelected && user?.name 
            && user?.phone && user?.address && priceMemo && user?.id
        ){
            mutationAddOrder.mutate({ 
                token: user?.access_token, 
                orderItems: order?.orderItemsSelected, 
                name: user?.name, 
                address: user?.address,
                phone: user?.phone,
                paymentMethod: paymentMethod,
                shippingMethod: shippingMethod,
                itemsPrice: priceMemo,
                shippingPrice: deliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                email: user?.email,
                status: "Pending"
            }, {
                onSuccess: (data) => {
                    setIsModalSuccessOpen(true);
                },
                onError: (error) => {
                    console.error("Lỗi đặt hàng:", error);
                }
            })
        }
    }

    const handleAddOrderPAYPAL = () => {
        if(user?.access_token && order?.orderItemsSelected && user?.name 
            && user?.phone && user?.address && priceMemo && user?.id
        ){
            mutationAddOrder.mutate({ 
                token: user?.access_token, 
                orderItems: order?.orderItemsSelected, 
                name: user?.name, 
                address: user?.address,
                phone: user?.phone,
                paymentMethod: paymentMethod,
                shippingMethod: shippingMethod,
                itemsPrice: priceMemo,
                shippingPrice: deliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                isPaid: true,
                email: user?.email,
                status: "Confirmed"
            }, {
                onSuccess: (data) => {
                    setIsModalSuccessOpen(true);
                },
                onError: (error) => {
                    console.error("Lỗi đặt hàng:", error);
                }
            })
        }
    }

    const mutationUpdate = useMutationHooks(
        (data) => {
            const {  id, token, ...rests} = data
            const res = UserService.updateUser( id, token ,{ ...rests })
            return res
        },
    )

    const mutationAddOrder = useMutationHooks(
        (data) => {
            const { token, ...rests } = data
            const res = OrderService.createOrder( token ,{ ...rests })
            return res
        },
    )

    const {isLoading, data} = mutationUpdate
    const {isLoading: isLoadingAddOrder} = mutationAddOrder

    const handleCancelUpdate = () => {
        setIsOpenModalUpdateInfo(false)
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
        })
        form.resetFields()
    }

    const handleUpdateInfo = () => {
        const { name, address, phone } = stateUserDetails
        if(name && address && phone){
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails}, {
                onSuccess: () => {
                    dispatch(updateUser({...user, name, phone, address}))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name] : e.target.value
        })
    }

    const handleOnChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const handleCloseSuccessModal = () => {
        setIsModalSuccessOpen(false);
        const arrayOrdered = []
        order?.orderItemsSelected?.forEach(element =>{
            arrayOrdered.push(element.product)
        });
        dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
        navigate('/order-history');
    };

    const addPaypalScript = async () => {
        const {data} = await PaymentService.getConfig()
    }

    useEffect(() => {
        addPaypalScript()
    }, [])
    
    return (
        <div style={{ width: '1270px', margin: '0 auto', background: '#fff', padding: 20 }}>
            <WrapperStyleHeader>Chọn phương thức thanh toán</WrapperStyleHeader>

            <Row style={{ marginTop: 30, display: 'flex', alignItems: 'flex-start' }}>
                <Col span={18}>
                    <WrapperTotal style={{ marginBottom: 20, marginRight: 10 }}>
                        <h4>Chọn phương thức giao hàng</h4>
                        <Form.Item>
                            <Radio.Group
                                value={shippingMethod}
                                onChange={(e) => setShippingMethod(e.target.value)}
                            >
                                <Radio value="FAST">
                                    <span style={{ color: '#ff6600', fontWeight: 600 }}>FAST</span> Giao hàng tiết kiệm
                                </Radio>
                                <br />
                                <Radio value="GOJEK">
                                    <span style={{ color: '#ff6600', fontWeight: 600 }}>GO_JEK</span> Giao hàng tiết kiệm
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </WrapperTotal>

                    <WrapperTotal style={{ marginRight: 10 }}>
                        <h4>Chọn phương thức thanh toán</h4>
                        <Form.Item>
                            <Radio.Group
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <Radio value="paypal">PAYPAL</Radio>
                                <Radio value="COD">Thanh toán tiền mặt khi nhận hàng</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </WrapperTotal>

                </Col>

                <Col span={6}>
                    <WrapperTotal>
                        <div className="info-row">
                            <span>Địa chỉ giao hàng: </span>
                            <span style={{ fontWeight: 'bold' }}>{user?.address}</span>
                            <span onClick={handleOnChangeAddress} style={{ color: 'rgb(26,148,255)', cursor: 'pointer' }}>Thay đổi</span>
                        </div>
                        <div className="info-row total">
                            <span>Tạm tính</span><span>{convertPrice(priceMemo)}</span>
                        </div>
                        <div className="info-row">
                            <span>Phí giao hàng</span><span>{convertPrice(deliveryPriceMemo)}</span>
                        </div>
                        <div className="info-row total">
                            <span>Tổng tiền</span>
                            <span style={{ color: 'red', fontSize: 20, fontWeight: 700 }}>{convertPrice(totalPriceMemo)}</span>
                        </div>
                        <div style={{ fontSize: 12, textAlign: 'right', marginTop: 4, color: '#888' }}>
                            (Đã bao gồm VAT nếu có)
                        </div>
                        {paymentMethod === 'paypal' ? (
                            <div style={{ marginTop: '15px' }}>
                                <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_CLIENT_ID }}>
                                    <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                        purchase_units: [{
                                            amount: {
                                            value: (totalPriceMemo / 24000).toFixed(2),
                                            },
                                        }],
                                        });
                                    }}
                                    onCancel={() => {
                                        alert("Đã hủy giao dịch");
                                      }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                        alert("Giao dịch thành công bởi " + details.payer.name.given_name);
                                        handleAddOrderPAYPAL();
                                        });
                                    }}
                                    />
                            </PayPalScriptProvider>
                          </div>
                        ) : (
                            <ButtonComponent
                            textButton="Đặt hàng"
                            styleButton={{
                                marginTop: 16,
                                width: '100%',
                                height: 40,
                                background: '#ff4d4f',
                                border: 'none',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 16
                            }}
                            onClick={() => handleAddOrderCOD()}
                        />
                        )}
                        
                    </WrapperTotal>
                </Col>
            </Row>
            <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfo}>
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    //onFinish={onUpdateUser}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input Name' }]}
                    >
                    <InputComponent value={stateUserDetails.name} name="name" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input Phone' }]}
                    >
                    <InputComponent value={stateUserDetails.phone} name="phone" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input Address' }]}
                    >
                    <InputComponent value={stateUserDetails.address} name="address" onChange={handleOnchangeDetails} />
                    </Form.Item>

                </Form>
            </ModalComponent>

            <ModalComponent
                title="Đặt hàng thành công"
                open={isModalSuccessOpen}
                footer={null} 
                onCancel={handleCloseSuccessModal}
                >
                <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý!</p>
            </ModalComponent>
        </div>
    )
}

export default PaymentPage 
