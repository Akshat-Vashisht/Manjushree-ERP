import React, { useEffect, useState } from "react";
import { DatePicker, Modal, Select, Table } from "antd";
import { SiTicktick } from "react-icons/si";
import { RiDeleteBinLine } from "react-icons/ri";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { axiosConfig } from "../axios/axiosConfig";
import { useSelector } from "react-redux";

const ContainerMaster = () => {
  const user = useSelector((state) => state.user.user);
  const [containerData, setContainerData] = useState([]);
  const [checkedRowKey, setCheckedRowKey] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isEditOn, setIsEditOn] = useState(false);
  const master_id = useSelector((state) => state.user.user.user_master_id);

  const [createContainer, setCreateContainer] = useState({
    container_category_master_id: null,
    container_status: "",
    rfid_tag_no: "",
    last_updated_by: user.master_id,
  });

  const categoryMap = {
    1: "Steel Case",
    2: "PP Box",
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "container_code",
    },
    {
      title: "Category",
      dataIndex: "container_category",
    },
    {
      title: "Registration Date",
      dataIndex: "container_registration_dt",
      render: (date) => format(new Date(date), "dd-MM-yyyy"),
    },
    {
      title: "Unregistration Date",
      dataIndex: "container_unregistered_date",
    },
    {
      title: "Status",
      dataIndex: "container_status",
    },
    {
      title: "RFID Tag No",
      dataIndex: "rfid_tag_no",
    },
    {
      title: "RFID Registration Date",
      dataIndex: "rfid_registration_dt",
      render: (date) => format(new Date(date), "dd-MM-yyyy"),
    },
    {
      title: "Active",
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
  ];

  const getAllContainer = async () => {
    try {
      const res = await axiosConfig.get("/containers/");
      const dataWithKeys = res.data.detail
        .sort((a, b) => a.container_master_id - b.container_master_id)
        .map((item) => ({
          ...item,
          key: item.container_master_id,
        }));
      setContainerData(dataWithKeys);
    } catch (error) {
      console.error("ERR::GET::CONTAINER", error);
      toast.error("Something went wrong");
    }
  };

  const getAllCategory = async () => {
    try {
      const res = await axiosConfig.get("/container-categories/category-id");
      setCategoryData(
        res.data.detail.map((item) => ({ value: item.id, label: item.name }))
      );
    } catch (error) {
      console.error("ERR::GET::CATEGORY", error);
      toast.error("Something went wrong");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCreateContainer({ ...createContainer, [name]: value });
  };

  const handleChange = (value) => {
    setCreateContainer({
      ...createContainer,
      container_category_master_id: value,
    });
  };

  const handleSubmit = async () => {
    if (checkFields()) {
      try {
        let res;
        if (!isEditOn)
          res = await axiosConfig.post("/containers/", createContainer);
        else res = await axiosConfig.patch("/containers/", createContainer);

        if (res.status === 201) {
          toast.success(`${res.data.detail.container_code} created!`);
        } else if (res.status === 204 && isEditOn) {
          toast.success(`${checkedRows[0].container_code} updated!`);
        }
        getAllContainer();
        handleClear();
      } catch (error) {
        console.error("ERR::POST::CONTAINER");
        toast.error("Something went wrong");
      }
    }
  };

  const checkFields = () => {
    if (
      createContainer.container_category_master_id === null ||
      createContainer.container_status === "" ||
      createContainer.rfid_tag_no === ""
    ) {
      toast.error("Please fill all the fields");
      return false;
    }
    return true;
  };
  const handleReset = () => {
    setCheckedRowKey(null);
    setCheckedRows([]);
  };
  const handleClear = () => {
    setIsEditOn(false);
    setCreateContainer({
      container_category_master_id: null,
      container_status: "",
      rfid_tag_no: "",
      last_updated_by: user.master_id,
    });
  };

  const onEdit = (container) => {
    setCreateContainer({
      container_master_id: container[0].container_master_id,
      container_category_master_id: container[0].container_category_master_id,
      container_status: container[0].container_status,
      rfid_tag_no: container[0].rfid_tag_no,
      last_updated_by: user.master_id,
    });
  };
  const onDelete = async (container) => {
    const { container_master_id, last_updated_by } = container[0];
    try {
      const res = await axiosConfig.patch(
        `/containers/${container_master_id}?last_updated_by=${last_updated_by}`
      );
      getAllContainer();
      if (res.status === 204) {
        toast.success(`${checkedRows[0].container_code} deleted!`);
      }
    } catch (error) {
      console.error("ERR::PATCH::CONTAINER", error);
      toast.error("Something went wrong");
    }
  };
  const rowSelection = {
    selectedRowKeys: checkedRowKey ? [checkedRowKey] : [],
    type: "radio",
    onSelect: (record) => {
      if (checkedRowKey === record.key) {
        setCheckedRowKey(null);
        setCheckedRows([]);
      } else {
        setCheckedRowKey(record.key);
        setCheckedRows([record]);
      }
    },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    onDelete(checkedRows);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getAllContainer();
    getAllCategory();
  }, []);

  useEffect(() => {
    setCreateContainer({
      ...createContainer,
      ["last_updated_by"]: master_id,
    });
  }, [master_id]);

  return (
    <Layout>
      <h1 className="text-2xl p-3 font-semibold text-slate-800">
        Container Master
      </h1>
      <hr className="mb-2 text-slate-700" />
      <div className="px-10">
        <div className="grid grid-cols-2 h-full my-4 gap-x-5 ">
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-1">
              <label className="text-sm font-medium">Container Status</label>
              <input
                type="text"
                name="container_status"
                value={createContainer.container_status}
                onChange={handleInputChange}
                placeholder=""
                className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label className="text-sm font-medium">RFID Tag No.</label>
              <input
                type="text"
                placeholder=""
                name="rfid_tag_no"
                value={createContainer.rfid_tag_no}
                onChange={handleInputChange}
                className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-1">
              <label className="text-sm font-medium">Container Category</label>
              <Select
                disabled={isEditOn}
                value={createContainer.container_category_master_id}
                className="bg-slate-100"
                onChange={handleChange}
                options={categoryData}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-x-5">
          <button
            onClick={handleClear}
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
        <hr className="my-4 text-slate-700" />
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
            
            <button
              onClick={handleReset}
              className="p-1 px-3 bg-gray-200 rounded-md disabled:bg-gray-100"
            >
              Reset
            </button>
          </div>
        )}
        <Table
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={containerData}
        />

        <Modal
          title="Delete Container"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>
            Are you sure you want to delete {checkedRows[0]?.container_code} ?
          </p>
        </Modal>
      </div>
    </Layout>
  );
};

export default ContainerMaster;
