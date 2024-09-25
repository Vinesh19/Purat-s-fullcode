import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  Typography,
  Grid,
  TableSortLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Checkbox,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "react-toastify";

import Modal from "../../components/Modal";
import ImportContacts from "../../components/Contacts/ImportContacts";
import ContactDetailsModal from "../../components/Contacts/ContactDetailModal";
import ChooseChannel from "../../components/Crm/ChannelsModal";
import AssignTag from "../../components/Contacts/AssignTag";
import DeleteConfirmation from "../../components/Crm/DeleteModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import {
  handleGroupOperations,
  handleContactOperations,
  assignTagContacts,
} from "../../services/api";

// Helper function to export contacts to CSV
const exportContactsToCSV = (contacts) => {
  const headers = [
    "Company Name",
    "Mobile Number",
    "Contact Person",
    "Email",
    "Birth Date",
    "Tags",
    "Source",
    "Agent",
    "Address",
  ];

  const rows = contacts.map((contact) => {
    let parsedTags;
    try {
      // Try to parse the tags string into an array
      parsedTags = JSON.parse(contact.tags);
    } catch (e) {
      // If parsing fails, default to "N/A"
      parsedTags = "N/A";
    }

    return [
      contact.company_name || "N/A",
      contact.contact_mobile_number || "N/A",
      contact.contact_name || "N/A",
      contact.Contact_email_address || "N/A",
      contact.birthDate || "N/A",
      Array.isArray(parsedTags) ? `"${parsedTags.join(", ")}"` : "N/A", // Join tags if it's an array
      contact.source || "N/A",
      contact.agent || "N/A",
      contact.address || "N/A",
    ];
  });

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "contacts_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Header = ({ groupName }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard/whatsapp/contacts");
  };

  return (
    <Box className="py-4 bg-slate-50">
      <Container>
        <div className="flex justify-between items-center">
          <Button
            onClick={handleBackClick}
            className="flex gap-2 items-center"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </Button>

          <h1 className="text-2xl md:text-3xl font-bold text-indigo-800">
            {groupName ? `${groupName} Contacts` : "Contacts"}
          </h1>

          <div className="w-12" />
        </div>
      </Container>
    </Box>
  );
};

