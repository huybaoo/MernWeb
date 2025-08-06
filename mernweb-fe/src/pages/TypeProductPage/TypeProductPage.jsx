import React, { Fragment, useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Row, Pagination, Col } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import * as ProductService from "../../services/ProductService";
import { useLocation } from "react-router-dom";
import Loading from "../../components/LoadingComponent/LoadingComponent";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperTypeProduct } from "../HomePage/style";

const TypeProductPage = () => {
    const {state} = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK'){
            setTypeProducts(res?.data)
        }
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if(res?.status === 'OK'){
            setLoading(false)
            setProducts(res?.data)
            setPanigate({...panigate, total: res?.total})
        } else{
            setLoading(true)
        } 
    }

    useEffect(() => {
        if(state){
            fetchProductType(state, panigate.page, panigate.limit)
        }
    }, [state, panigate.page, panigate.limit])

    const onChange = ( current, pageSize) => {
        setPanigate({...panigate, page: current - 1, limit: pageSize})
    }
    return (
        <Loading isPending={loading}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => (
                        <TypeProduct name={item} key={item} /> 
                    ))}
                </WrapperTypeProduct>
            </div>
            <div style={{ background: "#f9f9f9", minHeight: '100vh', padding: '20px 0' }}>
                <div style={{ width: '1270px', margin: '0 auto' }}>
                    <Row gutter={16} style={{ marginTop: '5px' }}>
                    <Col span={24}>
                        <WrapperProducts>
                        {products?.filter((pro) => {
                            if (searchDebounce === '') return pro;
                            return pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase());
                        }).map((product) => (
                            <CardComponent
                            id={product._id}
                            key={product._id}
                            countInStock={product.countInStock}
                            description={product.description}
                            image={product.image}
                            name={product.name}
                            price={product.price}
                            rating={product.rating}
                            type={product.type}
                            />
                        ))}
                        </WrapperProducts>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "30px"
                            }}
                            >
                            <Pagination
                                current={panigate.page + 1}
                                pageSize={panigate.limit}
                                total={panigate.total}
                                onChange={onChange}
                                showSizeChanger={false}
                                pageSizeOptions={['5', '10', '20', '30']}
                            />
                        </div>
                    </Col>
                    </Row>
                </div>
            </div>

        </Loading>
    )
}

export default TypeProductPage;