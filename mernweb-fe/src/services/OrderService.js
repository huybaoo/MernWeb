import { axiosJWT } from "./UserService"

export const createOrder = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const getOrderByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const getOrderById = async (orderId, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/order-details/${orderId}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
};

export const cancelOrderById = async (orderId, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/cancel-order/${orderId}`, {}, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
};

export const getAllOrder = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
};

export const updateOrderStatus = async (orderId, access_token, status, isDelivered, isPaid) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/update-status/${orderId}`,
        { status, isDelivered, isPaid },
        {
            headers: {
                token: `Bearer ${access_token}`
            }
        }
    )    
    return res.data
}

export const getRevenueStats = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/revenue-stats`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
};

