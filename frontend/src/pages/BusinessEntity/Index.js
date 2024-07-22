import Layout from '../../components/Layout'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { Modal, Select, Table } from 'antd';
import { axiosConfig } from '../../axios/axiosConfig';
import { SiTicktick } from 'react-icons/si';
import { RiDeleteBinLine } from 'react-icons/ri';
import { LuTrash2, LuPencilLine } from 'react-icons/lu';
import { Link } from 'react-router-dom';

function BusinessEntityIndex() {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [checkedRows, setCheckedRows] = useState([]);
  const [businessEntityData, setBusinessEntityData] = useState([]);

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
      "title": "Actions",
      "render": (be) => {
        return (<div className="flex gap-x-4">
          <Link className='text-blue-500' to={`/1/business-entity-master/${be.business_entity_master_id}`}>
            <LuPencilLine />Edit
          </Link>
          <button className='text-red-500'>
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

    const data = res.data
                  .sort((a, b) => a.business_entity_master_id - b.business_entity_master_id)
                  .map((businessEntity) => ({
                    ...businessEntity,
                    key: businessEntity.business_entity_master_id
                  }))

    // console.log(res);
    setBusinessEntityData(data)
  }

  useEffect(() => {
    getAllBusinessEntities();
  }, [])

  return (
    <Layout>
        <div className='flex flex-wrap justify-center lg:justify-between'>
          <h1 className="text-2xl p-3 font-semibold text-slate-800">
              Business Entity Master
          </h1>
          <Link to={`/1/business-entity-master/create`} className='bg-slate-700 text-white font-medium rounded-lg px-4 py-0 text-sm'>
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
        </div>
    </Layout>
  )
}

export default BusinessEntityIndex