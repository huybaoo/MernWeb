import React, { useEffect } from "react";
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/images/logo-login.png"
import { Image } from 'antd';
import { useState } from "react";
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/LoadingComponent";
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from "../../redux/slides/userSlide";
import ToastAddToCart from "../../components/ToastAddToCart/ToastAddToCart";


const SignInPage = () => {
    const navigate = useNavigate();

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');


    const mutation = useMutationHooks(
        data => UserService.loginUser(data)
    )
    
    const { isLoading, isSuccess, isError } = mutation
    const data = mutation.data


    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
    
            const decoded = jwtDecode(data.access_token)
            if (decoded?.id) {
                handleGetDetailsUser(decoded.id, data.access_token)
            }
    
            setToastMessage('Đăng nhập thành công!');
            setToastType('success');
            setShowToast(true);
    
            setTimeout(() => {
                if (location?.state){
                    navigate(location.state)
                } else {
                    navigate('/')
                }
            }, 1500);
        }
    
        if (isSuccess && data?.status === 'ERR') {
            setToastMessage(data?.message || 'Đăng nhập thất bại');
            setToastType('error');
            setShowToast(true);
        }
    
        if (isError) {
            setToastMessage('Đăng nhập thất bại');
            setToastType('error');
            setShowToast(true);
        }
    }, [isSuccess, isError, data]);

    useEffect(() => {
        if (showToast) {
          const timer = setTimeout(() => {
            setShowToast(false);
          }, 2500); 
      
          return () => clearTimeout(timer);
        }
    }, [showToast]);
      
    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangPassword = (value) => {
        setPassword(value)
    }

    const handleSignIn = () => {
        if (!email || !password) {
            setToastMessage('Vui lòng nhập email và mật khẩu');
            setToastType('error');
            setShowToast(true);
            return;
        }
    
        mutation.mutate({
            email,
            password
        });
    };
    

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh'}}>
            {showToast && (
                <ToastAddToCart
                    type={toastType}
                    message={toastMessage}
                    onClose={() => setShowToast(false)}
                />
            )}
        <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '6px', background: '#fff'}}>
            <WrapperContainerLeft>
                <h1>Xin chào</h1>
                <p>Đăng nhập và tạo tài khoản</p>
                <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
                <div style={{ position: 'relative' }}>
                    <span
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        style={{
                            zIndex: 10,
                            position: 'absolute',
                            top: '4px',
                            right: '8px'
                        }}
                    >{
                        isShowPassword ? (
                            <EyeFilled />
                        ) : (
                            <EyeInvisibleFilled />
                        )
                    }
                    </span>
                    <InputForm placeholder="password" type={isShowPassword ? "text" : "password"} value={password} onChange={handleOnchangPassword}/>
                </div>

                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                <Loading isPending={mutation.isPending}>
                    <ButtonComponent
                            disabled={!email.length || !password.length}
                            onClick={handleSignIn}
                            size={40} 
                            styleButton={{ 
                                background: 'rgb(255,57,69)',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px'
                            }}
                            textButton={'Đăng nhập'}
                            styleTextButton={{ color: '#fff',fontSize:'15px', fontWeight:'700' }}
                        >
                    </ButtonComponent>
                </Loading>
                <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
                <p>Bạn chưa có tài khoản? <span><WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight></span></p>
            </WrapperContainerLeft>
            <WrapperContainerRight>
                <Image src={imageLogo}  preview={false} alt="image-logo" height="203px" width="203px" />
                <h4>Mua sắm tại TIKI</h4>
            </WrapperContainerRight>
        </div>
        </div>
    )
}

export default SignInPage;