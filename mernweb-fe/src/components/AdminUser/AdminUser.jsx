import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Modal, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperUploadFile } from "../../pages/ProfilePage/style";
import { getBase64 } from "../../utils";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from 'react-redux';
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state?.user)
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '',
        address: ''
    })

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: '',
        address: ''
    })

    const mutationUpdate = useMutationHooks(async (data) => {
        const { id, token, ...rests } = data;
        const res = await UserService.updateUser(id, token, rests);
        return res;
    });

    const mutationDelete = useMutationHooks(async (data) => {
        const { id, token } = data;
        const res = await UserService.deleteUser(id, token);
        return res;
    });

    const mutationDeleteMany = useMutationHooks(async (data) => {
        const { token, ...ids } = data;
        const res = await UserService.deleteManyUser(ids, token);
        return res;
    });
    
    const getAllUsers = async (token) => {
        const res = await UserService.getAllUser(token)
        return res
    }

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected, user?.access_token)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                avatar: res?.data?.avatar,
                address: res?.data?.address,
            })
        }
    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailsUser = () => {
        setIsOpenDrawer(true)
    }

    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany

    const queryUser = useQuery({
        queryKey: ['users', user?.access_token],
        queryFn: () => getAllUsers(user?.access_token),
        enabled: !!user?.access_token,
    });
    const { isLoading: isLoadingUsers, data: users } = queryUser

    const renderAction = () => {
        return (
            <div>
                <EditOutlined style={{ color:'orange', fontSize:'25px', cursor:'pointer' }} onClick={handleDetailsUser}/>
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
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          ...getColumnSearchProps('phone')
        },
        {
          title: 'Address',
          dataIndex: 'address',
          ...getColumnSearchProps('address')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
      ];

      const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id}
      })
 
    useEffect(() => {
        if( isSuccessUpdated && dataUpdated?.status === 'OK' ) {
            message.success()
            queryUser.refetch();
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

    const handleDeleteUser = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
        })
        form.resetFields()
    }

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name] : e.target.value
        })
    }

    const handleDeleteManyUsers = (ids) => {
        mutationDeleteMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleOnchangeAvatarDetails = async ({fileList}) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
          }
        setStateUserDetails({
            ...stateUserDetails,
            avatar: file.preview
        })
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token,...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch();
            }
        });
    };

    return (
        <div>
            <WrapperHeader>QUẢN LÝ NGƯỜI DÙNG</WrapperHeader>
            <div style={{ marginTop: '20px'}}>
                <TableComponent handleDeleteMany={handleDeleteManyUsers} columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    };
                }} />
            </div>
            <DrawerComponent title='Thông tin người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="80%">
                <Form
                    name="basic"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    onFinish={onUpdateUser}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input Name' }]}
                    >
                    <InputComponent value={stateUserDetails.name} name="name" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input Email' }]}
                    >
                    <InputComponent value={stateUserDetails.email} name="email" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please input Phone' }]}
                    >
                    <InputComponent value={stateUserDetails.phone} name="phone" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input Address' }]}
                    >
                    <InputComponent value={stateUserDetails.address} name="address" onChange={handleOnchangeDetails} />
                    </Form.Item>

                    <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: false, message: 'Please input image' }]}
                    >
                    <div>
                        <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                        <Button>Select File</Button>
                        </WrapperUploadFile>
                        {stateUserDetails?.avatar && (
                        <img src={stateUserDetails?.avatar} style={{
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
            </DrawerComponent>
            <ModalComponent
                title="Xác nhận xóa"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteUser}
            >
                    <div>Bạn có chắc muốn xóa người dùng này không?</div>
            </ModalComponent>
        </div>
    )
}

export default AdminUser;