import { useState, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, TextField, Tooltip } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    const [dateRange, setDateRange] = useState([null, null]);

    const fetchData = async () => {
        const response = await fetchCrmChats({ username: user });
        setTickets(response?.data?.data);
        setFilteredTickets(response?.data?.data);
    };

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
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

    const handleDateRangeChange = (update) => {
        setDateRange(update);
    };

    const filteredAndSortedTickets = useMemo(() => {
        let filtered = [...tickets];

        if (searchValue) {
            filtered = filtered.filter(
                (ticket) =>
                    ticket.replySourceMessage
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                    ticket.receiver_id
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                    ticket.agent
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
            );
        }

        if (dateRange[0] && dateRange[1]) {
            filtered = filtered.filter((ticket) => {
                const ticketDate = new Date(ticket.created_at);
                return ticketDate >= dateRange[0] && ticketDate <= dateRange[1];
            });
        }

        return filtered;
    }, [tickets, searchValue, dateRange]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setFilteredTickets(filteredAndSortedTickets);
    }, [filteredAndSortedTickets]);

    return (
        <div className="flex-auto overflow-auto max-h-[92vh] scrollbar-hide">
            <div className="mt-4 flex justify-between px-4 items-center">
                <div className="flex gap-4">
                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        size="small"
                        InputProps={{
                            startAdornment: <SearchIcon />,
                        }}
                        value={searchValue}
                        onChange={handleSearch}
                    />

                    <DatePicker
                        selectsRange
                        startDate={dateRange[0]}
                        endDate={dateRange[1]}
                        onChange={handleDateRangeChange}
                        isClearable
                        customInput={
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Filter by Date"
                            />
                        }
                        placeholderText="Filter by Date"
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
                    selectedTickets={selectedTickets}
                    setSelectedTickets={setSelectedTickets}
                />
            )}

            {isAddUserModalOpen && (
                <Modal
                    isModalOpen={isAddUserModalOpen}
                    closeModal={toggleAddUserModal}
                    height="70vh"
                    width="50vw"
                >
                    <AddUser
                        user={user}
                        closeModal={toggleAddUserModal}
                        fetchData={fetchData}
                    />
                </Modal>
            )}

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
