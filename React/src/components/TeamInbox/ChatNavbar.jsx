import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../Dropdown";
import { ContactList } from "../../services/api";

const ChatNavbar = () => {
    const [time, setTime] = useState("");
    const [user, setUser] = useState("");

    const getTime = () => {
        const currentDateTime = new Date();
        const formattedTime = currentDateTime
            .toTimeString()
            .split(" ")[0]
            .slice(0, 5);
        setTime(formattedTime);
    };

    const handleUserChange = (e) => {
        setUser(e.target.value);
    };

    useEffect(() => {
        getTime();
        const interval = setInterval(getTime, 60000); 

        return () => clearInterval(interval); 
    }, []);

    return (
        <div className="flex items-center justify-between bg-white shadow-lg m-1 px-8 py-4 rounded-sm w-[50vw]">
            <div className="text-green-600 font-semibold border-2 rounded-full inline p-2 bg-slate-50">
                {time}
            </div>

            <div className="flex gap-8">
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <span className="text-green-600 text-xl font-bold bg-slate-100 px-3.5 py-1.5 rounded-full">
                            V
                        </span>
                        <span className="absolute right-2 bottom-9 text-8xl leading-3 w-2 h-2 text-green-500">
                            .
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-bold">Bot</span>
                        <span className="text-sm">Available</span>
                    </div>
                </div>

                <div>
                    <Dropdown
                        options={ContactList}
                        value={user}
                        onChange={handleUserChange}
                        placeholder="Select User"
                        className="font-semibold bg-slate-50 border-none hover:border-green-500 w-60"
                    />
                </div>

                <div className="flex gap-2 bg-slate-50 rounded-md">
                    <span className="p-2 border-r-2">
                        <FontAwesomeIcon icon={faStar} />
                    </span>
                    <span className="p-2 pr-4">
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                    </span>
                </div>
            </div>

            <div>
                <Dropdown
                    options={ContactList}
                    value={user}
                    onChange={handleUserChange}
                    placeholder="Submit As"
                    className="font-semibold bg-slate-50 border-none hover:border-green-500"
                />
            </div>
        </div>
    );
};

export default ChatNavbar;
