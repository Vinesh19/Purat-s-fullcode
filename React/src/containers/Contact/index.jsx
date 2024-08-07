import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import Tooltip from "@mui/material/Tooltip";

import Board from "../../components/Contact/Board";
import TicketList from "../../components/Contact/TicketList";

import { fetchCrmChats } from "../../services/api";

const Contact = ({ user }) => {
    const [searchValue, setSearchValue] = useState("");
    const [isKanbanView, setIsKanbanView] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);

    const fetchData = async () => {
        const response = await fetchCrmChats({ username: user });
        setTickets(response?.data);
        setFilteredTickets(response?.data);
    };

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
        const filtered = tickets.filter(
            (ticket) =>
                ticket.replySourceMessage
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                ticket.receiver_id
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
        );
        setFilteredTickets(filtered);
    };

    const handleViewChange = (view) => {
        setIsKanbanView(view);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className=" flex-auto">
            <div className="mt-4 flex justify-evenly items-center">
                <div>
                    <TextField
                        id="search-bar"
                        className="text"
                        onInput={handleSearch}
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                    />
                    <IconButton type="submit" aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </div>

                <div className="flex gap-2">
                    <Tooltip title="Kanban View">
                        <ViewKanbanOutlinedIcon
                            className={`text-slate-400 cursor-pointer ${
                                isKanbanView ? "text-blue-500" : ""
                            }`}
                            onClick={() => handleViewChange(true)}
                        />
                    </Tooltip>
                    <Tooltip title="List View">
                        <ListAltOutlinedIcon
                            className={`text-slate-400 cursor-pointer ${
                                !isKanbanView ? "text-blue-500" : ""
                            }`}
                            onClick={() => handleViewChange(false)}
                        />
                    </Tooltip>
                </div>
            </div>

            {isKanbanView ? (
                <DndProvider backend={HTML5Backend}>
                    <Board user={user} data={filteredTickets} />
                </DndProvider>
            ) : (
                <TicketList tickets={filteredTickets} user={user} />
            )}
        </div>
    );
};

export default Contact;
