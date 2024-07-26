import React, { useEffect, useState } from "react";
import { axiosConfig } from "../axios/axiosConfig";
import { Table } from "antd";
import Layout from "../components/Layout"

const Report2 = () => {
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  async function getAllContainersAtManjushree() {
    try {
      const res = await axiosConfig.get("/reports/containers-at-manjushree");
      setDataSource(res.data);
      setColumns(
        Object.keys(res.data[0] || {}).map((item) => ({
          title: item.split("_").join(" ").toUpperCase(),
          dataIndex: item,
          key: item,
        }))
      );
    } catch (error) {
      console.error("ERR::GET::MANJUSHREE");
    }
  }
  useEffect(() => {
    getAllContainersAtManjushree();
  }, [])
  
  return (
    <Layout>
      <h1 className="font-semibold text-lg mb-5">Containers at Manjushree</h1>
      <hr className="mb-2 text-slate-700" />

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </Layout>
  );
};

export default Report2;
