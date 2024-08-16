import Button from "../Button";

const DeleteConfirmation = ({ onConfirm, onCancel, itemType }) => {
    return (
        <div className="h-full">
            <h3 className="text-xl font-bold border-b mb-4 pb-4">Confirm</h3>
            <p className="font-semibold text-lg">
                Are you sure you want to delete this {itemType}?
            </p>

            <div className="flex gap-4 absolute bottom-4 right-4">
                <Button
                    variant="secondary"
                    className="bg-slate-50"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    className="bg-red-600 border-none px-8"
                    onClick={onConfirm}
                >
                    Yes
                </Button>
            </div>
        </div>
    );
};

export default DeleteConfirmation;
