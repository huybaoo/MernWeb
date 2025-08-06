import styled from 'styled-components'

export const WrapperStyleHeader = styled.h3`
    font-size: 20px;
    font-weight: 600;
    padding: 12px 0;
`

export const WrapperTotal = styled.div`
    border: 1px solid #f0f0f0;
    padding: 16px;
    border-radius: 8px;
    background: #f9f9f9;
    margin-bottom: 16px;

    .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }

    .total {
        border-top: 1px solid #ddd;
        padding-top: 12px;
    }

    h4 {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 600;
    }
`


export const WrapperStyleImageSmall = styled.div`
    display: flex;
    gap: 4px;
    margin-top: 4px;
`

export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    
`
