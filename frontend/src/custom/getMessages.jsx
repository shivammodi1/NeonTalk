import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice"; 
import { url } from "../App";

const getMessages = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get(
                    `${url}/msg/get/${selectedUser._id}`,
                    { withCredentials: true }
                );

                // console.log("MESSAGES:", res.data.data);

                dispatch(setMessages(res.data.data));
            } catch (error) {
                console.log("Error fetching messages:", error);
            }
        };

        if (selectedUser?._id) {
            fetchMessages();
        }
    }, [selectedUser, dispatch]);
};

export default getMessages;