import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Select, Table } from 'antd';
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
    console.log(res.data);

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

      res = await axiosConfig.post('/users/', createUser);

      if(res.status === 201) {
        toast.success(`User created successfully`)
      }
      
      handleClear();
      await getAllUsers();
    } catch(error) {
    }
  }

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
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="" className="text-sm font-medium">
                Role
              </label>
              <Select 
                options={roles} 
                onChange={handleRoleChange}
                value={createUser.role}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            {/* Col-3 Fields go here */}
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
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-x-5">
          <button
            onClick={() => {}}
            className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
          >
            <RiDeleteBinLine /> {isEditOn ? "Cancel" : "Clear"}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-teal-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
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
        </div>
      </div>
    </Layout>
  )
}

export default UsersIndex