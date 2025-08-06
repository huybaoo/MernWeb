import styled from 'styled-components'

export const WrapperOrderHistory = styled.div`
    width: 1270px;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
`

export const WrapperStyleHeader = styled.h3`
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 24px;
    color: #1e1e1e;
`

export const OrderCard = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    background: #f9f9f9;

    &:hover {
        background: #f0f0f0;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }
`

export const OrderInfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    span {
        font-size: 15px;
        color: #333;
    }

    strong {
        font-weight: 600;
        color: #1e1e1e;
    }
`

export const ProductList = styled.ul`
    list-style: none;
    padding: 8px 0 0 0;
    margin: 0;

    li {
        font-size: 14px;
        padding: 4px 0;
        color: #444;
    }
`

export const OrderStatus = styled.div`
    margin: 10px 0;
  span {
    margin-right: 8px;
    font-weight: bold;
  }

  .paid {
    color: #52c41a;
  }

  .unpaid {
    color: #faad14;
  }

  .delivered {
    color: #1890ff;
  }

  .undelivered {
    color: #faad14;
  }

  .status {
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
    text-transform: capitalize;
  }

  .pending {
    background-color: #fffbe6;
    color: #d48806;
  }

  .confirmed {
    background-color: #f6ffed;
    color: #389e0d;
  }

  .delivering {
    background-color: #e6f7ff;
    color: #096dd9;
  }

  .delivered {
    background-color: #e6fffb;
    color: #08979c;
  }

  .completed {
    background-color: #f0f5ff;
    color: #2f54eb;
  }

  .cancelled {
    background-color: #fff1f0;
    color: #cf1322;
  }
`

export const ButtonGroup = styled.div`
    margin-top: 16px;
    display: flex;
    gap: 12px;
`