import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosConfig } from "../../axios/axiosConfig";

const defaultFormState = {
  business_entity_code: "",
  business_entity_name: "",
  address: "",
  city: "",
  district: "",
  state: "",
  country: "",
  pin: "",
  telephone_no1: "",
  mobile_no1: "",
  email_id: "",
  logo: "",
  entity_type: "",
};

function BusinessEntityForm({
  formInputs = null,
  id = null,
  responseHandler = (res) => {},
}) {
  const [formData, setFormData] = useState(defaultFormState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sanitizeData = (data, direction = 1) => {
    let _data = { ...data };

    switch (direction) {
      case 1:
        // Santize data recieved
        _data.entity_type = null;

        if (data.is_client) _data.entity_type = "client";

        if (data.is_vendor) _data.entity_type = "vendor";

        if (data.is_transporter) _data.entity_type = "transporter";

        // Remove unwanted data
        [
          "business_entity_master_id",
          "is_client",
          "is_vendor",
          "is_transporter",
          "is_active",
          "last_updated_dt",
          "last_updated_by",
        ].map((key) => delete _data[key]);
        break;
      case 2:
        // Sanitize data to be sent
        _data.is_client = data.entity_type === "client";
        _data.is_vendor = data.entity_type === "vendor";
        _data.is_transporter = data.entity_type === "transporter";

        delete _data.entity_type;
        break;
    }

    return _data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      const cleanData = sanitizeData(formData, 2);

      if (id) {
        res = await axiosConfig.patch(`/business-entities/${id}`, cleanData);
      } else {
        res = await axiosConfig.post(`/business-entities/`, cleanData);
      }
      responseHandler(res);
    } catch (error) {
      console.error(error);
      responseHandler(error.response);
    }
  };

  useEffect(() => {
    if (formInputs) setFormData(sanitizeData(formInputs));
  }, []);

  const baseInputClass =
    "bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-2 rounded-md text-slate-600";
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-x-5 grid-cols-2">
        {/* Col 1 */}
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Business Entity Code *
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            name="business_entity_code"
            value={formData.business_entity_code}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Business Entity Name *
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            name="business_entity_name"
            value={formData.business_entity_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col mb-3 col-span-2">
          <label htmlFor="" className="text-sm font-medium">
            Address *
          </label>
          <textarea
            type="text"
            placeholder=""
            className={baseInputClass}
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            District
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            name="district"
            value={formData.district}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            State
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            name="state"
            value={formData.state}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            City *
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Pincode *
          </label>
          <input
            type="number"
            placeholder=""
            className={baseInputClass}
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Country
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Telephone No 1
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            name="telephone_no1"
            value={formData.telephone_no1}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder=""
            className={baseInputClass}
            name="email_id"
            value={formData.email_id}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Mobile No 1
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            name="mobile_no1"
            value={formData.mobile_no1}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col mb-3 col-span-2">
          <label htmlFor="" className="text-sm font-medium">
            Logo
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            name="logo"
            value={formData.logo}
            onChange={handleInputChange}
          />
        </div>
        {/* Col 3 wide */}
        <div className="col-span-2 mt-6">
          <label htmlFor="">Business Entity Type *</label>
          <div className="flex gap-x-10 mt-3">
            <div>
              <input
                type="radio"
                name="entity_type"
                id="entity_type_client"
                value={"client"}
                required
                onChange={handleInputChange}
                checked={formData.entity_type === "client"}
              />
              <label htmlFor="entity_type_client" className="ml-4">
                Client
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="entity_type"
                id="entity_type_vendor"
                value={"vendor"}
                required
                onChange={handleInputChange}
                checked={formData.entity_type === "vendor"}
              />
              <label htmlFor="entity_type_vendor" className="ml-4">
                Vendor
              </label>
            </div>
            <div>
              <input
                type="radio"
                name="entity_type"
                id="entity_type_transporter"
                value={"transporter"}
                required
                onChange={handleInputChange}
                checked={formData.entity_type === "transporter"}
              />
              <label htmlFor="entity_type_transporter" className="ml-4">
                Transporter
              </label>
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-10" />
      <div className="flex justify-center items-center gap-x-5 p-2">
        <button
          type="submit"
          className="bg-green-600 text-white rounded-md text-sm p-2"
        >
          Save
        </button>
        <Link
          to="/1/business-entity-master"
          className="bg-red-600 text-white rounded-md text-sm p-2"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default BusinessEntityForm;
