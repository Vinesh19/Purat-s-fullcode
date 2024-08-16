import { useDrag } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ItemTypes } from "../../services/constant";

const Ticket = ({ ticket, index, columnId, onClick, user, onDelete }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.TICKET,
        item: { id: ticket.id, index, columnId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const getAgentInitial = (agent) => {
        if (!agent) return "";
        return agent.charAt(0).toUpperCase();
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(ticket.id); 
    };

    return (
        <div
            ref={drag}
            className={`p-2 bg-white rounded shadow border ${
                isDragging ? "opacity-50" : "opacity-100"
            } hover:border-blue-300`}
            onClick={() => onClick(ticket.number)}
        >
            <div>
                <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{ticket?.name}</h3>

                    <FontAwesomeIcon
                        icon={faTrashCan}
                        className="text-red-600 p-2 rounded-lg cursor-pointer"
                        onClick={handleDeleteClick} // Call the new function here
                    />
                </div>

                <p>{ticket?.number}</p>
                <div className="flex justify-between items-center">
                    <p>{ticket?.date}</p>
                    {ticket?.agent && (
                        <div
                            className="flex items-center justify-center font-bold bg-lime-100 border hover:border-lime-300 text-gray-600 rounded-full w-8 h-8 cursor-pointer"
                            title={ticket?.agent}
                        >
                            {getAgentInitial(ticket?.agent)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ticket;
