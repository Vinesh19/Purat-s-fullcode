import { useState } from "react";
import Modal from "../Modal";
import ChatDetailModal from "./ChatDetailModal";
import { fetchCrmSpecificChat } from "../../services/api";

const statusMapping = {
    5: "new",
    6: "qualified",
    7: "proposition",
    8: "won",
};

const TicketList = ({ tickets, user, setSelectedTickets }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chatDetails, setChatDetails] = useState(null);
    const [localSelectedTickets, setLocalSelectedTickets] = useState([]);

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

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allTicketIds = filteredTickets.map(
                (ticket) => ticket.receiver_id
            );
            setLocalSelectedTickets(allTicketIds);
            setSelectedTickets(allTicketIds);
        } else {
            setLocalSelectedTickets([]);
            setSelectedTickets([]);
        }
    };

    const handleCheckboxChange = (e, receiver_id) => {
        e.stopPropagation(); // Prevent row click when checkbox is clicked

        setLocalSelectedTickets((prevSelectedTickets) => {
            const updatedSelectedTickets = prevSelectedTickets.includes(
                receiver_id
            )
                ? prevSelectedTickets.filter((id) => id !== receiver_id)
                : [...prevSelectedTickets, receiver_id];

            setSelectedTickets(updatedSelectedTickets); // Update parent state
            return updatedSelectedTickets;
        });
    };

    const filteredTickets = tickets.filter((ticket) =>
        [5, 6, 7, 8].includes(ticket.chat_room?.status)
    );

    return (
        <div className="flex flex-col w-full p-4">
            <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                    localSelectedTickets.length ===
                                    filteredTickets.length
                                }
                            />
                        </th>
                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                            Number
                        </th>
                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                            Agent
                        </th>
                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                            Time
                        </th>
                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTickets.map((ticket, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            e,
                                            ticket.receiver_id
                                        )
                                    }
                                    checked={localSelectedTickets.includes(
                                        ticket.receiver_id
                                    )}
                                />
                            </td>
                            <td
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() =>
                                    handleTicketClick(ticket.receiver_id)
                                }
                            >
                                {ticket.replySourceMessage}
                            </td>
                            <td
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() =>
                                    handleTicketClick(ticket.receiver_id)
                                }
                            >
                                {ticket.receiver_id}
                            </td>
                            <td
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() =>
                                    handleTicketClick(ticket.receiver_id)
                                }
                            >
                                {ticket.agent}
                            </td>
                            <td
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() =>
                                    handleTicketClick(ticket.receiver_id)
                                }
                            >
                                {new Date(ticket.created_at).toLocaleDateString(
                                    "en-GB"
                                )}
                            </td>
                            <td
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() =>
                                    handleTicketClick(ticket.receiver_id)
                                }
                            >
                                {new Date(ticket.created_at).toLocaleTimeString(
                                    "en-GB",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </td>
                            <td
                                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                                onClick={() =>
                                    handleTicketClick(ticket.receiver_id)
                                }
                            >
                                {statusMapping[ticket.chat_room.status]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                height="70vh"
                width="50vw"
            >
                <ChatDetailModal data={chatDetails} user={user} />
            </Modal>
        </div>
    );
};

export default TicketList;
