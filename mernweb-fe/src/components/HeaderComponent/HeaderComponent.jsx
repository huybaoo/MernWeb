import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Popover } from 'antd';
import { WrapperHeader, WrapperTextHeader, WrapperHeaderAccount, WrapperHeaderCart, WrapperContentPopup } from "./style";
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slides/userSlide';
import { searchProduct } from '../../redux/slides/productSlide';
import Loading from '../LoadingComponent/LoadingComponent';
import ToastAddToCart from '../ToastAddToCart/ToastAddToCart';
import * as OrderService from '../../services/OrderService';


const HeaderComponent = ({ isHiddenCart = false, isHiddenSearch = false }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const order = useSelector((state) => state.order)
    const [showToast, setShowToast] = useState(false)

    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }   
    
    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        localStorage.removeItem('access_token')
        dispatch(resetUser())
        setLoading(false)
        navigate('/sign-in', { replace: true, state: {} });
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user.name)
        setUserAvatar(user.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])

    useEffect(() => {
        let interval;
        let toastTimer;
    
        const checkDeliveringOrder = async () => {
            if (user?.access_token && user?.id) {
                try {
                    const res = await OrderService.getOrderByUserId(user.id, user.access_token);
                    const hasDelivering = res?.data?.some(order => order.status === 'Delivering');
    
                    if (hasDelivering) {
                        setShowToast(true);
                        toastTimer = setTimeout(() => {
                            setShowToast(false);
                        }, 5000); 
                    }
                } catch (error) {
                    console.error("Lỗi kiểm tra đơn hàng đang giao:", error);
                }
            } else {
                setShowToast(false);
            }
        };

        checkDeliveringOrder();

        interval = setInterval(() => {
            checkDeliveringOrder();
        }, 10000);
    
        return () => {
            clearInterval(interval);
            clearTimeout(toastTimer);
        };
    }, [user?.access_token, user?.id]);
    
      

    const content = (
        <div>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí trang web</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate('history')}>Lịch sử mua hàng</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const handleClickNavigate = (type) => {
        if(type === 'admin'){
            navigate('/system/admin')
        } else if(type === 'profile'){
            navigate('/profile-user')
        } else if(type === 'history'){
            navigate('/order-history',{ state : {
                id: user?.id,
                token: user?.access_token
            }
            })
        } else{
            handleLogout()
        }
        setIsOpenPopup(false)
    }

    const onSearch = () => {
        const trimmed = search.trim();
        if (trimmed !== '') {
            dispatch(searchProduct(trimmed)); 
            navigate(`/products?keyword=${encodeURIComponent(trimmed)}`);
        }
    };
    

    return (
        <div style={{ width:'100%', background:'rgb(26,148,255)', display: 'flex', justifyContent: 'center'}}>
            <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>
            <Col span={6} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

                    <WrapperTextHeader onClick={() => navigate('/')}>HUYBAO</WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (
                    <Col span={13} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px' }}>

            <ButtonInputSearch
                size="large"
                bordered={false}
                textButton="Tìm kiếm"
                placeholder="Nhập sản phẩm bạn cần tìm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onSearch={onSearch}
            />

                </Col>
                )}
                <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px' }}>

                    <Loading isPending={loading}>
                        <WrapperHeaderAccount>
                            {userAvatar ? (
                                <div onClick={() => setIsOpenPopup((prev) => !prev)}>
                                <img src={userAvatar} alt="avatar" style={{
                                    height: '30px',
                                    width: '30px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}/>
                                </div>
                            ) : ( 
                            <UserOutlined onClick={handleNavigateLogin} style={{fontSize:'25px', cursor: 'pointer'}} />
                            )}
                            {user?.access_token ? (
                                <> 
                                    <Popover content={content} trigger="click" open={isOpenPopup}>
                                        <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{ userName?.length ? userName : user?.email }</div>
                                    </Popover>
                                </>
                            ) : (
                                <div>
                                <span onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>Đăng nhập/ Đăng ký</span>
                                <div>
                                    <span>Tài khoản</span>
                                    <CaretDownOutlined />
                                </div>
                            </div>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHiddenCart && (
                        <WrapperHeaderCart>
                        <div onClick={() => navigate('/order')} style={{ cursor: 'pointer'}}>
                            <Badge count={order?.orderItems?.length} size="small">
                            <ShoppingCartOutlined style={{fontSize:'25px', color:'#fff'}} />
                            </Badge>
                            <span style={{ color:'#fff' }}>Giỏ hàng</span>
                        </div>
                    </WrapperHeaderCart>
                    )}
                </Col>
            </WrapperHeader>
            {showToast && (
                <ToastAddToCart 
                    message="Vui lòng xác nhận đã nhận hàng thành công khi đơn hàng được giao đến bạn" 
                    type="success" 
                    onClose={() => setShowToast(false)} 
                />
            )}

        </div>
    )
}

export default HeaderComponent;