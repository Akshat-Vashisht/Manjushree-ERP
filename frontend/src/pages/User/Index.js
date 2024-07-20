import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Modal, Select, Table } from 'antd';
import { SiTicktick } from 'react-icons/si';
import { RiDeleteBinLine } from 'react-icons/ri';
import { axiosConfig } from '../../axios/axiosConfig';
import toast from 'react-hot-toast';

const createUserFormState = {
  user_code: "",
  user_name: "",
  password: "",
  confirm_password: "",
  role: null
};

function UsersIndex() {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [isEditOn, setIsEditOn] = useState(false);
  const [createUser, setCreateUser] = useState(createUserFormState);
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

  const roles = [
    {
      value: 1, label: "Admin",
    },
    {
      value: 2, label: "Manager",
    },
    {
      value: 3, label: "Supervisor",
    },
    {
      value: 4, label: "Operator"
    }
  ];

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

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCreateUser({...createUser, [name]: value});
  }

  const handleRoleChange = (value) => {
    setCreateUser({...createUser, 'role': value});
  }

  const handleClear = () => {
    setIsEditOn(false);
    setCreateUser(createUserFormState);
  };

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
      setCheckedRows(selectedRows);
    },
  };

  const onEdit = (users) => {
    setCreateUser({
      user_code: users[0].user_code,
      user_name: users[0].user_name,
      role: users[0].role,
    });
  };
  
  const handleSubmit = async (e) => {
    try {
      let res;

      if(!isEditOn) {
        res = await axiosConfig.post('/users/', createUser);
      } else {
        // return console.log(`/users/${checkedRows[0].user_master_id}`);
        res = await axiosConfig.patch(`/users/${checkedRows[0].user_master_id}`, createUser);
      }

      if (res.status === 201) {
        toast.success(`User created!`);
      } else if (res.status === 200 && isEditOn) {
        toast.success(`${checkedRows[0].user_code} updated!`);
      }
      
      handleClear();
      await getAllUsers();
    } catch(error) {
      console.error("ERR::POST::CONTAINER");
      toast.error("Something went wrong");
    }
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
        <div className="grid grid-cols-3 h-full my-4 gap-x-5">
          <div className="flex flex-col gap-y-4">
            {/* Col-1 Fields go here */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="" className="text-sm font-medium">
                User Code
              </label>
              <input 
                type="text" 
                name="user_code"
                onChange={handleInputChange}
                value={createUser.user_code}
                className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
                tabIndex={1} 
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="" className="text-sm font-medium">
                Password
              </label>
              <input 
                type="password" 
                name="password"
                onChange={handleInputChange}
                value={createUser.password}
                className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600" 
                tabIndex={4}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            {/* Col-2 Fields go here */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="" className="text-sm font-medium">
                User Name
              </label>
              <input 
                type="text" 
                name="user_name"
                onChange={handleInputChange}
                value={createUser.user_name}
                className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600" 
                tabIndex={2}
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="" className="text-sm font-medium">
                Confirm Password
              </label>
              <input 
                type="password" 
                name="confirm_password"
                onChange={handleInputChange}
                value={createUser.confirm_password}
                className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600" 
                tabIndex={5}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            {/* Col-3 Fields go here */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="" className="text-sm font-medium">
                Role
              </label>
              <Select 
                options={roles} 
                onChange={handleRoleChange}
                value={createUser.role}
                tabIndex={3}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-x-5">
          <button
            onClick={handleClear}
            className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
            tabIndex={6}
          >
            <RiDeleteBinLine /> {isEditOn ? "Cancel" : "Clear"}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-teal-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
            tabIndex={7}
          >
            <SiTicktick /> {isEditOn ? "Update" : "Add"}
          </button>
        </div>
      </div>
      <hr className="mb-2 text-slate-700" />
      <div className="space-y-5">
        <div className="p-4">
          {checkedRows.length > 0 && (
            <div className="text-sm flex gap-x-2 justify-end my-5">
              <button
                onClick={() => {
                  onEdit(checkedRows);
                  setIsEditOn(true);
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
              type: selectionType,
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