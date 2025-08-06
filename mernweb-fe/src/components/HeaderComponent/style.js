import { Row } from 'antd';
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    width: 100%;
    max-width: 1270px;
    padding: 12px 20px;
    margin: 0 auto;
    background-color: rgb(26,148,255);
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;
`

export const WrapperTextHeader = styled.span`
    font-size: 22px;
    color: #fff;
    font-weight: 700;
    letter-spacing: 1px;
    cursor: pointer;
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 8px;
    font-size: 15px;
    cursor: pointer;
`

export const WrapperHeaderCart = styled.div`
    font-size:15px;
    color: #fff;
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26,148,255);
    }
`