import { useState } from "react";
import { toast } from "react-toastify";
import { TextField, Button, Grid, Typography, Box } from "@mui/material";

import Modal from "../Modal";
import DeleteConfirmation from "../Crm/DeleteModal"; // The confirmation modal
import { handleContactOperations } from "../../services/api";

const ContactDetailsModal = ({ contact, closeModal, refreshContacts }) => {
  // State to hold the edited contact fields
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state
  const [editedContact, setEditedContact] = useState({
    ...contact,
    company_name: contact.company_name !== "N/A" ? contact.company_name : "",
    contact_mobile_number:
      contact.contact_mobile_number !== "N/A"
        ? contact.contact_mobile_number
        : "",
    contact_name: contact.contact_name !== "N/A" ? contact.contact_name : "",
    Contact_email_address:
      contact.Contact_email_address !== "N/A"
        ? contact.Contact_email_address
        : "",
    birthDate: contact.birthDate !== "N/A" ? contact.birthDate : "",
    tags:
      Array.isArray(contact.tags) || contact.tags === "N/A"
        ? []
        : contact.tags.split(",").map((tag) => tag.trim()),
    source: contact.source !== "N/A" ? contact.source : "",
    agent: contact.agent !== "N/A" ? contact.agent : "",
    address: contact.address !== "N/A" ? contact.address : "",
  });

  // Update contact details locally
  const handleChange = (e) => {
    setEditedContact({
      ...editedContact,
      [e.target.name]: e.target.value,
    });
  };

  // Update contact API
  const handleUpdateContact = async () => {
    try {
      await handleContactOperations({
        action: "update",
        contact_id: editedContact.id,
        ...editedContact,
      });
      toast.success("Contact updated successfully");
      refreshContacts();
      closeModal(); // Close modal after successful update
    } catch (error) {
      toast.error("Error updating contact");
    }
  };

  // Trigger delete confirmation modal
  const handleOpenDeleteConfirmation = () => {
    setIsDeleteModalOpen(true);
  };

  // Delete contact API (actual deletion logic after confirmation)
  const handleDeleteContact = async () => {
    try {
      await handleContactOperations({
        action: "delete",
        contact_id: contact.id,
      });
      toast.success("Contact deleted successfully");
      refreshContacts();
      closeModal(); // Close modal after successful delete
    } catch (error) {
      toast.error("Error deleting contact");
    } finally {
      setIsDeleteModalOpen(false); // Close the delete confirmation modal
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Fixed Header */}
      <Typography
        variant="h6"
        sx={{
          borderBottom: "1px solid #ccc",
          paddingBottom: 2,
        }}
      >
        Edit Contact Details
      </Typography>

      {/* Scrollable Content */}
      <Box
        sx={{
          overflowY: "auto",
          flexGrow: 1,
          paddingTop: 2,
        }}
        className="scrollbar-hide"
      >
        {/* Form Fields for Contact Information */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Name"
              name="company_name"
              value={editedContact.company_name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Mobile Number"
              name="contact_mobile_number"
              value={editedContact.contact_mobile_number}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Person"
              name="contact_name"
              value={editedContact.contact_name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="Contact_email_address"
              value={editedContact.Contact_email_address}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Birth Date"
              name="birthDate"
              value={editedContact.birthDate}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }} // Ensure the label stays when the date is selected
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Tags"
              name="tags"
              value={editedContact.tags ? editedContact.tags.join(", ") : ""}
              onChange={(e) => {
                const tagsArray = e.target.value
                  .split(",")
                  .map((tag) => tag.trim());
                setEditedContact({ ...editedContact, tags: tagsArray });
              }}
              fullWidth
              variant="outlined"
              placeholder="Comma-separated tags"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Source"
              name="source"
              value={editedContact.source}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Agent"
              name="agent"
              value={editedContact.agent}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={editedContact.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Buttons - Align left and right */}
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        className="!mt-2"
      >
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenDeleteConfirmation} // Open the confirmation modal
          >
            Delete
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateContact}
          >
            Update
          </Button>
        </Grid>
      </Grid>

      {/* Delete Confirmation Modal */}
      <Modal
        isModalOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        width="30vw"
        height="40vh"
        className="rounded-lg"
      >
        <DeleteConfirmation
          itemType="contact"
          onConfirm={handleDeleteContact} // Call actual delete function on confirmation
          onCancel={() => setIsDeleteModalOpen(false)} // Close modal on cancel
        />
      </Modal>
    </Box>
  );
};

export default ContactDetailsModal;
