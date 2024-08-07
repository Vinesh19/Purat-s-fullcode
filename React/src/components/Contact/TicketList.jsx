import { useState } from "react";
import Modal from "../../components/Modal";
import ChatDetailModal from "./ChatDetailModal";
import { fetchCrmSpecificChat } from "../../services/api";

const statusMapping = {
    5: "new",
    6: "qualified",
    7: "proposition",
    8: "won",
};

const TicketList = ({ tickets, user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chatDetails, setChatDetails] = useState(null);

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

    const handleCheckboxClick = (event) => {
        event.stopPropagation();
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
                            <input type="checkbox" />
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
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTickets.map((ticket, index) => (
                        <tr
                            key={index}
                            onClick={() =>
                                handleTicketClick(ticket.receiver_id)
                            }
                            className="cursor-pointer hover:bg-gray-100"
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    onClick={handleCheckboxClick}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {ticket.replySourceMessage}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {ticket.receiver_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {ticket.agent}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(
                                    ticket.created_at
                                ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                <ChatDetailModal data={chatDetails} />
            </Modal>
        </div>
    );
};

export default TicketList;
