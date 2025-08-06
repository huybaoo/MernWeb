import React, { useEffect, useState } from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import * as ProductService from '../../services/ProductService'
import { WrapperTypeProduct } from "../HomePage/style";

const ProductDetailsPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
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

    return (
        <div>
            <div style={{ width: '1270px', margin: '0 auto', height: '30px' }}>
                    <WrapperTypeProduct>
                        {typeProducts.map((item) =>{
                            return (
                                <TypeProduct name={item} key={item} />
                            )
                        })}
                    </WrapperTypeProduct>
                </div>
            <div style={{ height:'100vh', width:'100%', background:'#efefef'}}>
                <div style={{ width:'1270px', height:'100%', margin:'0 auto'}}> 
                    <ProductDetailsComponent idProduct={id} />
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPage;