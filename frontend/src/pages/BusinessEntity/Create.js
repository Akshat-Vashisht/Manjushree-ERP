import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import React, { useState } from "react";
import BusinessEntityForm from "../../components/Forms/BusinessEntityForm";
import toast from "react-hot-toast";

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

function CreateBusinessEntity() {
  const [formData, setFormData] = useState(defaultFormState);
  const navigate = useNavigate();

  const handleFormResponse = (res) => {
    switch (res.status) {
      case 201:
        toast.success("Business Entity created successfully.");
        break;
      case 200:
        toast.success("Business Entity updated successfully.");
        break;
      case 400:
        const { detail } = res.data;
        if (detail.error) toast.error(detail.message);
        break;
      default:
        toast.error("Something went wrong");
        break;
    }

    if ([200, 201].includes(res.status)) navigate("/1/business-entity-master");
  };

  return (
    <Layout>
      <div className="bg-white rounded-md shadow-md p-6">
        <h1 className="text-2xl mb-2 font-semibold text-slate-800">
          Create Business Entity
        </h1>
        <hr />
        <div className="mt-10">
          <BusinessEntityForm responseHandler={handleFormResponse} />
        </div>
      </div>
    </Layout>
  );
}

export default CreateBusinessEntity;
