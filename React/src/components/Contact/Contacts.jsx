// import { useState, useMemo, useEffect } from "react";
// import {
//     Button,
//     IconButton,
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableRow,
//     Paper,
//     TableContainer,
//     TextField,
//     Typography,
//     TablePagination,
//     Grid,
//     TableSortLabel,
//     MenuItem,
//     Select,
//     FormControl,
//     InputLabel,
// } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
// import {
//     Add as AddIcon,
//     Visibility as VisibilityIcon,
//     Search as SearchIcon,
// } from "@material-ui/icons";

// const useStyles = makeStyles((theme) => ({
//     root: {
//         padding: theme.spacing(3),
//         backgroundColor: "white",
//         minHeight: "100vh",
//         fontFamily: "Inter, sans-serif",
//     },
//     header: {
//         marginBottom: theme.spacing(4),
//     },
//     title: {
//         color: theme.palette.primary.main,
//         fontWeight: 600,
//     },
//     controls: {
//         marginBottom: theme.spacing(3),
//     },
//     searchField: {
//         width: "100%",
//         [theme.breakpoints.up("sm")]: {
//             width: "auto",
//         },
//     },
//     tableContainer: {
//         marginTop: theme.spacing(3),
//         overflowX: "auto",
//     },
//     table: {
//         minWidth: 650,
//     },
//     tableHead: {
//         backgroundColor: theme.palette.primary.main,
//     },
//     tableHeadCell: {
//         color: theme.palette.common.white,
//         fontWeight: 600,
//     },
//     tableRow: {
//         "&:nth-of-type(odd)": {
//             backgroundColor: theme.palette.action.hover,
//         },
//     },
// }));

// const Contacts = ({ user }) => {
//     const classes = useStyles();
//     const [showCreateTemplate, setShowCreateTemplate] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [category, setCategory] = useState("");
//     const [language, setLanguage] = useState("");
//     const [dateRange, setDateRange] = useState([null, null]);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [orderBy, setOrderBy] = useState("updated_at");
//     const [order, setOrder] = useState("desc");

//     // Convert status codes to text
//     const getStatusText = (status) => {
//         switch (status) {
//             case 0:
//                 return "Pending";
//             case 1:
//                 return "Approved";
//             case 2:
//                 return "Rejected";
//             case 3:
//                 return "Pending";
//             default:
//                 return "";
//         }
//     };

//     // Convert category codes to text
//     const getCategoryText = (category) => {
//         switch (category) {
//             case 1:
//                 return "Marketing";
//             case 2:
//                 return "Utility";
//             case 3:
//                 return "Authentication";
//             default:
//                 return "";
//         }
//     };

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const handleRequestSort = (property) => {
//         const isAsc = orderBy === property && order === "asc";
//         setOrder(isAsc ? "desc" : "asc");
//         setOrderBy(property);
//     };

//     const handleCreateTemplate = () => {
//         setShowCreateTemplate(true);
//     };

//     return (
//         <>
//             <Grid container spacing={3} className={classes.header}>
//                 <Grid item xs={12} sm={6}>
//                     <Typography variant="h4" className={classes.title}>
//                         Manage Templates
//                     </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6} container justifyContent="flex-end">
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<AddIcon />}
//                         onClick={handleCreateTemplate}
//                     >
//                         Create Template
//                     </Button>
//                 </Grid>
//             </Grid>

