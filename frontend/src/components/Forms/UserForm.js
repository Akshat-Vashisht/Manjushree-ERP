import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { SiTicktick } from 'react-icons/si';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import FormFieldError from "../FormFieldError";
import { axiosConfig } from '../../axios/axiosConfig';


const defaultFormState = {
  user_code: '',
  user_name: '',
  role: null
}

const getValidationRules = (userId) => {
  let rules = {
    user_code: Yup.string()
                .min(1, 'Enter minumum 1 character')
                .max(10, 'Enter maximum 10 characters')
                .required('User Code is a required field'),
    user_name: Yup.string()
                .min(1, 'Enter minumum 1 character')
                .max(50, 'Enter maximum 50 characters')
                .email('Enter a valid email address')
                .required('User Name is a required field'),
    role: Yup.number()
            .integer('Role must be a valid integer')
            .required('Role is a required field'),
    
  };

  // User updation
  if(userId) {
    rules.password = Yup.string()
                          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character")
                          .notRequired();
    
    rules.confirm_password = Yup.string()
                            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character")
                            .oneOf([Yup.ref('password'), null], 'Both passwords must match')
                              .when('password', (password, schema) => {
                                  if(password.length > 0) {
                                    return schema.required('Confirm Password is required')
                                  } else {
                                    return schema;
                                  }
                              })

    // rules.confirm_password = Yup.string()
    //                           .oneOf([Yup.ref('password'), null], 'Both passwords must match')
    //                           .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character")
                              
  } else {
    // User creation
    rules.password = Yup.string()
                          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character")
                          .required('Password is a required field');

    rules.confirm_password = Yup.string()
                          .oneOf([Yup.ref('password'), null], 'Both passwords must match')
                          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "Password should contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character")
                          .required('Confirm Password is a required field');
  }

  return rules;
}

function UserForm({
  user,
  responseHandler = (res, identifier) => {}
}) {
  const [userId, setUserId] = useState(null);
  const formik = useFormik({
    initialValues: {
      user_code: user?.user_code || defaultFormState.user_code,
      user_name: user?.user_name || defaultFormState.user_name,
      role: user?.role || defaultFormState.role,
    },
    enableReinitialize: true,
    validationSchema: Yup.object(getValidationRules(userId)),
    onSubmit: async (values) => {
      console.log(values);

      try {
        let res;
  
        if(!userId) {
          res = await axiosConfig.post('/users/', values);
        } else {
          // return console.log(`/users/${checkedRows[0].user_master_id}`);
          res = await axiosConfig.patch(`/users/${userId}`, values);
        }
  
        responseHandler(res, formik.values.user_code);
        handleClear();
      } catch(error) {
        console.error("ERR::POST::CONTAINER");
        responseHandler(error.response)
      }
    }
  });

  const roles = [
    {
      value: 1, label: "Admin",
    },
    {
      value: 2, label: "Manager",
    },
    {
      value: 3, label: "Supervisor",
    },
    {
      value: 4, label: "Operator"
    }
  ];

  const handleRoleChange = (value) => {
    formik.setFieldTouched('role', true);
    formik.setFieldValue('role', value)
  }

  const handleClear = () => {
    setUserId(null);
    formik.setValues(defaultFormState);
    formik.setFieldValue('password', '')
    formik.setFieldValue('confirm_password', '')
  };

  useEffect(() => {
    setUserId(user?.user_master_id ? user.user_master_id : null);
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-3 h-full my-4 gap-x-5">
        {/* Col-1 Fields go here */}
        <div className="flex flex-col gap-y-2 mb-5">
          <label htmlFor="" className="text-sm font-medium">
            User Code *
          </label>
          <input
            type="text"
            name="user_code"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.user_code}
            className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            tabIndex={1}
            required
          />
          {formik.errors.user_code && formik.touched.user_code && <FormFieldError message={formik.errors.user_code} />}
        </div>
        <div className="flex flex-col gap-y-2 mb-5">
          <label htmlFor="" className="text-sm font-medium">
            User Name *
          </label>
          <input
            type="text"
            name="user_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.user_name}
            className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            tabIndex={2}
            required
          />
          {formik.errors.user_name && formik.touched.user_name && <FormFieldError message={formik.errors.user_name} />}
        </div>
        <div className="flex flex-col gap-y-2 mb-5">
          <label htmlFor="" className="text-sm font-medium">
            Role *
          </label>
          <Select
            options={roles}
            onChange={handleRoleChange}
            value={formik.values.role}
            tabIndex={3}
          />
          {formik.errors.role && formik.touched.role && <FormFieldError message={formik.errors.role} />}
        </div>
        <div className="flex flex-col gap-y-2 mb-5">
          <label htmlFor="" className="text-sm font-medium">
            Password {!userId && '*'}
          </label>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            tabIndex={4}
            required={!userId}
            />
            {formik.errors.password && formik.touched.password && <FormFieldError message={formik.errors.password} />}
        </div>
        {/* Col-2 Fields go here */}

        <div className="flex flex-col gap-y-2 mb-5">
          <label htmlFor="" className="text-sm font-medium">
            Confirm Password {!userId && '*'}
          </label>
          <input
            type="password"
            name="confirm_password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirm_password}
            className="bg-slate-100 hover:bg-white hover:border-blue-500 border border-slate-200 p-1 rounded-md text-slate-600"
            tabIndex={5}
            required={!userId}
          />
          {formik.errors.confirm_password && formik.touched.confirm_password && <FormFieldError message={formik.errors.confirm_password} />}
        </div>
        {/* Col-3 Fields go here */}

      </div>
      <div className="flex justify-end gap-x-5">
        <button
          type='button'
          onClick={handleClear}
          className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
          tabIndex={6}
        >
          <RiDeleteBinLine /> {userId ? "Cancel" : "Clear"}
        </button>
        <button
          type='submit'
          className="bg-teal-500 text-white px-3 py-1 rounded-md flex items-center gap-x-1"
          tabIndex={7}
        >
          <SiTicktick /> {userId ? "Update" : "Add"}
        </button>
      </div>
    </form>
  )
}

export default UserForm