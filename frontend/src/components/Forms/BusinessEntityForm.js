import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosConfig } from "../../axios/axiosConfig";
import { useFormik, Field } from 'formik';
import * as Yup from 'yup';
import FormFieldError from "../FormFieldError";

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

const getInitialValues = (values = null) => {
  if(values)
    return sanitizeData(values)
  return defaultFormState
}

function BusinessEntityForm({
  formInputs = null,
  id = null,
  responseHandler = (res) => {},
}) {
  // const [logoFile, setLogoFile] = useState(null);
  const formik = useFormik({
    initialValues: getInitialValues(formInputs),
    validationSchema: Yup.object({
      business_entity_code: Yup.string()
          .min(5, 'Min 5 characters')
          .max(10, 'Enter maximum 10 characters')
          .required('Business Entity Code is a required field'),
      business_entity_name: Yup.string()
        .max(100, 'Enter maximum 100 characters')
        .required('Business Entity Name is a required field'),
      address: Yup.string()
        .max(400, 'Enter maximum 400 characters')
        .required('Address is a required field'),
      district: Yup.string()
        .max(50, 'Enter maximum 50 characters'),
      state: Yup.string()
        .max(50, 'Enter maximum 50 characters'),
      country: Yup.string()
        .max(50, 'Enter maximum 50 characters'),
      telephone_no1: Yup.string()
        .max(20, 'Enter maximum 20 characters'),
      mobile_no1: Yup.string()
        .max(15, 'Enter maximum 15 characters'),
      email_id: Yup.string()
        .email('Enter a valid email address')
        .max(100, 'Enter maximum 100 characters'),
    }),
    onSubmit: async (values) => {
      console.log(values);

      try {
        let res;
        
        const cleanData = sanitizeData(values, 2);
  
        if (id) {
          res = await axiosConfig.patch(`/business-entities/${id}`, cleanData);
        } else {
          res = await axiosConfig.post(`/business-entities/`, cleanData);
        }
  
        // Check for logo and upload file
        // if(logoFile) {
        //   const _formData = new FormData(); 
        //   _formData.append('logo', logoFile);
  
        //   const logoRes = await axiosConfig.post(`/business-entities/${id}/logo`, _formData, {
        //     headers: {
        //       "Accept": "application/json",
        //       "Content-Type": "multipart/form-data",
        //     }
        //   })
  
        //   console.log(logoRes);
        // }
        responseHandler(res);
      } catch (error) {
        console.error(error);
        responseHandler(error.response);
      }
    }
  });

  // const handleFileChange = (e) => {
  //   setLogoFile(e.target.files[0]);
  // };

  const baseInputClass =
    "bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-2 rounded-md text-slate-600";
  return (
    <form onSubmit={formik.handleSubmit}>
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
            id="business_entity_code"
            name="business_entity_code"
            value={formik.values.business_entity_code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.business_entity_code && formik.touched.business_entity_code && <FormFieldError message={formik.errors.business_entity_code} />}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Business Entity Name *
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            id="business_entity_name"
            name="business_entity_name"
            value={formik.values.business_entity_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.business_entity_name && formik.touched.business_entity_name && <FormFieldError message={formik.errors.business_entity_name} />}
        </div>
        <div className="flex flex-col mb-3 col-span-2">
          <label htmlFor="" className="text-sm font-medium">
            Address *
          </label>
          <textarea
            type="text"
            placeholder=""
            className={baseInputClass}
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          ></textarea>
          {formik.errors.address && formik.touched.address && <FormFieldError message={formik.errors.address} />}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            District
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            id="district"
            name="district"
            value={formik.values.district}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.district && formik.touched.district && <FormFieldError message={formik.errors.district} />}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            State
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            id="state"
            name="state"
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            />
            {formik.errors.state && formik.touched.state && <FormFieldError message={formik.errors.state} />}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            City *
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            id="city"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.city && formik.touched.city && <FormFieldError message={formik.errors.city} />}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Pincode *
          </label>
          <input
            type="number"
            placeholder=""
            className={baseInputClass}
            id="pin"
            name="pin"
            value={formik.values.pin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.errors.pin && formik.touched.pin && <FormFieldError message={formik.errors.pin} />}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Country
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            id="country"
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.country && formik.touched.country && <FormFieldError message={formik.errors.country} />}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Telephone No 1
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            id="telephone_no1"
            name="telephone_no1"
            value={formik.values.telephone_no1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.telephone_no1 && formik.touched.telephone_no1 && <FormFieldError message={formik.errors.telephone_no1} />}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            placeholder=""
            className={baseInputClass}
            id="email_id"
            name="email_id"
            value={formik.values.email_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email_id && formik.touched.email_id && <FormFieldError message={formik.errors.email_id} />}
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="text-sm font-medium">
            Mobile No 1
          </label>
          <input
            type="text"
            placeholder=""
            className={baseInputClass}
            id="mobile_no1"
            name="mobile_no1"
            value={formik.values.mobile_no1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.mobile_no1 && formik.touched.mobile_no1 && <FormFieldError message={formik.errors.mobile_no1} />}
        </div>

        {/* <div className="flex flex-col mb-3 col-span-2">
          <label htmlFor="" className="text-sm font-medium">
            Logo
          </label>
          <input
            type="file"
            placeholder=""
            className={baseInputClass}
            name="logo"
            value={formData.logo}
            onChange={formik.handleChange}
          />
        </div> */}
        {/* Col 3 wide */}
        <div className="col-span-2 mt-6">
          <label htmlFor="">Business Entity Type</label>
          <div className="flex gap-x-10 mt-3">
            <div>
              <input
                type="radio"
                name="entity_type"
                id="entity_type_client"
                value={"client"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.entity_type === 'client'}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.entity_type === 'vendor'}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.entity_type === 'transporter'}
              />
              <label htmlFor="entity_type_transporter" className="ml-4">
                Transporter
              </label>
            </div>
            {formik.errors.entity_type && formik.touched.entity_type && <FormFieldError message={formik.errors.entity_type} />}
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
