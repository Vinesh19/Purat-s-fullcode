import { useState } from "react";
import { useLocation } from "react-router-dom";
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";

import Modal from "../../components/Modal";
import QuestionModal from "../../components/Chatbot/Modals/QuestionModal";
import ButtonsModal from "../../components/Chatbot/Modals/ButtonModal";
import ListModal from "../../components/Chatbot/Modals/ListModal";

import MessageNode from "../../components/Chatbot/CustomNodes/MessageNode";
import QuestionNode from "../../components/Chatbot/CustomNodes/QuestionNode";
import ButtonsNode from "../../components/Chatbot/CustomNodes/ButtonsNode";
import ListNode from "../../components/Chatbot/CustomNodes/ListNode";

import { Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import "reactflow/dist/style.css";

const nodeTypes = {
  sendMessage: MessageNode,
  question: QuestionNode,
  buttons: ButtonsNode,
  list: ListNode,
};

const CreateChatbot = () => {
  const location = useLocation();
  const chatbotName = location.state?.chatbotName || "Unnamed Chatbot";

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [id, setId] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const [showOptions, setShowOptions] = useState(false);

  const onAddNode = (type) => {
    const newNode = {
      id: `${id}`,
      type: type,
      data: {},
      position: {
        x: Math.random() * 250 + 100,
        y: Math.random() * 250 + 100,
      },
    };
    setId(id + 1);
    setNodes((nds) => [...nds, newNode]);
  };

  const openModal = (node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNode(null);
  };

  const onNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const handleSaveNode = (updatedNode) => {
    setNodes((nodes) =>
      nodes.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
  };

  // Handle node double-click event
  const handleNodeDoubleClick = (_, node) => {
    if (
      node.type === "question" ||
      node.type === "buttons" ||
      node.type === "list"
    ) {
      openModal(node);
    }
  };

  // Copy the selected node
  const handleCopyNode = (node) => {
    const newNode = {
      ...node,
      id: `${id}`, // Assign new ID
      position: {
        ...node.position,
        x: node.position.x + 50, // Slightly offset position to avoid overlap
        y: node.position.y + 50,
      },
    };
    setId(id + 1);
    setNodes((nds) => [...nds, newNode]);
  };

  // Delete the selected node
  const handleDeleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  };

  return (
    <div className="flex w-full">
      <aside className="w-48 p-4 border-r border-gray-300 flex flex-col">
        <h3 className="mb-4 font-bold text-lg text-center">Node Types</h3>

        {!showOptions ? (
          <>
            <button
              onClick={() => onAddNode("sendMessage")}
              className="mb-2 p-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition"
            >
              Send Message
            </button>
            <button
              onClick={() => setShowOptions(true)}
              className="p-2 bg-orange-400 text-white rounded hover:bg-orange-500 transition"
            >
              Ask a Question
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowOptions(false)}
              className="my-4 rounded flex items-center justify-center gap-1"
            >
              <ArrowBackIcon /> Back
            </button>

            <button
              onClick={() => {
                onAddNode("question");
                setShowOptions(false);
              }}
              className="mb-2 p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
            >
              Question
            </button>
            <button
              onClick={() => {
                onAddNode("buttons");
                setShowOptions(false);
              }}
              className="mb-2 p-2 bg-green-400 text-white rounded hover:bg-green-500 transition"
            >
              Buttons
            </button>
            <button
              onClick={() => {
                onAddNode("list");
                setShowOptions(false);
              }}
              className="p-2 bg-purple-400 text-white rounded hover:bg-purple-500 transition"
            >
              List
            </button>
          </>
        )}
      </aside>

      <div className="flex-1 relative">
        <Typography variant="h5" align="center" className="p-1">
          {chatbotName}
        </Typography>

        <div className="relative h-[calc(100vh-100px)] w-full">
          <ReactFlow
            nodes={nodes.map((node) => {
              if (
                node.type === "question" ||
                node.type === "buttons" ||
                node.type === "list"
              ) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    openModal: () => openModal(node), // For edit functionality
                  },
                  onCopyNode: () => handleCopyNode(node), // For copy functionality
                  onDeleteNode: () => handleDeleteNode(node.id), // For delete functionality
                };
              }
              return node;
            })}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={handleNodeDoubleClick} // Handle node double-click here
            nodeTypes={nodeTypes}
            className="w-full h-full"
          >
            <Background variant="lines" gap={16} />

            <MiniMap
              style={{ width: 200, height: 120 }}
              nodeColor={(node) => {
                switch (node.type) {
                  case "sendMessage":
                    return "blue";
                  case "question":
                    return "yellow";
                  case "buttons":
                    return "green";
                  case "list":
                    return "purple";
                  default:
                    return "#eee";
                }
              }}
            />

            <Controls className="flex flex-row gap-2" style={{ bottom: 10 }} />
          </ReactFlow>
        </div>
      </div>

      {/* Modal for editing the selected node */}
      <Modal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        width="460px"
        className="rounded-lg"
      >
        {selectedNode?.type === "question" ? (
          <QuestionModal
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            closeModal={closeModal}
            onSave={handleSaveNode}
          />
        ) : selectedNode?.type === "buttons" ? (
          <ButtonsModal
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            closeModal={closeModal}
            onSave={handleSaveNode}
          />
        ) : selectedNode?.type === "list" ? (
          <ListModal
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            closeModal={closeModal}
            onSave={handleSaveNode}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default CreateChatbot;
