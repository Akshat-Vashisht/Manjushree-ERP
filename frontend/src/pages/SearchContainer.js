import React, { useEffect, useState } from "react";
import { Select, Table, Button } from "antd";
import Layout from "../components/Layout";
import { axiosConfig } from "../axios/axiosConfig";
import { format } from "date-fns";
import toast from "react-hot-toast";

const SearchContainer = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [businessEntities, setBusinessEntities] = useState([]);
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    container_code: "",
    business_entity: "",
    sku_code: "",
    pick_list_code: "",
    rfid_tag_id: "",
    location: "",
    sku_name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getContainerData = async () => {
    try {
      const res = await axiosConfig.get("/container-movement/");
      setDataSource(
        res.data.detail.map((item, index) => ({ ...item, index: index + 1 }))
      );
      setFilteredData(
        res.data.detail.map((item, index) => ({ ...item, index: index + 1 }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getBusinessEntities = async () => {
    try {
      const res = await axiosConfig.get("/reports/business-entity-names");
      setBusinessEntities([...res.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    const fromDate = filters.from_date ? new Date(filters.from_date) : null;
    const toDate = filters.to_date ? new Date(filters.to_date) : null;
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (fromDate && fromDate > today) {
      toast.error("From Date cannot be greater than today");
      return;
    }
    if (fromDate && toDate && fromDate > toDate) {
      toast.error("From Date cannot be later than To Date");
      return;
    }

    const filtered = dataSource.filter((item) => {
      const scanningDate = new Date(item.scanning_dt);

      return (
        (!fromDate || scanningDate >= fromDate) &&
        (!toDate || scanningDate <= toDate) &&
        (!filters.container_code ||
          item.container_code.includes(filters.container_code)) &&
        (!filters.business_entity ||
          item.business_entity_name.includes(filters.business_entity)) &&
        (!filters.sku_code || item.sku_code?.includes(filters.sku_code)) &&
        (!filters.pick_list_code ||
          item.pick_list_code?.includes(filters.pick_list_code)) &&
        (!filters.rfid_tag_id ||
          item.rfid_tag_no.includes(filters.rfid_tag_id)) &&
        (!filters.location || item.location_name.includes(filters.location)) &&
        (!filters.sku_name || item.sku_name?.includes(filters.sku_name))
      );
    });
    setFilteredData(filtered);
  };

  const handleClear = () => {
    setFilters({
      from_date: "",
      to_date: "",
      container_code: "",
      business_entity: "",
      sku_code: "",
      pick_list_code: "",
      rfid_tag_id: "",
      location: "",
      sku_name: "",
    });
    setFilteredData(dataSource);
  };

  useEffect(() => {
    getContainerData();
    getBusinessEntities();
  }, []);

  const columns = [
    {
      title: "Sr. No.",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Container Code",
      dataIndex: "container_code",
      key: "container_code",
    },
    {
      title: "RFID Tag ID",
      dataIndex: "rfid_tag_no",
      key: "rfid_tag_no",
    },
    {
      title: "Business Entity",
      dataIndex: "business_entity_name",
      key: "business_entity_name",
    },
    {
      title: "Location",
      dataIndex: "location_name",
      key: "location_name",
    },
    {
      title: "Date",
      dataIndex: "scanning_dt",
      key: "scanning_dt",
      render: (text) => format(new Date(text), "dd-MM-yyyy"),
    },
    {
      title: "Time",
      dataIndex: "scanning_dt",
      key: "scanning_dt",
      render: (text) => new Date(text).toLocaleTimeString(),
    },
    {
      title: "SKU Code",
      dataIndex: "sku_code",
      key: "sku_code",
    },
    {
      title: "SKU Name",
      dataIndex: "sku_name",
      key: "sku_name",
    },
    {
      title: "Pick List Code",
      dataIndex: "pick_list_code",
      key: "pick_list_code",
    },
  ];

  const locationOptions = [
    { value: "Inward Warehouse", label: "Inward Warehouse" },
    { value: "Production Entry", label: "Production Entry" },
    { value: "Production Complete", label: "Production Complete" },
    { value: "Production Exit", label: "Production Exit" },
    { value: "FG Warehouse Entry", label: "FG Warehouse Entry" },
    { value: "FG Warehouse Exit", label: "FG Warehouse Exit" },
    { value: "Dispatch Loading", label: "Dispatch Loading" },
  ];

  return (
    <Layout>
      <h1 className="font-semibold text-lg mb-5">Search Containers</h1>
      <hr className="mb-2 text-slate-700" />
      <div className="grid grid-cols-2 gap-x-10 gap-y-4">
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">From Date</label>
            <input
              type="date"
              name="from_date"
              value={filters.from_date}
              onChange={handleInputChange}
              className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Container Code</label>
            <input
              type="text"
              name="container_code"
              value={filters.container_code}
              onChange={handleInputChange}
              className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Business Entity</label>
            <Select
              value={filters.business_entity}
              className="bg-slate-100"
              onChange={(value) => handleSelectChange("business_entity", value)}
              options={businessEntities.map((value) => ({
                value,
                label: value,
              }))}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">SKU Code</label>
            <input
              type="text"
              name="sku_code"
              value={filters.sku_code}
              onChange={handleInputChange}
              className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Pick List Code</label>
            <input
              type="text"
              name="pick_list_code"
              value={filters.pick_list_code}
              onChange={handleInputChange}
              className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">To Date</label>
            <input
              type="date"
              name="to_date"
              value={filters.to_date}
              onChange={handleInputChange}
              className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">RFID Tag ID</label>
            <input
              type="text"
              name="rfid_tag_id"
              value={filters.rfid_tag_id}
              onChange={handleInputChange}
              className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">Location</label>
            <Select
              value={filters.location}
              className="bg-slate-100"
              onChange={(value) => handleSelectChange("location", value)}
              options={locationOptions}
              disabled={filters.business_entity !== "Manjushree"}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-sm font-medium">SKU Name</label>
            <Select
              value={filters.sku_name}
              className="bg-slate-100"
              onChange={(value) => handleSelectChange("sku_name", value)}
              options={[...new Set(dataSource.map((item) => item.sku_name))]
                .filter(Boolean)
                .map((value) => ({ value, label: value }))}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-x-4 my-5">
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={handleClear}
        >
          Clear All
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="container_movement_id"
        className="mt-5"
        pagination={{ pageSize: 5 }}
      />
    </Layout>
  );
};

export default SearchContainer;
