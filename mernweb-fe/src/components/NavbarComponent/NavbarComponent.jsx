import React, { useEffect, useState } from "react";
import { WrapperContent, WrapperLableText, WrapperTextValue } from "./style";
import { Checkbox, Rate } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";

const NavbarComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = queryString.parse(location.search);

    const [typeFilter, setTypeFilter] = useState(queryParams.type || '');
    const [checkboxFilter, setCheckboxFilter] = useState(queryParams.checkbox || []);
    const [ratingFilter, setRatingFilter] = useState(queryParams.rating || '');
    const [priceFilter, setPriceFilter] = useState(queryParams.price || '');

    const updateQueryParams = (newParams) => {
        const merged = { ...queryParams, ...newParams };
        const queryStr = queryString.stringify(merged);
        navigate(`?${queryStr}`);
    };

    const handleTypeClick = (type) => {
        setTypeFilter(type);
        updateQueryParams({ type });
    };

    const handleCheckboxChange = (checkedValues) => {
        setCheckboxFilter(checkedValues);
        updateQueryParams({ checkbox: checkedValues });
    };

    const handleRatingClick = (rating) => {
        setRatingFilter(rating);
        updateQueryParams({ rating });
    };

    const handlePriceClick = (price) => {
        setPriceFilter(price);
        updateQueryParams({ price });
    };

    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => (
                    <WrapperTextValue
                        key={option}
                        style={{ cursor: "pointer", color: typeFilter === option ? "red" : "" }}
                        onClick={() => handleTypeClick(option)}
                    >
                        {option}
                    </WrapperTextValue>
                ));
            case 'checkbox':
                return (
                    <Checkbox.Group
                        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}
                        onChange={handleCheckboxChange}
                        value={checkboxFilter}
                    >
                        {options.map((option) => (
                            <Checkbox style={{ marginLeft: 0 }} value={option.value} key={option.value}>
                                {option.label}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                );
            case 'star':
                return options.map((option) => (
                    <div
                        key={option}
                        style={{ display: 'flex', cursor: 'pointer' }}
                        onClick={() => handleRatingClick(option)}
                    >
                        <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                        <span style={{ marginLeft: '4px', color: ratingFilter == option ? 'red' : '' }}>{`từ ${option} sao`}</span>
                    </div>
                ));
            case 'price':
                return options.map((option) => (
                    <div
                        key={option}
                        style={{
                            borderRadius: '10px',
                            backgroundColor: priceFilter === option ? '#888' : '#ccc',
                            width: 'fit-content',
                            padding: '4px',
                            cursor: 'pointer'
                        }}
                        onClick={() => handlePriceClick(option)}
                    >
                        {option}
                    </div>
                ));
            default:
                return null;
        }
    };

    return (
        <div>
            <WrapperLableText>Lọc sản phẩm</WrapperLableText>
            <WrapperContent>
                {renderContent('text', ['TV', 'LAPTOP', 'DIENTHOAI'])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('checkbox', [
                    { value: 'a', label: 'A' },
                    { value: 'b', label: 'B' },
                    { value: 'c', label: 'C' }
                ])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('star', [5, 4, 3, 2, 1])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('price', ['dưới 500.000', 'trên 500.000'])}
            </WrapperContent>
        </div>
    );
};

export default NavbarComponent;
