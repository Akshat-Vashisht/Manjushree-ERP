import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Menu, Table, Dropdown } from "antd";
import { axiosConfig } from "../axios/axiosConfig";

const Report3 = () => {
  const [option, setOption] = useState([]);
  const [selectedOption, setSelectedOption] = useState("All");
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  async function getAllClientOptions() {
    try {
      const res = await axiosConfig.get("/reports/get-clients");
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
  async function getAllClients() {
    try {
      const res = await axiosConfig.get(
        `/reports/get-client-report/${selectedOption}`
      );
      setDataSource(res.data);
      setColumns(
        Object.keys(res.data[0] || {}).map((item) => ({
          title: item.split("_").join(" ").toUpperCase(),
          dataIndex: item,
          key: item,
        }))
      );
    } catch (error) {
      console.error("ERR::GET::ALL");
    }
  }

  const menu = (
    <Menu
      items={option.map((e) => ({
        key: e.key,
        label: e.label,
        onClick: () => {
          setSelectedOption(e.label);
        },
      }))}
    />
  );
  useEffect(() => {
    getAllClientOptions();
  }, []);
  useEffect(() => {
    getAllClients();
  }, [selectedOption]);

  return (
    <Layout>
      <h1 className="font-semibold text-lg mb-5">
        Containers Detail Client Wise
      </h1>
      <hr className="mb-2 text-slate-700" />
      <Dropdown
        className="border border-slate-400 rounded-md w-[10rem] px-3 py-1 my-2"
        overlay={menu}
        trigger={["click"]}
      >
        <a
          className="text-sm block cursor-pointer"
          onClick={(e) => e.preventDefault()}
        >
          {selectedOption || "Select Client"}
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

export default Report3;
