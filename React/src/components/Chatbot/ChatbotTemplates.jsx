import { useState, useEffect } from "react";
import {
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    Grid,
    Container,
    Box,
} from "@mui/material";
import {
    Add as AddIcon,
    LibraryBooks as LibraryBooksIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

import Modal from "../Modal";
import CreateChatbotModal from "./CreateChatbotModal";

const useStyles = makeStyles((theme) => ({
    content: {
        paddingTop: theme.spacing(2),
    },

    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.3s",
        "&:hover": {
            boxShadow: theme.shadows[10],
        },
    },
    cardMedia: {
        paddingTop: "50%", // 16:9 aspect ratio
    },
    cardContent: {
        flexGrow: 1,
    },

    header: {
        backgroundColor: "white",
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        borderRadius: theme.shape.borderRadius,
    },
    headerContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        color: theme.palette.primary.main,
        fontWeight: 600,
    },
}));

const ChatbotTemplates = () => {
    const classes = useStyles();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalClick = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const Header = () => (
        <Box className={classes.header}>
            <Container>
                <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
                    Chatbot Builder
                </h1>
            </Container>
        </Box>
    );

    return (
        <>
            <Container className={classes.root}>
                <Header />
                <Box className={classes.content}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{
                            opacity: isLoaded ? 1 : 0,
                            y: isLoaded ? 0 : -20,
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography
                            variant="h5"
                            align="center"
                            color="textSecondary"
                        >
                            Choose how to create a Chatbot
                        </Typography>
                    </motion.div>
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isLoaded ? 1 : 0,
                                    y: isLoaded ? 0 : 20,
                                }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="/assets/images/png/Create_New_Template.png"
                                        title="Blank Template"
                                    />
                                    <CardContent
                                        className={classes.cardContent}
                                    >
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                        >
                                            Start From Scratch
                                        </Typography>
                                        <Typography>
                                            Create your chatbot from scratch.
                                            Submit for review when finished.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            fullWidth
                                            onClick={handleModalClick}
                                        >
                                            Create new chatbot
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isLoaded ? 1 : 0,
                                    y: isLoaded ? 0 : 20,
                                }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="https://via.placeholder.com/300x200.png?text=Template+Library"
                                        title="Browse Template"
                                    />
                                    <CardContent
                                        className={classes.cardContent}
                                    >
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                        >
                                            Browse chatbot library
                                        </Typography>
                                        <Typography>
                                            Use pre-built chatbots or customize
                                            to your needs.
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<LibraryBooksIcon />}
                                            fullWidth
                                        >
                                            Browse chatbots
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            {isModalOpen && (
                <Modal
                    isModalOpen={isModalOpen}
                    closeModal={handleModalClick}
                    width="40vw"
                    height="50vh"
                    className=" rounded-lg"
                >
                    <CreateChatbotModal />
                </Modal>
            )}
        </>
    );
};

export default ChatbotTemplates;
