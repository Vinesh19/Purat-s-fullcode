import { useState } from "react";
import Input from "../../Input";

const Templates = ({ templates }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTemplates = templates.filter(
        (template) =>
            template.template_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            template.template_body
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 border-b-2 pb-4">
                <h2 className="text-lg font-semibold">Select Template</h2>
                <Input
                    type="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="overflow-y-auto scrollbar-hide">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className="bg-white py-5 rounded border-b hover:bg-slate-50 cursor-pointer"
                    >
                        <h3 className="font-bold mb-1">
                            {template.template_name}
                        </h3>
                        <p>{template.template_body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Templates;
