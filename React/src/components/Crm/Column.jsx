import { useDrop } from "react-dnd";
import Ticket from "./Ticket";
import { ItemTypes } from "../../services/constant";

const Column = ({ column, tickets, moveTicket, onClick, user, onDelete }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.TICKET,
        hover: (item, monitor) => {
            if (!monitor.isOver({ shallow: true })) return;
            if (item.columnId === column.id) return;

            moveTicket(
                item.id,
                item.columnId,
                column.id,
                column.ticketIds.length
            );
            item.columnId = column.id;
        },
    });

    return (
        <div
            className="flex flex-col w-full p-2 bg-slate-50 rounded shadow"
            ref={drop}
        >
            <h3 className="text-xl font-semibold p-2 text-center">
                {column.title}
            </h3>
            <div className="space-y-3 overflow-auto scrollbar-hide">
                {tickets.map((ticket, index) => (
                    <Ticket
                        key={ticket.id}
                        ticket={ticket}
                        index={index}
                        columnId={column.id}
                        moveTicket={moveTicket}
                        onClick={onClick}
                        user={user}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default Column;
