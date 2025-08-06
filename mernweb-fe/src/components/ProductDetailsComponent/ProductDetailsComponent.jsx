import { Col, Image, InputNumber, Row, Rate } from "antd";
import React, { useEffect } from "react";
import imageProduct from "../../assets/images/im1.webp";
import imageProductSmall from "../../assets/images/im2.webp";
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from "./style";
import { MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons';
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/LoadingComponent/LoadingComponent";
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import ToastAddToCart from "../ToastAddToCart/ToastAddToCart";

const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [showToast, setShowToast] = useState(false);
    const orderItems = useSelector((state) => state.order.orderItems)

    const onChange = (value) => {
        setNumProduct(Number(value))
    }    

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id){
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    const { isLoading, data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled: !!idProduct,
    })

    const handleChangeCount = (type) => {
        if (type === 'increase' && numProduct < productDetails?.countInStock ){
            setNumProduct(numProduct + 1)
        } else if( type === 'decrease' && numProduct > 1){
            setNumProduct(numProduct - 1)
        }
    }

    const handleAddOrderProduct = () => {
        if (!user?.id){
            navigate('/sign-in', {state: location?.pathname})
        } else {

            const existingItem = orderItems.find(item => item.product === productDetails?._id)
            const currentAmountInCart = existingItem ? existingItem.amount : 0
            const totalAfterAdd = currentAmountInCart + numProduct
    
            if (totalAfterAdd > productDetails?.countInStock) {

                setShowToast({
                    type: 'error',
                    message: 'Số lượng trong giỏ hàng vượt quá tồn kho!'
                })
                return;
            }
    
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    countInStock: productDetails?.countInStock,
                    discount: productDetails?.discount
                }
            }))
    
            setShowToast({
                type: 'success',
                message: 'Đã thêm sản phẩm vào giỏ hàng!'
            });
        }
    }
    
    const fetchRelatedProducts = async (context) => {
        const type = context?.queryKey && context?.queryKey[1];
        if (type) {
            const res = await ProductService.getProductType(type, 0, 7);
            return res.data;
        }
    };
    

    const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
        queryKey: ['related-products', productDetails?.type],
        queryFn: fetchRelatedProducts,
        enabled: !!productDetails?.type,
    })

    useEffect(() => {
        if (showToast) {
          const timer = setTimeout(() => {
            setShowToast(false);
          }, 2500);
      
          return () => clearTimeout(timer);
        }
    }, [showToast]);
    

    return (
        <div>
        <Loading isPending={isLoading}>
            {showToast && (
                <ToastAddToCart 
                    type={showToast.type} 
                    message={showToast.message} 
                    onClose={() => setShowToast(false)} 
                />
            )}
            <Row style={{
                padding: '24px',
                background: '#fff',
                borderRadius: '5px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                marginTop: '24px'
            }}>

                <Col span={8} style={{ borderRight:'1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image style={{ height:"480px", width:"400px"}}src={productDetails?.image} alt="image product"/>
                    <Row style={{ display:"flex", paddingTop:'10px' }}>
                        <Col span={8}>
                            <WrapperStyleImageSmall style={{ width:"100px", height:"100px"}} src={imageProductSmall} alt="image small" />
                        </Col>
                        <Col span={8}>
                            <WrapperStyleImageSmall style={{ width:"100px", height:"100px"}} src={imageProductSmall} alt="image small" />
                        </Col>
                        <Col span={8}>
                            <WrapperStyleImageSmall style={{ width:"100px", height:"100px"}} src={imageProductSmall} alt="image small" />
                        </Col>
                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '10px'}}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <WrapperStyleTextSell> | Đã bán {productDetails?.selled}</WrapperStyleTextSell>
                    </div>
                    <div>
                        <WrapperStyleTextSell>Số lượng sản phẩm còn: {productDetails?.countInStock}</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>
                            {convertPrice(productDetails?.price)}
                        </WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến </span>
                        <span className='address'>{user?.address}</span> - 
                        <span className='change-address'> Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop:'1px solid  #e5e5e5', borderBottom:'1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}>Số lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background : 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease')} >
                                <MinusOutlined style={{color: '#000', fontSize: '15px'}} />
                            </button>
                            <WrapperInputNumber defaultValue={1} onChange={onChange} value={numProduct} size="small" />
                            <button
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: numProduct >= productDetails?.countInStock ? 'not-allowed' : 'pointer',
                                    opacity: numProduct >= productDetails?.countInStock ? 0.5 : 1
                                }}
                                onClick={() => numProduct < productDetails?.countInStock && handleChangeCount('increase')}
                                disabled={numProduct >= productDetails?.countInStock}
                            >
                                <PlusOutlined style={{ color: '#000', fontSize: '15px' }} />
                            </button>

                        </WrapperQualityProduct>
                    </div>
                        {productDetails?.countInStock > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <ButtonComponent
                                size={40} 
                                styleButton={{ 
                                    background: 'rgb(255,57,69)',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px',
                                }}
                                onClick={handleAddOrderProduct}
                                textButton={'Chọn mua'}
                                styleTextButton={{ color: '#fff',fontSize:'15px', fontWeight:'700' }}
                                >
                                </ButtonComponent>
                                <ButtonComponent
                                    size={40} 
                                    styleButton={{ 
                                        background: '#fff',
                                        height: '48px',
                                        width: '220px',
                                        border: '1px solid rgb(13,92,182)',
                                        borderRadius: '4px',
                                    }}
                                    textButton={'Mua trả sau'}
                                    styleTextButton={{ color: 'rgb(13,92,182)', fontSize:'15px' }}
                                >
                                </ButtonComponent>
                            </div>
                        ) : (
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: '#ccc',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'not-allowed'
                                }}
                                disabled
                                textButton={'Hết hàng'}
                                styleTextButton={{ color: '#666', fontSize: '15px', fontWeight: '700' }}
                            />
                        )} 
                </Col>  
            </Row>
        </Loading>
        {relatedProducts?.length > 0 && (
            <div style={{ marginTop: '70px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                Sản phẩm liên quan
                </h2>
                <Row gutter={[16, 16]}>
                {relatedProducts
                    .filter(item => item._id !== idProduct)
                    .slice(0, 6)
                    .map(product => (
                    <Col span={4} key={product._id}>
                        <div
                        style={{
                            border: '1px solid #f0f0f0',
                            borderRadius: '12px',
                            padding: '12px',
                            backgroundColor: '#fff',
                            transition: 'box-shadow 0.3s ease',
                            cursor: 'pointer',
                            height: '100%',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        }}
                        onClick={() => navigate(`/product-details/${product._id}`)}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)')}
                        >
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={'100%'}
                            height={160}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                            preview={false}
                        />
                        <div
                            style={{
                            marginTop: '10px',
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#333',
                            minHeight: '40px',
                            }}
                        >
                            {product.name}
                        </div>
                        <Rate
                            disabled
                            allowHalf
                            defaultValue={product.rating || 4}
                            style={{ fontSize: '14px', marginTop: '4px' }}
                        />
                        <div
                            style={{
                            color: '#d0021b',
                            marginTop: '6px',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            }}
                        >
                            {convertPrice(product.price)}
                        </div>
                        </div>
                    </Col>
                    ))}
                </Row>
            </div>
        )}


        </div>
    )
}

export default ProductDetailsComponent;