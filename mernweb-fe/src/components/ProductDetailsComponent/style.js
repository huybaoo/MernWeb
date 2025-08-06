import { Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
    border-color: #1890ff;
  }
`

export const WrapperStyleNameProduct = styled.h1`
  color: #222;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  margin-bottom: 10px;
`

export const WrapperStyleTextSell = styled.span`
  font-size: 14px;
  color: #8c8c8c;
  margin-left: 8px;
`


export const WrapperPriceProduct = styled.div`
  background: #fef2f2;
  border-left: 4px solid #ff4d4f;
  padding: 12px;
  margin: 16px 0;
  border-radius: 6px;
`

export const WrapperPriceTextProduct = styled.h2`
  font-size: 30px;
  color: #d0021b;
  font-weight: 700;
  margin: 0;
`

export const WrapperAddressProduct = styled.div`
  margin-bottom: 20px;
  font-size: 15px;
  span.address {
    font-weight: 500;
    color: #595959;
    text-decoration: underline;
  }
  span.change-address {
    color: #1890ff;
    cursor: pointer;
    margin-left: 4px;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`

export const WrapperQualityProduct = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #fafafa;
  gap: 8px;
`


export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    }
`