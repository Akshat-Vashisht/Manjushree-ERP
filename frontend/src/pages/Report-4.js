import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {Table, Dropdown } from "antd";
import { axiosConfig } from "../axios/axiosConfig";

const Report4 = () => {
  const [option, setOption] = useState([]);
  const [selectedOption, setSelectedOption] = useState("All");
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  async function getAllVendorsOptions() {
    try {
      const res = await axiosConfig.get("/reports/get-vendors");
      setOption(
        res.data.map((item, index) => ({
          label: item,
          key: index,
        }))
      );
    } catch (error) {
      console.error("ERR::GET::ALL");
    }
  }
  async function getAllVendors() {
    try {
      const res = await axiosConfig.get(
        `/reports/get-vendor-report/${selectedOption}`
      );
      setDataSource(res.data.map((item, index) => ({ ...item, key: index })));
      setColumns([
        {
          title: "Business Entity Name",
          dataIndex: "business_entity_name",
          key: "business_entity_name",
        },
        {
          title: "Date",
          dataIndex: "datetime",
          key: "date",
          render: (text) =>
            new Date(text)
              .toLocaleDateString()
              .replace("/", "-")
              .replace("/", "-"),
        },
        {
          title: "Time",
          dataIndex: "datetime",
          key: "time",
          render: (text) => new Date(text).toLocaleTimeString(),
        },
        {
          title: "Container Category",
          dataIndex: "container_category",
          key: "container_category",
        },
        {
          title: "Container Code",
          dataIndex: "container_code",
          key: "container_code",
        },
        {
          title: "RFID Tag No",
          dataIndex: "rfid_tag_no",
          key: "rfid_tag_no",
        },
      ]);
    } catch (error) {
      console.error("ERR::GET::ALL");
    }
  }
  const items = option.map((item) => ({
    key: item.key,
    label: item.label,
    onClick: () => setSelectedOption(item.label),
  }));

  useEffect(() => {
    getAllVendorsOptions();
  }, []);
  useEffect(() => {
    getAllVendors();
  }, [selectedOption]);

  return (
    <Layout>
      <h1 className="font-semibold text-lg mb-5">
        Containers Detail Client Wise
      </h1>
      <hr className="mb-5 text-slate-700" />
      <Dropdown
        className="border border-slate-400 rounded-md w-[10rem] px-3 py-1 my-5"
        menu={{ items }}
        trigger={["click"]}
      >
        <a
          className="text-sm block cursor-pointer"
          onClick={(e) => e.preventDefault()}
        >
          {selectedOption || "Select Vendor"}
        </a>
      </Dropdown>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </Layout>
  );
};

export default Report4;
