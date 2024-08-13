import { useState } from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    TableContainer,
    TextField,
    Typography,
    Grid,
    TableSortLabel,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Search as SearchIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
        backgroundColor: "white",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "Inter, sans-serif",
    },
    header: {
        marginBottom: theme.spacing(4),
    },
    title: {
        fontWeight: 600,
    },
    controls: {
        marginBottom: theme.spacing(3),
    },
    searchField: {
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "auto",
        },
    },
    tableContainer: {
        marginTop: theme.spacing(3),
        overflowX: "auto",
    },
    table: {
        minWidth: 650,
    },
    tableHead: {
        backgroundColor: theme.palette.primary.main,
    },
    tableHeadCell: {
        color: theme.palette.common.white,
        fontWeight: 600,
    },
    tableRow: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}));

const Contacts = ({ user }) => {
    const classes = useStyles();
    const [searchTerm, setSearchTerm] = useState("");
    const [orderBy, setOrderBy] = useState("updated_at");
    const [order, setOrder] = useState("desc");

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={classes.root}
        >
            <>
                <Grid container spacing={3} className={classes.header}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h4" className={classes.title}>
                            Contacts
                        </Typography>
                    </Grid>
                </Grid>

                <Grid
                    container
                    spacing={2}
                    className={classes.controls}
                    alignItems="center"
                >
                    <Grid item>
                        <Button variant="contained" color="primary">
                            Broadcast
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button variant="contained" color="primary">
                            Send Message
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button variant="contained" color="primary">
                            Assign Tag
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            className={classes.searchField}
                            variant="outlined"
                            size="small"
                            placeholder="Search"
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            fullWidth
                        />
                    </Grid>

                    {/* Spacer to push the "Import Contacts" button to the right */}
                    <Grid item xs />

                    <Grid item>
                        <Button variant="contained" color="primary">
                            Import Contacts
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer
                    component={Paper}
                    className={classes.tableContainer}
                >
                    <Table className={classes.table}>
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                {[
                                    "Checkbox",
                                    "Company Name",
                                    "Mobile Number",
                                    "Contact Person",
                                    "Birth Date",
                                    "Whatsapp Name",
                                    "Tags",
                                    "Source",
                                    "Address",
                                ].map((headCell) => (
                                    <TableCell
                                        key={headCell}
                                        className={classes.tableHeadCell}
                                        sortDirection={
                                            orderBy === headCell.toLowerCase()
                                                ? order
                                                : false
                                        }
                                    >
                                        <TableSortLabel
                                            active={
                                                orderBy ===
                                                headCell.toLowerCase()
                                            }
                                            direction={
                                                orderBy ===
                                                headCell.toLowerCase()
                                                    ? order
                                                    : "asc"
                                            }
                                            onClick={() =>
                                                handleRequestSort(
                                                    headCell.toLowerCase()
                                                )
                                            }
                                        >
                                            {headCell}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={classes.tableRow}
                                >
                                    <TableCell>✅</TableCell>
                                    <TableCell>Purat</TableCell>
                                    <TableCell>9988776546</TableCell>
                                    <TableCell>Vinesh</TableCell>
                                    <TableCell>19/09/2000</TableCell>
                                    <TableCell>one</TableCell>
                                    <TableCell>new</TableCell>
                                    <TableCell>Indew</TableCell>
                                    <TableCell>Sapna Sangeeta</TableCell>
                                </motion.tr>
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        </motion.div>
    );
};

export default Contacts;
