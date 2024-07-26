import React, { useEffect, useState } from "react";
import { axiosConfig } from "../axios/axiosConfig";
import Layout from "../components/Layout";
import { Table } from "antd";

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
      setColumns(
        Object.keys(res.data.detail[0] || {}).map((item) => ({
          title: (
            <span className="whitespace-nowrap">
              {item.split("_").join(" ").toUpperCase()}
            </span>
          ),
          dataIndex: item,
          key: item,
        }))
      );
    } catch (error) {
      console.error("ERR", error);
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
    getContainerMovement();
  }

  useEffect(() => {}, []);

  return (
    <Layout>
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
      <div className="overflow-x-scroll">
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </Layout>
  );
};

export default ContainerMovement;
