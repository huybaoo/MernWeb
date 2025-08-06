// D:\IT\MERN\mernweb\src\pages\ProductsPage\style.js
import styled from "styled-components";

export const WrapperContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 60vh;
`;

export const WrapperEmpty = styled.div`
  margin: 80px 0;
  text-align: center;

  .ant-empty-description {
    font-size: 18px;
    color: #888;
  }
`;

export const SectionTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #0b74e5;
  font-weight: 600;
  position: relative;
  padding-left: 12px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 24px;
    background-color: #0b74e5;
    border-radius: 4px;
  }
`;
