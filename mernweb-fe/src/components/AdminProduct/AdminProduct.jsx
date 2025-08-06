import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Modal, Select, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperUploadFile } from "../../pages/ProfilePage/style";
import { getBase64, renderOptions } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/LoadingComponent";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from 'react-redux';
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state?.user)
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [loading, setLoading] = useState(false)
    const [typeSelect, setTypeSelect] = useState('')
    

    const [stateProduct, setStateProduct] = useState({
        name: '',
        type: '',
        description: '',
        price: '',
        rating: '',
        countInStock: '',
        image: '',
        newType: '',
        discount: '',
    })

    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        type: '',
        description: '',
        price: '',
        rating: '',
        countInStock: '',
        image: '',
        discount: '',
    })

    const mutation = useMutationHooks(
        (data) => {
            return ProductService.createProduct(data)
        }
    )

    const mutationUpdate = useMutationHooks(async (data) => {
        const { id, token, ...rests } = data;
        const res = await ProductService.updateProduct(id, token, rests);
        return res;
    });

    const mutationDelete = useMutationHooks(async (data) => {
        const { id, token } = data;
        const res = await ProductService.deleteProduct(id, token);
        return res;
    });

    const mutationDeleteMany = useMutationHooks(async (data) => {
        const { token, ...ids } = data;
        const res = await ProductService.deleteManyProduct(ids, token);
        return res;
    });


    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                type: res?.data?.type,
                description: res?.data?.description,
                price: res?.data?.price,
                rating: res?.data?.rating,
                image: res?.data?.image,
                countInStock: res?.data?.countInStock,
                discount: res?.data?.discount
            })
        }
    }

    useEffect(() => {
        form.setFieldsValue(stateProductDetails)
    }, [form, stateProductDetails])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    const handleDeleteManyProducts = (ids) => {
        mutationDeleteMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany

    const queryProduct = useQuery({ queryKey: ['products'], queryFn:getAllProducts })
    const { isLoading: isLoadingProducts, data: products } = queryProduct

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const typeProduct = useQuery({ queryKey: ['type-products'], queryFn:fetchAllTypeProduct })

    const renderAction = () => {
        return (
            <div>
                <EditOutlined style={{ color:'orange', fontSize:'25px', cursor:'pointer' }} onClick={handleDetailsProduct}/>
                <DeleteOutlined style={{ color:'red', fontSize:'25px', cursor:'pointer', paddingLeft:'20px'}} onClick={() => setIsModalOpenDelete(true)} />
            </div>
        )
    }
    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
      const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
      };

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
            <InputComponent
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
          onOpenChange(open) {
            if (open) {
              setTimeout(() => {
                var _a;
                return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
              }, 100);
            }
          },
        },
        //render: text =>
          //searchedColumn === dataIndex ? (
            //<Highlighter
              //highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              //searchWords={[searchText]}
              //autoEscape
              //textToHighlight={text ? text.toString() : ''}
            ///>
          //) : (
            ///text
          //),
      });

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
          ...getColumnSearchProps('name')
        },
        {
          title: 'Price',
          dataIndex: 'price',
          sorter: (a,b) => a.price - b.price,
          filters: [
            {
                text: '>= 50',
                value: '>='
            },
            {
                text: '<= 50',
                value: '<='
            }
          ],
          onFilter: (value, record) => {
            if (value === '>=') {
                return record.price >= 50
            }
            return record.price <= 50
          }
        },
        {
          title: 'Rating',
          dataIndex: 'rating',
          sorter: (a,b) => a.rating - b.rating,
          filters: [
            {
                text: '>= 3',
                value: '>='
            },
            {
                text: '<= 3',
                value: '<='
            }
          ],
          onFilter: (value, record) => {
            if (value === '>=') {
                return record.rating >= 3
            }
            return record.rating <= 3
          }
        },  
        {
          title: 'Type',
          dataIndex: 'type',
          ...getColumnSearchProps('type')
        },
        {
          title: 'Action',
          dataIndex: 'action',
          render: renderAction
        },
      ];

      const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id}
      })

    useEffect(() => {
        if( isSuccess && data?.status === 'OK' ) {
            message.success()
            handleCancel()
        } else if( isError ) {
            message.error()
        }
    }, [isSuccess])
 
    useEffect(() => {
        if( isSuccessUpdated && dataUpdated?.status === 'OK' ) {
            message.success()
            getAllProducts()
            handleCloseDrawer()
        } else if( isErrorUpdated) {
            console.error('Error updating product:', dataUpdated);
            message.error()
        }
    }, [isSuccessUpdated])

    useEffect(() => {
        if( isSuccessDeleted && dataDeleted?.status === 'OK' ) {
            message.success()
            handleCancelDelete()
        } else if( isErrorDeleted ) {
            message.error()
        }
    }, [isSuccessDeleted])

    useEffect(() => {
        if( isSuccessDeletedMany && dataDeletedMany?.status === 'OK' ) {
            message.success()
        } else if( isErrorDeletedMany ) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteProduct = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            description: '',
            price: '',
            rating: '',
            countInStock: '',
            image: '',
            newType: '',
            discount: '',
        })
        form.resetFields();
    }

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            type: '',
            description: '',
            price: '',
            rating: '',
            countInStock: '',
            image: '',
            discount: '',
        })
        form.resetFields()
    }

    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            description: stateProduct.description,
            price: stateProduct.price,
            rating: stateProduct.rating,
            countInStock: stateProduct.countInStock,
            image: stateProduct.image,
            discount: stateProduct.discount,
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name] : e.target.value
        })
    }

    const handleOnchangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name] : e.target.value
        })
    }

    const handleOnchangeAvatar = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
          }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const handleOnchangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
          }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        });
    }

    const handleChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
        })
        setTypeSelect(value)
    }

    return (
        <div>
            <WrapperHeader>QUẢN LÝ SẢN PHẨM</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button onClick= {() => setIsModalOpen(true)} style={{ height: '80px', width: '80px', borderRadius: '6px', borderStyle: 'dashed'}}>
                    <PlusOutlined style={{ fontSize: '60px'}} />
                </Button>
            </div>
            <Loading isPending={loading}>
            <div style={{ marginTop: '20px'}}>
                <TableComponent handleDeleteMany={handleDeleteManyProducts} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    };
                }} />
            </div>
            </Loading>
            <ModalComponent
                forceRender
                key={isModalOpen ? 'open' : 'closed'}
                title="Thêm sản phẩm"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose={true}
            >
                <Loading isPending={mutation.isPending}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input Name' }]}
                    >
                    <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
                    </Form.Item>

                    <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please input Type' }]}
                    >
                    <Select
                        name="type"
                        options={renderOptions(typeProduct?.data?.data)}
                        onChange={handleChangeSelect}
                        value={stateProduct.type}
                    />
                    </Form.Item>
                    {typeSelect === 'add_type' && (
                        <Form.Item
                            label='New Type'
                            name='newType'
                            rules={[{ required: true, message: 'Please input Type' }]}
                        >
                            <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                        </Form.Item>
                    )}
                    
                    <Form.Item
                    label="Count In Stock"
                    name="countInStock"
                    rules={[{ required: true, message: 'Please input countInStock' }]}
                    >
                    <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock"/>
                    </Form.Item>

                    <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input price' }]}
                    >
                    <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price"/>
                    </Form.Item>

                    <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input description' }]}
                    >
                    <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description"/>
                    </Form.Item>

                    <Form.Item
                    label="Rating"
                    name="rating"
                    rules={[{ required: true, message: 'Please input rating' }]}
                    >
                    <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating"/>
                    </Form.Item>

                    <Form.Item
                    label="Discount"
                    name="discount"
                    rules={[{ required: true, message: 'Please input discount' }]}
                    >
                    <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount"/>
                    </Form.Item>

                    <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: true, message: 'Please input image' }]}
                    >
                    <div>
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                        <Button>Select File</Button>
                        </WrapperUploadFile>
                        {stateProduct?.image && (
                        <img src={stateProduct?.image} style={{
                            height: '60px',
                            width: '60px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginTop: '10px',
                            marginLeft: '10px'
                        }} alt="image" />
                        )}
                    </div>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
                <Loading isPending={mutation.isPending}>
                <Form
                    name="basic"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    onFinish={onUpdateProduct}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input Name' }]}
                    >
                    <InputComponent value={stateProductDetails.name} name="name" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: 'Please input Type' }]}
                    >
                    <InputComponent value={stateProductDetails.type} name="type" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Count In Stock"
                    name="countInStock"
                    rules={[{ required: true, message: 'Please input countInStock' }]}
                    >
                    <InputComponent value={stateProductDetails.countInStock} name="countInStock" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input price' }]}
                    >
                    <InputComponent value={stateProductDetails.price} name="price" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input description' }]}
                    >
                    <InputComponent value={stateProductDetails.description} name="description" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Rating"
                    name="rating"
                    rules={[{ required: true, message: 'Please input rating' }]}
                    >
                    <InputComponent value={stateProductDetails.rating} name="rating" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Discount"
                    name="discount"
                    rules={[{ required: true, message: 'Please input discount' }]}
                    >
                    <InputComponent value={stateProductDetails.discount} name="discount" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: true, message: 'Please input image' }]}
                    >
                    <div>
                        <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                        <Button>Select File</Button>
                        </WrapperUploadFile>
                        {stateProductDetails?.image && (
                        <img src={stateProductDetails?.image} style={{
                            height: '60px',
                            width: '60px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginTop: '10px',
                            marginLeft: '10px'
                        }} alt="image" />
                        )}
                    </div>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
                        <Button type="primary" htmlType="submit" >
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent
                title="Xác nhận xóa"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteProduct}
            >
                <Loading isPending={mutation.isPending}>
                    <div>Bạn có chắc muốn xóa sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminProduct;