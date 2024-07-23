import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { axiosConfig } from "../../axios/axiosConfig";
import toast from "react-hot-toast";
import BusinessEntityForm from "../../components/Forms/BusinessEntityForm";

function EditBusinessEntity() {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const [businessEntityData, setBusinessEntityData] = useState(null);

  const getEntity = async () => {
    try {
      let res = await axiosConfig.get(`/business-entities/${entityId}`);
      setBusinessEntityData(res.data);
    } catch (error) {
      const { response } = error;

      if (response.status === 404) {
        navigate("/business-entity-master");
      } else {
        toast.error("Something went wrong, please try again later");
      }
    }
  };

  const handleFormResponse = (res) => {
    if (res.status == 200)
      toast.success("Business Entity updated successfully");
    else toast.success("Something went wrong");
  };

  useEffect(() => {
    return async () => {
      await getEntity();
    };
  }, []);

  return (
    <Layout>
      <div className="bg-white rounded-md shadow-md p-4">
        <h1 className="text-2xl mb-2 font-semibold text-slate-800">
          Edit Business Entity
        </h1>
        <hr />
        <div className="mt-10">
          {businessEntityData && (
            <BusinessEntityForm
              formInputs={businessEntityData}
              id={entityId}
              responseHandler={handleFormResponse}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default EditBusinessEntity;
