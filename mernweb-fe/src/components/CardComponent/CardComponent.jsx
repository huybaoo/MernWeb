import React from 'react';
import { StyleNameProduct, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperCardStyle, WrapperStyleTextSell } from './style';
import { StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils';


const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }

    return (
        <WrapperCardStyle
            hoverable
            style={{ width: 200 }}
            //bodyStyle={{padding: '10px'}}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText style={{ marginRight: '4px'}}>
                <span>
                    <span>{rating}</span> <StarFilled style={{ fontSize:'14px', color:'yellow' }} />
                </span>
                <WrapperStyleTextSell>| Đã bán {selled || 100}+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span> 
                <WrapperDiscountText>
                    - {discount || 5} %
                </WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
  )
}

export default CardComponent;