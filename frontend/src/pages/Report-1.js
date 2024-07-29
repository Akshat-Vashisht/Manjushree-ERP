import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { axiosConfig } from "../axios/axiosConfig";
import { Table } from "antd";

const Report1 = () => {
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  async function getAllContainers() {
    try {
      const res = await axiosConfig.get("/reports/all-containers");
      setDataSource(
        res.data.map((item, index) => {
          return {
            ...item,
            key: index,
          };
        })
      );
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

  useEffect(() => {
    getAllContainers();
  }, []);

  return (
    <Layout>
      <h1 className="font-semibold text-lg mb-5">All Container Details</h1>
      <hr className="mb-5 text-slate-700" />
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </Layout>
  );
};

export default Report1;
