import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox, Col, Form, Image, Row } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WrapperStyleHeader, WrapperTotal } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperInputNumber, WrapperQualityProduct } from '../../components/ProductDetailsComponent/style'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/Message/Message";
import { updateUser } from '../../redux/slides/userSlide'
import { useLocation, useNavigate } from 'react-router-dom'

const OrderPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [listChecked, setListChecked] = useState([])
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [isOpenModalChooseProduct, setIsOpenModalChooseProduct] = useState(false)
    const [isOpenModalValidStock, setIsOpenModalValidStock] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: ''
    })
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation()

    const handleChangeCount = (type, idProduct) => {
        if(type === 'increase'){
            dispatch(increaseAmount({idProduct}))
        } else {
            dispatch(decreaseAmount({idProduct}))
        }
    }

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({idProduct}))
    }

    const onChange = (e) => {
        if(listChecked.includes(e.target.value)){
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else{
            setListChecked([...listChecked, e.target.value])
        }
    }

    const handleOnchangeCheckAll = (e) => {
        if(e.target.checked){
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        } else{
            setListChecked([])
        }
    }

    const handleDeleteAllOrder = () => {
        if(listChecked?.length > 0){
            dispatch(removeAllOrderProduct({listChecked}))
        }
    }

    useEffect(() => {
        dispatch(selectedOrder({listChecked}))
    }, [listChecked])

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

    const isValidStock = useMemo(() => {
        return order?.orderItemsSelected?.every(item => item.amount <= item.countInStock);
    }, [order]);

    const outOfStockItems = useMemo(() => {
        if (!order?.orderItemsSelected) return [];
        return order.orderItemsSelected.filter(
          item => typeof item.countInStock === 'number' && item.amount > item.countInStock
        );
    }, [order.orderItemsSelected]);
       
    const handlePay = () => {

        if(!order?.orderItemsSelected?.length){
            setIsOpenModalChooseProduct(true)
        }
         else if(!user?.id){
            navigate('/sign-in', {state: location?.pathname})
        } else if (!isValidStock) {
            setIsOpenModalValidStock(true)
        }
         else if(!user?.phone || !user?.name || !user?.address){
            setIsOpenModalUpdateInfo(true)
        } else{
            navigate('/payment')
        }
    }

    const mutationUpdate = useMutationHooks(
        (data) => {
            const {  id, token, ...rests} = data
            const res = UserService.updateUser( id, token ,{ ...rests })
            return res
        },
    )

    const {isLoading, data} = mutationUpdate

    const handleCancelUpdate = () => {
        setIsOpenModalUpdateInfo(false)
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
        })
        form.resetFields()
    }

    const handleCancelChooseProduct = () => {
        setIsOpenModalChooseProduct(false)
    }

    const handleCancelModalValidStock = () => {
        setIsOpenModalValidStock(false)
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
    
    return (
        <div style={{ width: '1270px', margin: '0 auto', background: '#fff', padding: 20 }}>
            <WrapperStyleHeader>Giỏ hàng</WrapperStyleHeader>

            <Row style={{ borderBottom: '1px solid #ccc', paddingBottom: 12 }}>
                <Col span={3}><Checkbox onChange={handleOnchangeCheckAll} value={order?.product} checked={listChecked?.length === order?.orderItems?.length}>Tất cả ({order?.orderItems?.length} sản phẩm)</Checkbox></Col>
                <Col span={2}></Col>
                <Col span={3}>Đơn giá</Col>
                <Col span={3}>Số lượng</Col>
                <Col span={3}>Thành tiền</Col>
                <Col span={3}><DeleteOutlined style={{ color: 'red', fontSize: 18, cursor: 'pointer' }} onClick={handleDeleteAllOrder}/></Col>
            </Row>

            <Row style={{ marginTop: 30, display: 'flex', alignItems: 'flex-start' }}>
                <Col span={18}>
                    <div style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: 10 }}>
                        {order?.orderItems?.map((item, index) => (
                            <Row key={item?.product || index} style={{ alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <Col span={1}><Checkbox onChange={onChange} value={item?.product} checked={listChecked.includes(item?.product)}/></Col>
                                <Col span={6}>
                                    <Row>
                                        <Col span={8}>
                                            <Image src={item?.image} alt="" width={60} height={60} />
                                        </Col>
                                        <Col span={16}>
                                            <div style={{ marginLeft: 10, fontWeight: 500 }}>{item?.name}</div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={3}>
                                <div>
                                    <span style={{ textDecoration: item?.discount ? 'line-through' : 'none' }}>
                                    {convertPrice(item?.price)}
                                    </span>
                                    {item?.discount > 0 && (
                                    <div style={{ color: 'green', fontSize: 12 }}>
                                        -{item?.discount}% = {convertPrice(item?.price * (1 - item.discount / 100))}
                                    </div>
                                    )}
                                </div>
                                </Col>

                                <Col span={5}>
                                <WrapperQualityProduct>
                                    <button style={{ border: 'none', background : 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', item?.product)} >
                                        <MinusOutlined style={{color: '#000', fontSize: '10px'}} />
                                    </button>
                                    <WrapperInputNumber defaultValue={item?.amount} readOnly value={item?.amount} size="small" />
                                    <button
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: item.amount >= item.countInStock ? 'not-allowed' : 'pointer',
                                            opacity: item.amount >= item.countInStock ? 0.5 : 1
                                        }}
                                        onClick={() =>
                                            item.amount < item.countInStock && handleChangeCount('increase', item?.product)
                                        }
                                        disabled={item.amount >= item.countInStock}
                                        >
                                        <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                    </button>
                                </WrapperQualityProduct>
                                </Col>
                                <Col span={4}>
                                <div style={{ color: 'red', fontWeight: 600 }}>
                                    {convertPrice(item?.price * item?.amount * (1 - (item?.discount || 0) / 100))}
                                </div>
                                </Col>

                                <Col span={4}>
                                    <DeleteOutlined style={{ color: 'red', fontSize: 18, cursor: 'pointer' }} onClick={() => handleDeleteOrder(item?.product)} />
                                </Col>
                            </Row>
                        ))}
                    </div>
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
                        <ButtonComponent
                            textButton="Mua hàng"
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
                            onClick={() => handlePay()}
                            disabled={!isValidStock}
                        />
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
            <ModalComponent title="Vui lòng chọn sản phẩm muốn mua" open={isOpenModalChooseProduct} onCancel={handleCancelChooseProduct} onOk={handleCancelChooseProduct}>
            </ModalComponent>
            <ModalComponent 
                title="Có sản phẩm bạn muốn mua đang tạm hết hàng" 
                open={isOpenModalValidStock} 
                onCancel={handleCancelModalValidStock} 
                onOk={handleCancelModalValidStock}
                >
                {outOfStockItems.length > 0 ? (
                    <ul style={{ paddingLeft: 20 }}>
                    {outOfStockItems.map(item => (
                        <li key={item.product} style={{ color: 'red', marginBottom: 4 }}>
                        {item.name} (còn {item.countInStock} sản phẩm)
                        </li>
                    ))}
                    </ul>
                ) : (
                    <div>Không xác định được sản phẩm hết hàng.</div>
                )}
            </ModalComponent>

        </div>
    )
}

export default OrderPage
