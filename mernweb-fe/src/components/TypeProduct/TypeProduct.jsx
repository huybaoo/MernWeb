import React from "react";
import { useNavigate } from 'react-router-dom';

const TypeProduct = ({ name }) => {
    const navigate = useNavigate()
    const handleNavigatetype = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state:type})
    }

    return (
        <div style={{ padding: '0 10px', cursor:'pointer' }} onClick={() => handleNavigatetype(name)}>{name}</div>
    )
}

export default TypeProduct;