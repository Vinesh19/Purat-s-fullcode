import { useState } from "react";
import { useLocation } from "react-router-dom";
import ReactFlow, { Background, MiniMap, Controls } from "reactflow";
import "reactflow/dist/style.css"; // Import the default styles for React Flow

const CreateChatbot = () => {
    const location = useLocation();
    const chatbotName = location.state?.chatbotName || "Unnamed Chatbot";

    const [nodes, setNodes] = useState([
        {
            id: "1",
            type: "input",
            data: { label: `${chatbotName} - Start Node` },
            position: { x: 250, y: 5 },
        },
    ]);

    const [edges, setEdges] = useState([]);
    const [id, setId] = useState(2); // Start IDs from 2 since 1 is taken

    const onAddNode = (type) => {
        const newNode = {
            id: `${id}`,
            type: type,
            data: { label: `${type} Node` },
            position: {
                x: Math.random() * 250 + 100,
                y: Math.random() * 250 + 100,
            },
        };
        setId(id + 1);
        setNodes((nds) => [...nds, newNode]);
    };

    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
            <aside
                style={{
                    width: "200px",
                    padding: "10px",
                    borderRight: "1px solid #ccc",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <h3>Node Types</h3>
                <button onClick={() => onAddNode("sendMessage")}>
                    Send Message
                </button>
                <button onClick={() => onAddNode("question")}>Question</button>
                <button onClick={() => onAddNode("setCondition")}>
                    Set Condition
                </button>
            </aside>

            <div style={{ flex: 1, height: "100%", position: "relative" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onEdgesChange={setEdges}
                    style={{ width: "100%", height: "100%" }} // Full width and height
                >
                    <Background variant="lines" gap={16} />
                    <MiniMap />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
};

export default CreateChatbot;
