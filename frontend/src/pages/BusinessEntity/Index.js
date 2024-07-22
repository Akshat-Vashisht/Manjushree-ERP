import Layout from '../../components/Layout'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { Modal, Select, Table } from 'antd';
import { axiosConfig } from '../../axios/axiosConfig';
import { SiTicktick } from 'react-icons/si';
import { RiDeleteBinLine } from 'react-icons/ri';
import { LuTrash2, LuPencilLine } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BusinessEntityIndex() {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [checkedRows, setCheckedRows] = useState([]);
  const [isEditOn, setIsEditOn] = useState(false);
  const [businessEntityData, setBusinessEntityData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      "title": "Code",
      "dataIndex": "business_entity_code"
    },
    {
      "title": "Name",
      "dataIndex": "business_entity_name"
    },
    {
      "title": "City",
      "dataIndex": "city"
    },
    {
      "title": "Pincode",
      "dataIndex": "pin"
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) =>
        text ? (
          <div
            title="active"
            className="w-3 h-3 bg-teal-500 rounded-full mx-auto"
          ></div>
        ) : (
          <div
            title="inactive"
            className="w-3 h-3 bg-red-500 rounded-full mx-auto"
          ></div>
        ),
    },
    {
      "title": "Actions",
      "render": (be) => {
        return (<div className="flex gap-x-4">
          <Link className='text-blue-500' to={`/1/business-entity-master/${be.business_entity_master_id}`}>
            <LuPencilLine />Edit
          </Link>
          <button className='text-red-500' onClick={() => {
            triggerDelete(be.business_entity_master_id);
          }}>
            <LuTrash2 />Delete
          </button>
        </div>
        )
      }
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setCheckedRows(selectedRows);
    },
  };

  const getAllBusinessEntities = async () => {
    const res = await axiosConfig.get('/business-entities/');

    const data = res.data.records
                  .sort((a, b) => a.business_entity_master_id - b.business_entity_master_id)
                  .map((businessEntity) => ({
                    ...businessEntity,
                    key: businessEntity.business_entity_master_id
                  }))

    // console.log(res);
    setBusinessEntityData(data)
  }

  const triggerDelete = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  }
  
  const handleCancel = () => {
    setDeleteId(null);
    setIsModalOpen(false);
  }

  const handleOk = async () => {
    let res = await axiosConfig.delete(`/business-entities/${deleteId}`);

    if(res.status === 204)
      toast.success('Business Entity deleted')
    else
      toast.error('Something went wrong')

    handleCancel();
    await getAllBusinessEntities();
  }

  useEffect(() => {
    getAllBusinessEntities();
  }, [])

  return (
    <Layout>
        <div className='flex flex-wrap justify-center align-center lg:justify-between'>
          <h1 className="text-2xl p-3 font-semibold text-slate-800">
              Business Entity Master
          </h1>
          <Link to={`/1/business-entity-master/create`} className='bg-slate-700 text-white font-medium rounded-lg px-4 py-0 text-sm flex items-center'>
            Create New
          </Link>
        </div>
        <div className="px-10 mt-5">
            <Table 
              rowSelection={{
                type: selectionType,
                ...rowSelection
              }}
              dataSource={businessEntityData}
              columns={columns}
            />
            <Modal title="Delete Business Entity?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}></Modal>
        </div>
    </Layout>
  )
}

export default BusinessEntityIndex