const ContactTable = ({ user }) => {
  const { groupId: initialGroupId, groupName: initialGroupName } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("updated_at");
  const [order, setOrder] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAssignTagModalOpen, setIsAssignTagModalOpen] = useState(false);

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(initialGroupName || "");
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId || "");
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChooseChannelModalOpen, setIsChooseChannelModalOpen] =
    useState(false);

  const fetchGroups = async () => {
    try {
      const response = await handleGroupOperations({
        action: "read",
        username: user,
      });
      const fetchedGroups =
        response?.data?.map((group) => ({
          id: group.id,
          name: group.Group_name,
        })) || [];
      setGroups(fetchedGroups);

      if (!fetchedGroups.some((group) => group.name === selectedGroup)) {
        setSelectedGroup("");
      }
    } catch (error) {
      toast.error("Error fetching groups");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async (groupId) => {
    try {
      const response = await handleContactOperations({
        action: "read",
        username: user,
        Contact_group_id: groupId,
      });
      setContacts(response?.data?.data || []);
      setFilteredContacts(response?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching contacts");
      setContacts([]);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (selectedGroupId) {
        await handleGroupOperations({
          action: "delete",
          group_id: selectedGroupId, // Use the group ID for deletion
          username: user,
        });
        toast.success("Group deleted successfully!");
        fetchGroups(); // Refresh groups after deletion
        navigate("/dashboard/whatsapp/contacts"); // Navigate to contacts page
      }
    } catch (error) {
      toast.error("Error deleting group");
    } finally {
      setIsDeleteModalOpen(false); // Close the delete confirmation modal
    }
  };

  const handleAssignTags = async (tags) => {
    try {
      const payload = {
        contact_ids: selectedContacts, // Selected contacts' IDs
        tags, // Array of tags
      };
      await assignTagContacts(payload); // Call the assignTagContacts API
      toast.success("Tags assigned successfully!");

      setSelectedContacts([]);

      handleCloseAssignTagModal(); // Close the modal after successful tagging
      fetchContacts(selectedGroupId); // Refresh contacts after assigning tags
    } catch (error) {
      toast.error("Error assigning tags.");
    }
  };

  const handleGroupChange = (event) => {
    const groupName = event.target.value;
    setSelectedGroup(groupName);
    const selectedGroupObj = groups.find((group) => group.name === groupName);
    const groupId = selectedGroupObj?.id || "";
    setSelectedGroupId(groupId);

    if (groupId) {
      setSelectedContacts([]);

      navigate(
        `/dashboard/whatsapp/contacts/${groupId}/${encodeURIComponent(
          groupName
        )}`
      );
      fetchContacts(groupId);
    }
  };

  const handleSearch = () => {
    const filtered = contacts.filter((contact) => {
      const contactName = contact.contact_name?.toLowerCase() || "";
      const contactMobile = contact.contact_mobile_number?.toLowerCase() || "";

      let contactTags = "";
      if (contact.tags) {
        try {
          // Try to parse the tags if it's a stringified array
          const parsedTags = JSON.parse(contact.tags);
          if (Array.isArray(parsedTags)) {
            contactTags = parsedTags.join(", ").toLowerCase(); // Join the array of tags into a string
          }
        } catch (error) {
          // If parsing fails, treat it as an empty string
          contactTags = contact.tags?.toLowerCase() || "";
        }
      }
      
      const searchValue = searchTerm.toLowerCase();

      return (
        contactName.includes(searchValue) ||
        contactMobile.includes(searchValue) ||
        contactTags.includes(searchValue)
      );
    });
    setFilteredContacts(filtered);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenContactModal = (contact) => {
    setSelectedContact(contact); // Set selected contact
    setIsContactModalOpen(true); // Open contact details modal
  };

  const handleCloseContactModal = () => {
    setSelectedContact(null); // Clear selected contact
    setIsContactModalOpen(false); // Close contact details modal
  };

  const handleOpenAssignTagModal = () => {
    setIsAssignTagModalOpen(true);
  };

  const handleCloseAssignTagModal = () => {
    setIsAssignTagModalOpen(false);
  };

  const openChooseChannelModal = () => {
    setIsChooseChannelModalOpen(true);
  };

  const closeChooseChannelModal = () => {
    setIsChooseChannelModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const processedContacts = filteredContacts?.map((contact) => ({
    ...contact,
    contact_name: contact.contact_name || "N/A", // Default value if null/undefined
    company_name: contact.company_name || "N/A", // Default value
    contact_mobile_number: contact.contact_mobile_number || "N/A", // Mobile number fallback
    Contact_email_address: contact.Contact_email_address || "N/A", // Email fallback
    birthDate: contact.birth_date || "N/A", // Birth date fallback
    tags: contact.tags ? JSON.parse(contact.tags).join(", ") : "N/A", // Handle tags, if present
    source: contact.source || "N/A", // Source fallback
    agent: contact.agent || "N/A",
    address: contact.address || "N/A", // Address fallback
  }));

  const paginatedContacts = processedContacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allContactIds = paginatedContacts.map((contact) => contact.id);
      setSelectedContacts(allContactIds);
    } else {
      setSelectedContacts([]);
    }
  };

  const handleCheckboxChange = (event, contactId) => {
    const isChecked = event.target.checked;
    setSelectedContacts((prevSelected) =>
      isChecked
        ? [...prevSelected, contactId]
        : prevSelected.filter((id) => id !== contactId)
    );
  };

  const isAllSelected =
    paginatedContacts.length > 0 &&
    paginatedContacts.every((contact) => selectedContacts.includes(contact.id));
  const isDeleteAllEnabled =
    selectedContacts.length === paginatedContacts.length &&
    paginatedContacts.length > 0;

  const selectedContactMobileNumbers = contacts
    .filter((contact) => selectedContacts.includes(contact.id))
    .map((contact) => contact.contact_mobile_number);

  useEffect(() => {
    fetchGroups();
    if (initialGroupId) {
      setSelectedGroupId(initialGroupId);
      setSelectedGroup(initialGroupName);
      fetchContacts(initialGroupId);
    }
  }, [initialGroupId, initialGroupName]);

  useEffect(() => {
    handleSearch(); // Run search filtering whenever searchTerm or contacts change
  }, [searchTerm, contacts]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 w-full"
    >
      <Header groupName={selectedGroup} />

      {/* First Line */}
      <Grid container spacing={2} className="py-4" alignItems="center">
        {/* Left Side */}
        <Grid item xs={12} sm={9} container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={openChooseChannelModal}
              disabled={selectedContacts.length === 0}
            >
              Send Message
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenAssignTagModal}
              disabled={selectedContacts.length === 0}
            >
              Assign Tag
            </Button>
          </Grid>

          <Grid item xs={12} sm={5}>
            <TextField
              className="w-full"
              variant="outlined"
              size="small"
              placeholder="Search"
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Right Side */}
        <Grid item xs={12} sm={3}>
          {loading ? (
            <Typography>Loading groups...</Typography>
          ) : (
            <FormControl variant="outlined" size="small" fullWidth>
              <InputLabel>Select Group</InputLabel>
              <Select
                value={selectedGroup || ""}
                onChange={handleGroupChange}
                label="Select Group"
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.name}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>
      </Grid>

      {/* Second Line */}
      <Grid container spacing={2} className="pb-4" alignItems="center">
        {/* Left Side */}
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            color="secondary"
            disabled={!isDeleteAllEnabled}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete All
          </Button>
        </Grid>

        {/* Right Side */}
        <Grid
          item
          xs={12}
          sm={9}
          container
          justifyContent="flex-end"
          spacing={2}
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
            >
              Import Contacts
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => exportContactsToCSV(contacts)}
            >
              Export Contacts
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table className="min-w-[650px]">
          <TableHead className="bg-blue-500">
            <TableRow>
              <TableCell>
                <Checkbox
                  indeterminate={selectedContacts.length > 0 && !isAllSelected}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {[
                "Company Name",
                "Mobile Number",
                "Contact Person",
                "Email",
                "Birth Date",
                "Tags",
                "Source",
                "Agent",
                "Address",
              ].map((headCell) => (
                <TableCell
                  key={headCell}
                  className="!text-white !text-base"
                  sortDirection={
                    orderBy === headCell.toLowerCase() ? order : false
                  }
                >
                  <TableSortLabel
                    active={orderBy === headCell.toLowerCase()}
                    direction={
                      orderBy === headCell.toLowerCase() ? order : "asc"
                    }
                    onClick={() => handleRequestSort(headCell.toLowerCase())}
                    className="text-white font-semibold"
                  >
                    {headCell}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            <AnimatePresence>
              {paginatedContacts.map((contact, index) => (
                <motion.tr
                  key={contact.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleOpenContactModal(contact)}
                  className="bg-slate-50 hover:bg-slate-100 cursor-pointer"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) =>
                        handleCheckboxChange(event, contact.id)
                      }
                    />
                  </TableCell>
                  <TableCell>{contact.company_name}</TableCell>
                  <TableCell>{contact.contact_mobile_number}</TableCell>
                  <TableCell>{contact.contact_name}</TableCell>
                  <TableCell>{contact.Contact_email_address}</TableCell>
                  <TableCell>{contact.birthDate}</TableCell>
                  <TableCell>{contact.tags}</TableCell>
                  <TableCell>{contact.source}</TableCell>
                  <TableCell>{contact.agent || "N/A"}</TableCell>
                  <TableCell>{contact.address}</TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={contacts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
        rowsPerPageOptions={[10, 25, 50]}
      />

      <Modal
        isModalOpen={isModalOpen}
        closeModal={handleCloseModal}
        width="50vw"
        height="70vh"
        className="rounded"
      >
        <ImportContacts
          user={user}
          closeContactModal={handleCloseModal}
          refreshGroups={fetchGroups}
        />
      </Modal>

      <Modal
        isModalOpen={isContactModalOpen}
        closeModal={handleCloseContactModal}
        width="50vw"
        height="70vh"
        className="rounded"
      >
        {selectedContact && (
          <ContactDetailsModal
            contact={selectedContact}
            closeModal={handleCloseContactModal}
            refreshContacts={() => fetchContacts(selectedGroupId)}
          />
        )}
      </Modal>

      <Modal
        isModalOpen={isChooseChannelModalOpen}
        closeModal={closeChooseChannelModal}
        height="60vh"
        width="50vw"
        className="rounded-lg"
      >
        <ChooseChannel
          user={user}
          selectedContacts={selectedContactMobileNumbers}
          setSelectedTickets={setSelectedContacts}
          closeChooseChannelModal={closeChooseChannelModal} // Pass close function
        />
      </Modal>

      <Modal
        isModalOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        width="30vw"
        height="40vh"
        className="rounded-lg"
      >
        <DeleteConfirmation
          itemType="group"
          onConfirm={handleDeleteGroup}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </Modal>

      <Modal
        isModalOpen={isAssignTagModalOpen}
        closeModal={handleCloseAssignTagModal}
        height="60vh"
        width="40vw"
        className="rounded-lg"
      >
        <AssignTag onSubmitTags={handleAssignTags} />
      </Modal>
    </motion.div>
  );
};

export default ContactTable;
