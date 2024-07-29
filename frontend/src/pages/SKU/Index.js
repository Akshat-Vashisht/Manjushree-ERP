import Layout from '../../components/Layout'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { Modal, Table } from "antd";
import { axiosConfig } from "../../axios/axiosConfig";
import SKUForm from "../../components/Forms/SKUForm";

function SKUIndex() {
  const [editSku, setEditSku] = useState(null);
  const [skuData, setSkuData] = useState();
  const [checkedRows, setCheckedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "sku_code",
    },
    {
      title: "Name",
      dataIndex: "sku_name",
    },
    {
      title: "Active",
      dataIndex: "is_active",
      render: (active) =>
        active ? (
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
  ];

  const getAllSKUs = async () => {
    const res = await axiosConfig.get("/sku/");
    // return console.log(res.data);

    const data = res.data.detail
      .sort((a, b) => a.sku_master_id - b.sku_master_id)
      .map((sku) => ({
        ...sku,
        key: sku.sku_master_id,
      }));
    setSkuData(data);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setCheckedRows(selectedRows);
    },
  };

  const handleFormResponse = async (res, identifier = null) => {
    if (res.status === 201) {
      toast.success(`SKU created!`);
    } else if (res.status === 200 && identifier) {
      toast.success(`${identifier} updated!`);
    }

    setEditSku(null);
    await getAllSKUs();
  };

  const onEdit = (skus) => {
    setEditSku(skus[0]);
  };

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
      <h1 className="text-2xl p-3 font-semibold text-slate-800">SKU Master</h1>
      <SKUForm sku={editSku} responseHandler={handleFormResponse} />
      <hr className="my-2 text-slate-700" />
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
            dataSource={skuData}
            columns={columns}
          />
          <Modal
            title="Delete SKU"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          ></Modal>
        </div>
      </div>
    </Layout>
  );
}

export default SKUIndex