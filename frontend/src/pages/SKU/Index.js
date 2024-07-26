import Layout from '../../components/Layout'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { Modal, Select, Table } from 'antd';
import { axiosConfig } from '../../axios/axiosConfig';
import { SiTicktick } from 'react-icons/si';
import { RiDeleteBinLine } from 'react-icons/ri';

const createSkuFormState = {
  sku_code: '',
  sku_name: ''
}

function SKUIndex() {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [isEditOn, setIsEditOn] = useState(false);
  const [createSku, setcreateSku] = useState(createSkuFormState);
  const [skuData, setSkuData] = useState();
  const [checkedRows, setCheckedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "sku_code"
    },
    {
      title: "Name",
      dataIndex: "sku_name"
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
    setcreateSku({...createSku, [name]: value});
  }

  const handleClear = () => {
    setIsEditOn(false);
    setcreateSku(createSkuFormState);
  };

  const getAllSKUs = async () => {
    const res = await axiosConfig.get('/sku/');
    // return console.log(res.data);

    const data = res.data.detail.sort((a, b) => a.sku_master_id - b.sku_master_id)
                  .map((sku) => ({
                    ...sku,
                    key: sku.sku_master_id
                  }))
    setSkuData(data);
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setCheckedRows(selectedRows);
    },
  };

  const onEdit = (skus) => {
    setcreateSku({
      sku_code: skus[0].sku_code,
      sku_name: skus[0].sku_name,
    });
  };
  
  const handleSubmit = async (e) => {
    try {
      let res;

      if(!isEditOn) {
        res = await axiosConfig.post('/sku/', createSku);
      } else {
        // return console.log(`/users/${checkedRows[0].user_master_id}`);
        res = await axiosConfig.patch(`/sku/${checkedRows[0].sku_master_id}`, createSku);
      }

      if (res.status === 201) {
        toast.success(`SKU created!`);
      } else if (res.status === 200 && isEditOn) {
        toast.success(`${checkedRows[0].sku_code} updated!`);
      }
      
      handleClear();
      await getAllSKUs();
    } catch(error) {
      console.error("ERR::POST::CONTAINER");
      toast.error("Something went wrong");
    }
  }

  const onDelete = async (sku) => {
    const { sku_master_id } = sku[0];
    try {
      const res = await axiosConfig.delete(
        // `/users/${sku_master_id}?last_updated_by=${last_updated_by}`
        `/sku/${sku_master_id}`
      );
      getAllSKUs();
      if (res.status === 204) {
        toast.success(`${checkedRows[0].sku_code} deleted!`);
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
    getAllSKUs();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl p-3 font-semibold text-slate-800">
        SKU Master
      </h1>
      <div className="px-10">
        <div className="grid grid-cols-3 h-full my-4 gap-x-5">
          <div className="flex flex-col gap-y-4">
            {/* Col-1 Fields go here */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="" className="text-sm font-medium">
                SKU Code *
              </label>
              <input 
                type="text" 
                name="sku_code"
                onChange={handleInputChange}
                value={createSku.sku_code}
                className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
                tabIndex={1}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-4">
            {/* Col-2 Fields go here */}
            <div className="flex flex-col gap-y-2">
              <label htmlFor="" className="text-sm font-medium">
                SKU Name *
              </label>
              <input 
                type="text" 
                name="sku_name"
                onChange={handleInputChange}
                value={createSku.sku_name}
                className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600" 
                tabIndex={2}
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-x-5">
          <button
            onClick={handleClear}
            className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
            tabIndex={3}
          >
            <RiDeleteBinLine /> {isEditOn ? "Cancel" : "Clear"}
          </button>
          <button
            onClick={handleSubmit}
            className="bg-teal-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
            tabIndex={4}
          >
            <SiTicktick /> {isEditOn ? "Update" : "Add"}
          </button>
        </div>
      </div>
      <hr className="my-2 text-slate-700" />    
      <div className='space-y-5'>
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
            dataSource={skuData} 
            columns={columns} 
          />
          <Modal title="Delete SKU" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}></Modal>
        </div>
      </div>   
    </Layout>
  )
}

export default SKUIndex