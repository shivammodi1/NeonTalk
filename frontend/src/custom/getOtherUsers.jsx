import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import { url } from "../App";

const getOtherUsers = () => {
    const dispatch = useDispatch();
    const {otherUsers} = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${url}/user/others`, {
                    withCredentials: true,
                });

                dispatch(setOtherUsers(res.data));
                
            } catch (error) {
                console.log("Error fetching other users:", error);
            }
        };

        if (!otherUsers.length) {
            fetchUser();
        }
    }, [dispatch, otherUsers.length]);
};

export default getOtherUsers;
