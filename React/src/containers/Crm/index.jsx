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
import ChooseChannel from "../../components/Crm/ChannelsModal";

import { fetchCrmChats } from "../../services/api";

const Crm = ({ user }) => {
    const [searchValue, setSearchValue] = useState("");
    const [isKanbanView, setIsKanbanView] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isChooseChannelModalOpen, setIsChooseChannelModalOpen] =
        useState(false);
    const [selectedTickets, setSelectedTickets] = useState([]);

    const fetchData = async () => {
        const response = await fetchCrmChats({ username: user });
        setTickets(response?.data?.data);
        setFilteredTickets(response?.data?.data);
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
                    .includes(e.target.value.toLowerCase()) ||
                ticket.agent
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
        );
        setFilteredTickets(filtered);
    };

    const handleViewChange = (view) => {
        setIsKanbanView(view);
    };

    const toggleAddUserModal = () => {
        setIsAddUserModalOpen(!isAddUserModalOpen);
    };

    const openChooseChannelModal = () => {
        setIsChooseChannelModalOpen(true);
    };

    const closeChooseChannelModal = () => {
        setIsChooseChannelModalOpen(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex-auto overflow-auto max-h-[92vh] scrollbar-hide">
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
                            className={`cursor-pointer ${
                                isKanbanView
                                    ? "text-slate-500"
                                    : "text-slate-400"
                            }`}
                            onClick={() => handleViewChange(true)}
                        />
                    </Tooltip>

                    <Tooltip title="List View">
                        <ListAltOutlinedIcon
                            className={`cursor-pointer ${
                                !isKanbanView
                                    ? "text-slate-500"
                                    : "text-slate-400"
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
                    onClick={openChooseChannelModal}
                >
                    Send Message
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={toggleAddUserModal}
                >
                    Add User
                </Button>
            </div>

            {isKanbanView ? (
                <DndProvider backend={HTML5Backend}>
                    <Board
                        user={user}
                        data={filteredTickets}
                        setTickets={setTickets}
                        setFilteredTickets={setFilteredTickets}
                    />
                </DndProvider>
            ) : (
                <TicketList
                    tickets={filteredTickets}
                    user={user}
                    setSelectedTickets={setSelectedTickets}
                    setTickets={setTickets}
                    setFilteredTickets={setFilteredTickets}
                />
            )}

            {/* AddUser Modal */}
            {isAddUserModalOpen && (
                <Modal
                    isModalOpen={isAddUserModalOpen}
                    closeModal={toggleAddUserModal}
                    height="70vh"
                    width="50vw"
                >
                    <AddUser user={user} closeModal={toggleAddUserModal} />
                </Modal>
            )}

            {/* ChooseChannel Modal */}
            {isChooseChannelModalOpen && (
                <Modal
                    isModalOpen={isChooseChannelModalOpen}
                    closeModal={closeChooseChannelModal}
                    height="60vh"
                    width="50vw"
                    className="rounded-lg"
                >
                    <ChooseChannel user={user} />
                </Modal>
            )}
        </div>
    );
};

export default Crm;
