import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Modal, Table } from 'antd';
import { SiTicktick } from 'react-icons/si';
import { RiDeleteBinLine } from 'react-icons/ri';
import { axiosConfig } from '../../axios/axiosConfig';
import toast from 'react-hot-toast';
import UserForm from '../../components/Forms/UserForm';



function UsersIndex() {
  const [editUser, setEditUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getRoleName = (roleId) => {
    switch(roleId) {
      case 1:
        return 'Admin';
        break;
      case 2:
        return 'Manager';
        break;
      case 3:
        return 'Supervisor';
        break;
      case 4:
        return 'Operator';
        break;
    }
  }

  const columns = [
    {
      title: "Code",
      dataIndex: "user_code"
    },
    {
      title: "Name",
      dataIndex: "user_name"
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => getRoleName(role)
    },
    {
      title: "Active",
      dataIndex: "is_active",
      render: (active) => active ? (<div
        title="active"
        className="w-3 h-3 bg-teal-500 rounded-full mx-auto"
      ></div>) : (<div
        title="inactive"
        className="w-3 h-3 bg-red-500 rounded-full mx-auto"
      ></div>)
    }
  ]

  const getAllUsers = async () => {
    const res = await axiosConfig.get('/users/');

    const data = res.data.sort((a, b) => a.user_master_id - b.user_master_id)
                  .map((user) => ({
                    ...user,
                    key: user.user_master_id
                  }))
    setUserData(data);
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows);
      setCheckedRows(selectedRows);
    },
  };

  const onEdit = (users) => {
    if(users.length > 0)
      setEditUser(users[0])
  };
  
  const handleFormResponse = (res, userId = null) => {
    console.log(res);
    if (res.status === 201) {
      toast.success(`User created!`);
    } else if (res.status === 200 && userId) {
      toast.success(`${userId} updated!`);
      setEditUser(null);
    }

    setCheckedRows([]);
    getAllUsers();
  }

  const onDelete = async (container) => {
    const { user_master_id } = container[0];
    try {
      const res = await axiosConfig.delete(
        // `/users/${user_master_id}?last_updated_by=${last_updated_by}`
        `/users/${user_master_id}`
      );
      getAllUsers();
      if (res.status === 204) {
        toast.success(`${checkedRows[0].user_code} deleted!`);
      }
    } catch (error) {
      console.error("ERR::PATCH::CONTAINER", error);
      toast.error("Something went wrong");
    }
  };

  const handleOk = () => {
    onDelete(checkedRows);
    setIsModalOpen(false);

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);
    
  return (
    <Layout>
      <h1 className="text-2xl p-3 font-semibold text-slate-800">
        User Master
      </h1>
      <hr className="mb-2 text-slate-700" />
      <div className="px-10">
        <UserForm user={editUser} responseHandler={handleFormResponse}/>
      </div>
      <hr className="mb-2 text-slate-700" />
      <div className="space-y-5">
        <div className="p-4">
          {checkedRows.length > 0 && (
            <div className="text-sm flex gap-x-2 justify-end my-5">
              <button
                onClick={() => {
                  onEdit(checkedRows);
                }}
                disabled={checkedRows.length !== 1}
                className="p-1 px-3 bg-gray-200 rounded-md disabled:bg-gray-100"
              >
                Edit
              </button>

              <button
                disabled={checkedRows.length !== 1}
                onClick={showModal}
                className="p-1 px-3 bg-gray-200 rounded-md disabled:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
          <Table
            rowSelection={{
              type: "radio",
              ...rowSelection,
            }}
            dataSource={userData} 
            columns={columns} 
          />;
          <Modal title="Delete User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}></Modal>
        </div>
      </div>
    </Layout>
  )
}

export default UsersIndex