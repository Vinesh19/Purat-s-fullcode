import { useState, useEffect } from "react";
import Column from "./Column";
import Modal from "../../components/Modal";
import ChatDetailModal from "./ChatDetailModal";
import DeleteConfirmation from "./DeleteModal";
import { fetchCrmSpecificChat, updateChatStatus } from "../../services/api"; // Import the new API function

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
};

const statusMapping = {
    5: "new",
    6: "qualified",
    7: "proposition",
    8: "won",
};

const Board = ({ user, data }) => {
    const [state, setState] = useState({
        columns: {
            new: { id: "new", title: "New", ticketIds: [] },
            qualified: { id: "qualified", title: "Qualified", ticketIds: [] },
            proposition: {
                id: "proposition",
                title: "Proposition",
                ticketIds: [],
            },
            won: { id: "won", title: "Won", ticketIds: [] },
        },
        tickets: {},
        columnOrder: ["new", "qualified", "proposition", "won"],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chatDetails, setChatDetails] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    useEffect(() => {
        const tickets = {};
        const columns = {
            new: { id: "new", title: "New", ticketIds: [] },
            qualified: {
                id: "qualified",
                title: "Qualified",
                ticketIds: [],
            },
            proposition: {
                id: "proposition",
                title: "Proposition",
                ticketIds: [],
            },
            won: { id: "won", title: "Won", ticketIds: [] },
        };

        data?.forEach((chat, index) => {
            const status = chat.chat_room?.status;
            if (![5, 6, 7, 8].includes(status)) return;

            const ticketId = `ticket-${index + 1}`;
            tickets[ticketId] = {
                id: ticketId,
                name: chat?.replySourceMessage,
                number: chat?.receiver_id,
                agent: chat?.agent,
                date: formatDate(chat.created_at),
                status: statusMapping[status], // Convert status to label
            };

            const columnId = statusMapping[status];
            columns[columnId].ticketIds.push(ticketId);
        });

        setState({
            columns,
            tickets,
            columnOrder: ["new", "qualified", "proposition", "won"],
        });
    }, [data]);

    const moveTicket = async (
        ticketId,
        sourceColumnId,
        targetColumnId,
        targetIndex
    ) => {
        const sourceColumn = state.columns[sourceColumnId];
        const targetColumn = state.columns[targetColumnId];

        const sourceTicketIds = Array.from(sourceColumn.ticketIds);
        sourceTicketIds.splice(sourceTicketIds.indexOf(ticketId), 1);

        const targetTicketIds = Array.from(targetColumn.ticketIds);
        targetTicketIds.splice(targetIndex, 0, ticketId);

        const newState = {
            ...state,
            columns: {
                ...state.columns,
                [sourceColumnId]: {
                    ...sourceColumn,
                    ticketIds: sourceTicketIds,
                },
                [targetColumnId]: {
                    ...targetColumn,
                    ticketIds: targetTicketIds,
                },
            },
        };

        setState(newState);

        // Determine new status value
        const statusValue = Object.keys(statusMapping).find(
            (key) => statusMapping[key] === targetColumnId
        );

        // Call API to update status
        const payload = {
            action: "status",
            receiver_id: state.tickets[ticketId].number,
            username: user,
            value: statusValue,
        };

        try {
            await updateChatStatus(payload);
        } catch (error) {
            console.error("Failed to update status", error);
            // Optionally revert state in case of error
            setState({
                ...newState,
                columns: {
                    ...newState.columns,
                    [sourceColumnId]: {
                        ...newState.columns[sourceColumnId],
                        ticketIds: [
                            ...newState.columns[sourceColumnId].ticketIds,
                            ticketId,
                        ],
                    },
                    [targetColumnId]: {
                        ...newState.columns[targetColumnId],
                        ticketIds: newState.columns[
                            targetColumnId
                        ].ticketIds.filter((id) => id !== ticketId),
                    },
                },
            });
        }
    };

    const handleTicketClick = async (receiver_id) => {
        const payload = { action: "read", username: user, receiver_id };
        try {
            const response = await fetchCrmSpecificChat(payload);
            setChatDetails(response?.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch chat details", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setChatDetails(null);
    };

    const handleDeleteTicket = async (ticketId) => {
        const ticket = state.tickets[ticketId];
        const payload = {
            action: "delete",
            username: user,
            receiver_id: ticket.number,
        };

        try {
            await fetchCrmSpecificChat(payload);
            // Remove the ticket from the state after successful deletion
            const { [ticketId]: _, ...remainingTickets } = state.tickets;
            const newColumns = { ...state.columns };

            Object.keys(newColumns).forEach((columnId) => {
                newColumns[columnId].ticketIds = newColumns[
                    columnId
                ].ticketIds.filter((id) => id !== ticketId);
            });

            setState({
                ...state,
                tickets: remainingTickets,
                columns: newColumns,
            });
        } catch (error) {
            console.error("Failed to delete the ticket", error);
        }
    };

    const openDeleteModal = (ticketId) => {
        setTicketToDelete(ticketId);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (ticketToDelete) {
            await handleDeleteTicket(ticketToDelete);
            setIsDeleteModalOpen(false);
            setTicketToDelete(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setTicketToDelete(null);
    };

    return (
        <>
            <div className="flex space-x-4 p-4 w-full h-[calc(100vh-120px)]">
                {state.columnOrder.map((columnId) => {
                    const column = state.columns[columnId];
                    const tickets = column.ticketIds.map(
                        (ticketId) => state.tickets[ticketId]
                    );

                    return (
                        <Column
                            key={column.id}
                            column={column}
                            tickets={tickets}
                            moveTicket={moveTicket}
                            onClick={handleTicketClick}
                            user={user}
                            onDelete={openDeleteModal}
                        />
                    );
                })}
            </div>

            {isModalOpen && (
                <Modal
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    height="70vh"
                    width="50vw"
                >
                    <ChatDetailModal data={chatDetails} user={user} />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal
                    isModalOpen={isDeleteModalOpen}
                    closeModal={cancelDelete}
                    height="40vh"
                    width="30vw"
                    className="rounded-lg"
                >
                    <DeleteConfirmation
                        onConfirm={confirmDelete}
                        onCancel={cancelDelete}
                        itemType="chat"
                    />
                </Modal>
            )}
        </>
    );
};

export default Board;