//             <Grid container spacing={2} className={classes.controls}>
//                 <Grid item xs={12} sm={3}>
//                     <TextField
//                         className={classes.searchField}
//                         variant="outlined"
//                         size="small"
//                         placeholder="Search templates"
//                         InputProps={{
//                             startAdornment: <SearchIcon />,
//                         }}
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         fullWidth
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={3}>
//                     <FormControl variant="outlined" fullWidth size="small">
//                         <InputLabel>Category</InputLabel>
//                         <Select
//                             value={category}
//                             onChange={(e) => setCategory(e.target.value)}
//                             label="Category"
//                         >
//                             <MenuItem value="">All</MenuItem>
//                             {categories.map((cat) => (
//                                 <MenuItem
//                                     key={cat}
//                                     value={getCategoryText(cat)}
//                                 >
//                                     {getCategoryText(cat)}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={3}>
//                     <FormControl variant="outlined" fullWidth size="small">
//                         <InputLabel>Language</InputLabel>
//                         <Select
//                             value={language}
//                             onChange={(e) => setLanguage(e.target.value)}
//                             label="Language"
//                         >
//                             <MenuItem value="">All</MenuItem>
//                             {languages.map((lang) => (
//                                 <MenuItem key={lang} value={lang}>
//                                     {lang}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sm={3}>
//                     <DatePicker
//                         selectsRange
//                         startDate={dateRange[0]}
//                         endDate={dateRange[1]}
//                         onChange={(update) => setDateRange(update)}
//                         isClearable
//                         customInput={
//                             <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 fullWidth
//                             />
//                         }
//                         placeholderText="Select date range"
//                     />
//                 </Grid>
//             </Grid>

//             <TableContainer
//                 component={Paper}
//                 className={classes.tableContainer}
//             >
//                 <Table className={classes.table}>
//                     <TableHead className={classes.tableHead}>
//                         <TableRow>
//                             {[
//                                 "ID",
//                                 "Template Name",
//                                 "Category",
//                                 "Status",
//                                 "Reason",
//                                 "Language",
//                                 "Last Updated",
//                                 "Actions",
//                             ].map((headCell) => (
//                                 <TableCell
//                                     key={headCell}
//                                     className={classes.tableHeadCell}
//                                     sortDirection={
//                                         orderBy === headCell.toLowerCase()
//                                             ? order
//                                             : false
//                                     }
//                                 >
//                                     <TableSortLabel
//                                         active={
//                                             orderBy === headCell.toLowerCase()
//                                         }
//                                         direction={
//                                             orderBy === headCell.toLowerCase()
//                                                 ? order
//                                                 : "asc"
//                                         }
//                                         onClick={() =>
//                                             handleRequestSort(
//                                                 headCell.toLowerCase()
//                                             )
//                                         }
//                                     >
//                                         {headCell}
//                                     </TableSortLabel>
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         <AnimatePresence>
//                             {(rowsPerPage > 0
//                                 ? filteredAndSortedTemplates.slice(
//                                       page * rowsPerPage,
//                                       page * rowsPerPage + rowsPerPage
//                                   )
//                                 : filteredAndSortedTemplates
//                             ).map((template) => (
//                                 <motion.tr
//                                     key={template.id}
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     exit={{ opacity: 0 }}
//                                     transition={{ duration: 0.3 }}
//                                     className={classes.tableRow}
//                                 >
//                                     <TableCell>{template.id}</TableCell>
//                                     <TableCell>
//                                         {template.template_name}
//                                     </TableCell>
//                                     <TableCell>
//                                         {getCategoryText(template.category)}
//                                     </TableCell>{" "}
//                                     {/* Convert category code to text */}
//                                     <TableCell>
//                                         {getStatusText(template.status)}
//                                     </TableCell>{" "}
//                                     {/* Convert status code to text */}
//                                     <TableCell>{template.reason}</TableCell>
//                                     <TableCell>
//                                         {template.language.language}
//                                     </TableCell>
//                                     <TableCell>
//                                         {new Date(
//                                             template.updated_at
//                                         ).toLocaleDateString()}
//                                     </TableCell>
//                                     <TableCell>
//                                         <IconButton aria-label="View template">
//                                             <VisibilityIcon />
//                                         </IconButton>
//                                         {/* Add more actions as needed */}
//                                     </TableCell>
//                                 </motion.tr>
//                             ))}
//                         </AnimatePresence>
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {filteredAndSortedTemplates.length > 0 && (
//                 <TablePagination
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={filteredAndSortedTemplates.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//             )}
//         </>
//     );
// };

// export default Contacts;
