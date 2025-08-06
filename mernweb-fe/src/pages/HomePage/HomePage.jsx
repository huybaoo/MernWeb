import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperProducts, WrapperTypeProduct } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/slider1.webp"
import slider2 from "../../assets/images/slider2.webp"
import slider3 from "../../assets/images/slider3.webp"
import CardComponent from "../../components/CardComponent/CardComponent";
import { WrapperButtonMore } from "./style";
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import Loading from "../../components/LoadingComponent/LoadingComponent";

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(10)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        setLoading(true)
        const res = await ProductService.getAllProduct(search, limit)
        setLoading(false)
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK'){
            setTypeProducts(res?.data)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const { data: bestSellers } = useQuery({
        queryKey: ['best-sellers'],
        queryFn: () => ProductService.getBestSellingProducts(10)
    })
    
    const { data: discountProducts } = useQuery({
        queryKey: ['discount-products'],
        queryFn: () => ProductService.getDiscountProducts(10)
    })

    const { data: products } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000,
        placeholderData: (previousData) => previousData,
    })

    return (
        <Loading isPending={loading}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => (
                        <TypeProduct name={item} key={item} /> 
                    ))}
                </WrapperTypeProduct>
            </div>

            <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
                <div id="container" style={{ margin: '0 auto', height: '100%', width: '1270px' }}>
                    <SliderComponent arrImages={[slider1, slider2, slider3]} />

                    {bestSellers?.data?.length > 0 && (
                        <>
                            <h2 style={{ marginTop: '20px' }}>Sản phẩm bán chạy</h2>
                            <WrapperProducts>
                                {bestSellers.data.map((product) => (
                                    <CardComponent key={product._id} {...product} id={product._id} />
                                ))}
                            </WrapperProducts>
                        </>
                    )}

                    {discountProducts?.data?.length > 0 && (
                        <>
                            <h2 style={{ marginTop: '40px' }}>Sản phẩm đang giảm giá</h2>
                            <WrapperProducts>
                                {discountProducts.data.map((product) => (
                                    <CardComponent key={product._id} {...product} id={product._id} />
                                ))}
                            </WrapperProducts>
                        </>
                    )}

                    {products?.data?.length > 0 && (
                        <>
                            <h2 style={{ marginTop: '40px' }}>Tất cả sản phẩm</h2>
                            <WrapperProducts>
                                {products.data.map((product) => (
                                    <CardComponent key={product._id} {...product} id={product._id} />
                                ))}
                            </WrapperProducts>

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                <WrapperButtonMore
                                    textButton="Xem thêm"
                                    type="outline"
                                    styleButton={{
                                        border: '1px solid rgb(11,116,229)',
                                        color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(11,116,229)'}`,
                                        width: '200px',
                                        height: '38px',
                                        borderRadius: '4px'
                                    }}
                                    onClick={() => setLimit((prev) => prev + 10)}
                                    disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                                    styleTextButton={{
                                        fontWeight: 500,
                                        color: products?.total === products?.data?.length && '#fff'
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Loading>
    )
}

export default HomePage;
