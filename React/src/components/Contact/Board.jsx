import { useState, useEffect } from "react";
import Column from "./Column";
import Modal from "../../components/Modal";
import ChatDetailModal from "./ChatDetailModal";
import { fetchCrmSpecificChat, updateChatStatus } from "../../services/api"; // Import the new API function

const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

        data.forEach((chat, index) => {
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
        const payload = { username: user, receiver_id };
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
                            onClick={handleTicketClick} // Pass the onClick handler
                        />
                    );
                })}
            </div>

            <Modal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                height="70vh"
                width="50vw"
            >
                <ChatDetailModal data={chatDetails} />
            </Modal>
        </>
    );
};

const determineColumn = (status) => {
    // Logic to determine the column based on status
    if (status === 5) return "new";
    if (status === 6) return "qualified";
    if (status === 7) return "proposition";
    if (status === 8) return "won";
    return "new";
};

export default Board;
