import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import {
    DollarOutlined,
    ShoppingOutlined,
    PieChartOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import * as OrderService from '../../services/OrderService';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const AdminDashboard = () => {
    const [data, setData] = useState({});
    const user = useSelector(state => state.user);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await OrderService.getRevenueStats(user?.access_token);
            if (res?.status === 'OK') {
                setData(res.data);
            }
        };
        fetchStats();
    }, [user]);

    const monthlyChartData = data?.monthlyRevenue
        ? Object.entries(data.monthlyRevenue).map(([month, value]) => ({
              month,
              revenue: value
          }))
        : [];

    const paymentChartData = data?.paymentMethods
        ? Object.entries(data.paymentMethods).map(([method, value]) => ({
              method,
              revenue: value
          }))
        : [];

    return (
        <>
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng doanh thu"
                            value={data.totalRevenue}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Số đơn hàng hoàn tất"
                            value={data.totalOrders}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Phương thức thanh toán phổ biến"
                            value={
                                paymentChartData?.length
                                    ? paymentChartData.reduce((a, b) =>
                                          a.revenue > b.revenue ? a : b
                                      ).method
                                    : ''
                            }
                            prefix={<PieChartOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={14}>
                    <Card title="Biểu đồ doanh thu theo tháng" style={{ marginBottom: 24 }}>
                        <LineChart width={600} height={300} data={monthlyChartData}>
                            <Line type="monotone" dataKey="revenue" stroke="#3f8600" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title="Thống kê theo phương thức thanh toán">
                        <BarChart width={400} height={300} data={paymentChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="method" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#1890ff" />
                        </BarChart>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AdminDashboard;
