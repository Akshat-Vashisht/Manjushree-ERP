import React, { useEffect, useState } from "react";
import { axiosConfig } from "../axios/axiosConfig";
import Layout from "../components/Layout";
import { Table } from "antd";
import toast, { Toaster } from 'react-hot-toast';
import { format } from "date-fns";

const ContainerMovement = () => {
  const [value, setValue] = useState({
    rfid_tag_no: "",
    container_code: "",
  });
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isEnable, setIsEnable] = useState("");

  async function getContainerMovement() {
    var res;
    try {
      if (isEnable === "container_code")
        res = await axiosConfig.get(
          `/container-movement/history/?${isEnable}=${value.container_code}`
        );
      else
        res = await axiosConfig.get(
          `/container-movement/history/?${isEnable}=${value.rfid_tag_no}`
        );

      setDataSource(res.data.detail);
      setColumns([
        {
          title: "Date",
          dataIndex: "scanning_dt",
          key: "scanning_dt",
          render: (text) => <p>{format(text,"yyyy-MM-dd")}<br/>{new Date(text).toLocaleTimeString()}</p>,
        },
        {
          title: "Container ID",
          dataIndex: "container_code",
          key: "container_code",
        },
        {
          title: "RFID ID",
          dataIndex: "rfid_tag_no",
          key: "rfid_tag_no",
        },
        {
          title: "Business Entity Name",
          dataIndex: "business_entity_name",
          key: "business_entity_name",
          render: (text) => text || "N/A",
        },
        {
          title: "Location",
          dataIndex: "location_name",
          key: "location_name",
        },
        {
          title: "Empty/Filled",
          dataIndex: "sku_master_id",
          key: "sku_master_id",
          render: (sku_master_id) => (sku_master_id ? "Filled" : "Empty"),
        },
        {
          title: "SKU Name",
          dataIndex: "sku_name",
          key: "sku_name",
          render: (text) => text || "N/A",
        },
      ]);
    } catch (error) {
      console.error("ERR", error);
      toast.error("Error fetching data");
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsEnable(name);
  }

  function handleSubmit() {
    if (!value.rfid_tag_no && !value.container_code) {
      toast.error("Please enter either RFID Tag No. or Container Code");
      return;
    }
    getContainerMovement();
  }

  useEffect(() => {}, []);

  return (
    <Layout>
      <Toaster />
      <h1 className="font-semibold text-lg mb-5">Container Movement</h1>
      <hr className="mb-2 text-slate-700" />
      <div className="flex justify-between gap-x-20 items-end mb-10">
        <div className="flex flex-col w-full gap-y-1">
          <label className="text-sm font-medium">RFID Tag No.</label>
          <input
            type="text"
            placeholder="Enter RFID Tag no"
            name="rfid_tag_no"
            value={value.rfid_tag_no}
            disabled={value.container_code}
            onChange={handleInputChange}
            className="bg-slate-50 hover:bg-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:hover:bg-gray-100 disabled:hover:border-slate-200 hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
          />
        </div>
        <div className="flex flex-col w-full gap-y-1">
          <label className="text-sm font-medium">Container Code</label>
          <input
            type="text"
            placeholder="Enter Container Code"
            name="container_code"
            disabled={value.rfid_tag_no}
            value={value.container_code}
            onChange={handleInputChange}
            className="bg-slate-50 hover:bg-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:hover:bg-gray-100 disabled:hover:border-slate-200 hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
          />
        </div>
        <button
          className="bg-slate-50 py-[6px] rounded-md border px-5"
          onClick={handleSubmit}
        >
          Search
        </button>
      </div>
        <Table columns={columns} dataSource={dataSource} />
    </Layout>
  );
};

export default ContainerMovement;
