// D:\IT\MERN\mernweb\src\pages\ProductsPage\ProductsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import * as ProductService from "../../services/ProductService";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Empty } from "antd";
import TypeProduct from "../../components/TypeProduct/TypeProduct";

import {
    WrapperContainer,
    WrapperEmpty,
    SectionTitle
} from "./style";
import { WrapperProducts } from "../TypeProductPage/style";
import { WrapperTypeProduct } from "../HomePage/style"; 

const ProductsPage = () => {
    const location = useLocation();
    const { keyword } = queryString.parse(location.search);
    const [products, setProducts] = useState([]);
    const [typeProducts, setTypeProducts] = useState([]);

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === "OK") {
            setTypeProducts(res?.data);
        }
    };

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ProductService.getAllProduct(keyword);
                setProducts(res?.data || []);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
            }
        };
        fetchData();
    }, [keyword]);

    return (
        <div>
          <div style={{ width: '1270px', margin: '0 auto', height: '55px' }}>
            <WrapperTypeProduct>
              {typeProducts.map((item) => (
                <TypeProduct name={item} key={item} />
              ))}
            </WrapperTypeProduct>
          </div>
      
          <div style={{ background: "#f9f9f9", minHeight: '100vh', padding: '20px 0' }}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
              <WrapperContainer>
                <SectionTitle>Kết quả tìm kiếm cho: <strong>{keyword}</strong></SectionTitle>
      
                {products.length > 0 ? (
                  <WrapperProducts>
                    {products.map((product) => (
                      <CardComponent key={product._id} {...product} id={product._id} />
                    ))}
                  </WrapperProducts>
                ) : (
                  <WrapperEmpty>
                    <Empty description="Không có sản phẩm trùng khớp" />
                  </WrapperEmpty>
                )}
              </WrapperContainer>
            </div>
          </div>
        </div>
      );
      
};

export default ProductsPage;
