import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import InputComponent from '../InputComponent/InputComponent';
import { useNavigate } from 'react-router-dom';

const ButtonInputSearch = (props) => {
    const {
        size,
        placeholder,
        textButton,
        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(13,92,182)',
        colorButton = '#fff'
    } = props;

    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (keyword.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                backgroundColor: '#fff',
                borderRadius: '999px',
                overflow: 'hidden',
                border: '1px solid #ccc',
                height: size === 'large' ? 40 : 32,
                width: '100%',
            }}
        >
            <InputComponent
                size={size}
                bordered={false}
                placeholder={placeholder}
                style={{
                    backgroundColor: backgroundColorInput,
                    borderRadius: '999px 0 0 999px',
                    border: 'none',
                    flex: 1,
                    paddingLeft: 16,
                }}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={handleSearch}
            />
            <ButtonComponent
                size={size}
                styleButton={{
                    background: backgroundColorButton,
                    color: colorButton,
                    borderRadius: '0 999px 999px 0',
                    border: 'none',
                    height: '100%',
                    padding: '0 20px',
                }}
                icon={<SearchOutlined style={{ color: '#fff' }} />}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
                onClick={handleSearch}
            />
        </div>
    );
};

export default ButtonInputSearch;
