import { useState } from "react";
import { TextField, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateChatbotModal = () => {
    const [chatbotName, setChatbotName] = useState("");
    const navigate = useNavigate();

    const handleOpen = () => {
        if (chatbotName.trim()) {
            navigate("/dashboard/whatsapp/createChatbot", {
                state: { chatbotName },
            });
        } else {
            alert("Please enter a chatbot name.");
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100%" // Full height of the container
            justifyContent="space-between" // Space between content and button
        >
            <Box>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    pb={2}
                    borderBottom={1}
                >
                    Add New Chatbot
                </Typography>

                <Typography variant="body1" fontWeight="bold" my={2}>
                    Chatbot Name
                </Typography>

                <TextField
                    variant="outlined"
                    placeholder="Enter chatbot name"
                    fullWidth
                    value={chatbotName}
                    onChange={(e) => setChatbotName(e.target.value)}
                    InputProps={{
                        sx: {
                            backgroundColor: "#F8FAFC",
                            borderRadius: 1,
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent",
                            },
                        },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                                borderColor: "transparent",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "transparent",
                            },
                        },
                    }}
                />
            </Box>

            {/* Add Button aligned to the bottom-right */}
            <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                    disabled={!chatbotName.trim()}
                >
                    Add
                </Button>
            </Box>
        </Box>
    );
};

export default CreateChatbotModal;
