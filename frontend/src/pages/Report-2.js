import React, { useEffect, useState } from "react";
import { axiosConfig } from "../axios/axiosConfig";
import { Table } from "antd";
import Layout from "../components/Layout";

const Report2 = () => {
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  async function getAllContainersAtManjushree() {
    try {
      const res = await axiosConfig.get("/reports/containers-at-manjushree");
      setDataSource(res.data);
      setColumns([
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
          title: "Container Location",
          dataIndex: "container_location",
          key: "container_location",
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
        {
          title: "SKU Code",
          dataIndex: "sku_code",
          key: "sku_code",
          render(text) {
            return text ? text : "-";
          },
        },
        {
          title: "Pick List Code",
          dataIndex: "pick_list_code",
          key: "pick_list_code",
          render(text) {
            return text ? text : "-";
          },
        },
      ]);
    } catch (error) {
      console.error("ERR::GET::MANJUSHREE");
    }
  }
  useEffect(() => {
    getAllContainersAtManjushree();
  }, []);

  return (
    <Layout>
      <h1 className="font-semibold text-lg mb-5">Container Details (At Manjushree)</h1>
      <hr className="mb-5 text-slate-700" />

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </Layout>
  );
};

export default Report2;
