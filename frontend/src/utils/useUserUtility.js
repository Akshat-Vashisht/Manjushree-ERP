import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  setIsSessionLoaded,
  setLoggedin,
} from "../store/features/common/userSlice";
import { axiosConfig } from "../axios/axiosConfig";

const useUserUtility = () => {
  const dispatch = useDispatch();
  const isLoggedin = useSelector((state) => state.user.isLoggedin);
  const state = useSelector((state)=>state);

  useEffect(() => {
    console.log("state",state)
    const fetchUserDetails = async () => {
      try {
        // if (Object.keys(userData).length === 0) {
        const res = await axiosConfig.get("/auth/users/me");
        dispatch(addUser(res.data));
        dispatch(setLoggedin(true));
        dispatch(setIsSessionLoaded(true));
        // }
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status === 401) {
          dispatch(setLoggedin(false));
          // todo: navigate to login
        }
      }
    };
    fetchUserDetails();
  }, [dispatch, isLoggedin]);
};

export default useUserUtility;
