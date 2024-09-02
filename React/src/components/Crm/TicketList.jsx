import { useState } from "react";
import Pagination from "@mui/material/Pagination";

import Modal from "../Modal";
import ChatDetailModal from "./ChatDetailModal";

import { fetchCrmSpecificChat } from "../../services/api";

const statusMapping = {
  5: "new",
  6: "qualified",
  7: "proposition",
  8: "won",
};

const TicketList = ({ tickets, user, selectedTickets, setSelectedTickets }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatDetails, setChatDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ticketsPerPage = 10;

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
      const allTicketIds = filteredTickets.map((ticket) => ticket.receiver_id);
      setSelectedTickets(allTicketIds);
    } else {
      setSelectedTickets([]);
    }
  };

  const handleCheckboxChange = (e, receiver_id) => {
    e.stopPropagation(); // Prevent row click when checkbox is clicked

    const updatedSelectedTickets = selectedTickets.includes(receiver_id)
      ? selectedTickets.filter((id) => id !== receiver_id)
      : [...selectedTickets, receiver_id];

    setSelectedTickets(updatedSelectedTickets);
  };

  const filteredTickets = tickets.filter((ticket) =>
    [5, 6, 7, 8].includes(ticket.chat_room?.status)
  );

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
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
                checked={selectedTickets.length === filteredTickets.length}
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
          {paginatedTickets.map((ticket, index) => {
            const ticketName =
              ticket?.replySourceMessage ||
              ticket?.chat_room?.name ||
              "No Name";
            const ticketNumber =
              ticket?.receiver_id || ticket?.chat_room?.receiver_id;
            const ticketAgent =
              ticket?.agent || ticket?.chat_room?.assign_to || "Unassigned";
            const ticketDate = ticket?.created_at
              ? new Date(ticket?.created_at).toLocaleDateString("en-GB")
              : new Date(ticket?.chat_room?.created_at).toLocaleDateString(
                  "en-GB"
                );
            const ticketTime = ticket?.created_at
              ? new Date(ticket?.created_at).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : new Date(ticket?.chat_room?.created_at).toLocaleTimeString(
                  "en-GB",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );
            const ticketStatus = statusMapping[ticket?.chat_room?.status];

            return (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(e, ticket?.receiver_id)
                    }
                    checked={selectedTickets.includes(ticket?.receiver_id)}
                  />
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleTicketClick(ticket?.receiver_id)}
                >
                  {ticketName}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleTicketClick(ticket?.receiver_id)}
                >
                  {ticketNumber}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleTicketClick(ticket?.receiver_id)}
                >
                  {ticketAgent}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleTicketClick(ticket?.receiver_id)}
                >
                  {ticketDate}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleTicketClick(ticket?.receiver_id)}
                >
                  {ticketTime}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => handleTicketClick(ticket?.receiver_id)}
                >
                  {ticketStatus}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        count={Math.ceil(filteredTickets.length / ticketsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        className="mt-4 self-center"
      />

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
