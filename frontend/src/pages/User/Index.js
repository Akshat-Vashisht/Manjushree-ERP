import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Select, Table } from 'antd';
import { SiTicktick } from 'react-icons/si';
import { RiDeleteBinLine } from 'react-icons/ri';
import { axiosConfig } from '../../axios/axiosConfig';

function UsersIndex() {
  const [isEditOn, setisEditOn] = useState(false);
  const [createUser, setcreateUser] = useState({
    user_code: "",
    user_name: "",
    password: "",
    confirm_password: "",
    role_id: null
  });

  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

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

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setcreateUser({...createUser, [name]: value});
  }

  const handleRoleChange = (value) => {
    setcreateUser({...createUser, 'role_id': value});
  }

  const getAllUsers = async () => {
    const res = await axiosConfig.get('/users/');
    console.log(res);
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
            onClick={() => { console.log(createUser) }}
            className="bg-teal-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
          >
            <SiTicktick /> {isEditOn ? "Update" : "Add"}
          </button>
        </div>
      </div>
      <hr className="mb-2 text-slate-700" />
      <div className="space-y-5">
        <div className="p-4">
          <Table dataSource={dataSource} columns={columns} />;
        </div>
      </div>
    </Layout>
  )
}

export default UsersIndex