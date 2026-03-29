import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { url } from "../App";

const getCurrentUser = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userData);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${url}/user/current`, {
                    withCredentials: true,
                });

                dispatch(setUserData(res.data));
            } catch (error) {
                console.log("Error fetching current user:", error);
            }
        };

        if (!userData) {
            fetchUser();
        }
    }, [dispatch, userData]);
};

export default getCurrentUser;
