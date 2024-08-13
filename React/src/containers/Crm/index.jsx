import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import Tooltip from "@mui/material/Tooltip";

import Board from "../../components/Crm/Board";
import TicketList from "../../components/Crm/TicketList";
import Modal from "../../components/Modal";
import AddUser from "../../components/Crm/AddUserModal";

import { fetchCrmChats } from "../../services/api";

const Crm = ({ user }) => {
    const [searchValue, setSearchValue] = useState("");
    const [isKanbanView, setIsKanbanView] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTickets, setSelectedTickets] = useState([]);

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

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className=" flex-auto">
            <div className="mt-4 flex justify-evenly items-center">
                <div>
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        InputProps={{
                            startAdornment: <SearchIcon />,
                        }}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onInput={handleSearch}
                    />
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

                    <Tooltip title="Filter">
                        <FilterListIcon
                            className={`text-slate-400 cursor-pointer`}
                        />
                    </Tooltip>
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    disabled={selectedTickets.length === 0}
                >
                    Send Message
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleModal}
                >
                    Add User
                </Button>
            </div>

            {isKanbanView ? (
                <DndProvider backend={HTML5Backend}>
                    <Board user={user} data={filteredTickets} />
                </DndProvider>
            ) : (
                <TicketList
                    tickets={filteredTickets}
                    user={user}
                    setSelectedTickets={setSelectedTickets}
                />
            )}

            {isModalOpen && (
                <Modal
                    isModalOpen={isModalOpen}
                    closeModal={handleModal}
                    height="70vh"
                    width="50vw"
                >
                    <AddUser user={user} />
                </Modal>
            )}
        </div>
    );
};

export default Crm;
