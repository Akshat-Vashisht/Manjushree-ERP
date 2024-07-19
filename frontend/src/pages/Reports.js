import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { axiosConfig } from "../axios/axiosConfig";
import { Table, Dropdown, Menu } from "antd";

const Reports = () => {
  const tabs = ["All", "At Manjushree", "Client Wise", "Vendor Wise"];
  const [active, setActive] = useState(0);
  const [allData, setAllData] = useState([[], [], [], []]);
  const [allOptions, setAllOptions] = useState([[], []]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(["All", "All"]);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);

  async function getAllContainers() {
    try {
      const res = await axiosConfig.get("/reports/all-containers");
      setAllData((prevData) => {
        const newData = [...prevData];
        newData[0] = res.data;
        return newData;
      });
    } catch (error) {
      console.error("ERR::GET::ALL");
    }
  }

  async function getAllContainersAtManjushree() {
    try {
      const res = await axiosConfig.get("/reports/containers-at-manjushree");
      setAllData((prevData) => {
        const newData = [...prevData];
        newData[1] = res.data;
        return newData;
      });
    } catch (error) {
      console.error("ERR::GET::MANJUSHREE");
    }
  }

  async function getAllClientOptions() {
    try {
      const res = await axiosConfig.get("/reports/get-clients");
      setAllOptions((prevOptions) => {
        const newOptions = [...prevOptions];
        newOptions[0] = res.data.map((item, index) => ({
          label: item,
          key: index,
        }));
        return newOptions;
      });
    } catch (error) {
      console.error("ERR::GET::ALL");
    }
  }

  async function getAllVendorsOptions() {
    try {
      const res = await axiosConfig.get("/reports/get-vendors");
      setAllOptions((prevOptions) => {
        const newOptions = [...prevOptions];
        newOptions[1] = res.data.map((item, index) => ({
          label: item,
          key: index,
        }));
        return newOptions;
      });
    } catch (error) {
      console.error("ERR::GET::ALL");
    }
  }

  async function getAllClients() {
    try {
      const res = await axiosConfig.get(
        `/reports/get-client-report/${selectedOption[0]}`
      );
      setAllData((prevData) => {
        const newData = [...prevData];
        newData[2] = res.data;
        return newData;
      });
    } catch (error) {
      console.error("ERR::GET::ALL");
    }
  }

  async function getAllVendors() {
    try {
      const res = await axiosConfig.get(
        `/reports/get-vendor-report/${selectedOption[1]}`
      );
      setAllData((prevData) => {
        const newData = [...prevData];
        newData[3] = res.data;
        return newData;
      });
    } catch (error) {
      console.error("ERR::GET::ALL");
    }
  }

  function handleTabChange(index) {
    setActive(index);
    setDataSource(allData[index]);
    if (index === 2) {
      setOptions(allOptions[0]);
    }
    if (index === 3) {
      setOptions(allOptions[1]);
    }
  }

  useEffect(() => {
    getAllContainers();
    getAllContainersAtManjushree();
    getAllClientOptions();
    getAllVendorsOptions();
  }, []);

  useEffect(() => {
    if (selectedOption[0]) getAllClients();
    if (selectedOption[1]) getAllVendors();
  }, [selectedOption]);
  useEffect(() => {
    setColumns(
      Object.keys(dataSource[0] || {}).map((item) => ({
        title: item.split("_").join(" ").toUpperCase(),
        dataIndex: item,
        key: item,
      }))
    );
  }, [dataSource]);
  useEffect(() => {
    setDataSource(allData[active] || 0);
  }, [allData]);


  const menu = (
    <Menu
      items={options.map((option) => ({
        key: option.key,
        label: option.label,
        onClick: () => {
          if (active === 2) {
            setSelectedOption([option.label, selectedOption[1]]);
          } else if (active === 3) {
            setSelectedOption([selectedOption[0], option.label]);
          }
        },
      }))}
    />
  );

  return (
    <Layout>
      <h1 className="font-semibold text-lg mb-5">
        {tabs[active] ? tabs[active] + " Containers Detail" : ""}
      </h1>
      <div className="flex gap-x-5 text-sm my-4">
        {tabs.map((item, index) => (
          <span
            key={index}
            onClick={() => handleTabChange(index)}
            className={`px-3 py-1 rounded-md cursor-pointer ${
              active === index ? "bg-slate-300" : "bg-slate-100"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      {active === 2 || active === 3 ? (
        <Dropdown
          className="border border-slate-400 rounded-md w-[10rem] px-3 py-1 my-2"
          overlay={menu}
          trigger={["click"]}
        >
          <a
            className="text-sm block cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            {active === 2
              ? selectedOption[0] || "Select Client"
              : selectedOption[1] || "Select Vendor"}
          </a>
        </Dropdown>
      ) : null}
      {active !== null ? (
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      ) : (
        <h1 className="text-center text-sm my-4">Select a Tab</h1>
      )}
    </Layout>
  );
};

export default Reports;
