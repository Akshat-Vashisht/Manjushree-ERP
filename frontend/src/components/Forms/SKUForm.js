import React, { useEffect, useState } from "react";
import { SiTicktick } from "react-icons/si";
import { RiDeleteBinLine } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormFieldError from "../FormFieldError";
import { axiosConfig } from "../../axios/axiosConfig";

const defaultFormState = {
  sku_code: "",
  sku_name: "",
};

function SKUForm({ sku = null, responseHandler = (res, identifier) => {} }) {
  const [skuId, setSkuId] = useState(null);
  const formik = useFormik({
    initialValues: {
      sku_code: sku?.sku_code || defaultFormState.sku_code,
      sku_name: sku?.sku_name || defaultFormState.sku_name,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      sku_code: Yup.string()
        .min(1, "Enter minimum 1 character")
        .max(10, "Enter maximum 10 characters")
        .required("SKU Code is a required field"),
      sku_name: Yup.string()
        .min(1, "Enter minimum 1 character")
        .max(30, "Enter maximum 30 characters")
        .required("SKU Name is a required field"),
    }),
    onSubmit: async (values) => {
      try {
        let res;

        if (!skuId) {
          res = await axiosConfig.post("/sku/", values);
        } else {
          // return console.log(`/users/${checkedRows[0].user_master_id}`);
          res = await axiosConfig.patch(`/sku/${skuId}`, values);
        }

        responseHandler(res, values.sku_code);

        handleClear();
      } catch (error) {
        console.error("ERR::POST::'SKU'");
        responseHandler(error.response);
      }
    },
  });

  const handleClear = () => {
    formik.resetForm();
    setSkuId(null);
  };

  useEffect(() => {
    console.log(sku);
    setSkuId(sku?.sku_master_id ? sku.sku_master_id : null);
  }, [sku]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="px-10">
        <div className="grid grid-cols-3 h-full my-4 gap-x-5">
          <div className="flex flex-col gap-y-2">
            <label htmlFor="" className="text-sm font-medium">
              SKU Code *
            </label>
            <input
              type="text"
              id="sku_code"
              name="sku_code"
              onChange={formik.handleChange}
              onBlue={formik.handleBlur}
              value={formik.values.sku_code}
              className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
              tabIndex={1}
              required
            />
            {formik.errors.sku_code && formik.touched.sku_code && (
              <FormFieldError message={formik.errors.sku_code} />
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="" className="text-sm font-medium">
              SKU Name *
            </label>
            <input
              type="text"
              id="sku_name"
              name="sku_name"
              onChange={formik.handleChange}
              onBlue={formik.handleBlur}
              value={formik.values.sku_name}
              className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
              tabIndex={2}
              required
            />
            {formik.errors.sku_name && formik.touched.sku_name && (
              <FormFieldError message={formik.errors.sku_name} />
            )}
          </div>
          <div className="flex flex-col gap-y-4"></div>
        </div>
        <div className="flex justify-end gap-x-5">
          <button
            type="button"
            onClick={handleClear}
            className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
            tabIndex={3}
          >
            <RiDeleteBinLine /> {sku?.key ? "Cancel" : "Clear"}
          </button>
          <button
            type="submit"
            className="bg-teal-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
            tabIndex={4}
          >
            <SiTicktick /> {sku?.key ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SKUForm;
