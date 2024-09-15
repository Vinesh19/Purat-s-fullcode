import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";

import Modal from "../../components/Modal"; // Assume Modal is reusable

import {
  handleGroupOperations,
  handleContactOperations,
} from "../../services/api";

const ImportContacts = ({ user, closeContactModal, refreshGroups }) => {
  const [uploadType, setUploadType] = useState("CSV File"); // Manage the type of upload (default is CSV)
  const [mobileNumbers, setMobileNumbers] = useState(""); // For mobile numbers input
  const [csvFile, setCsvFile] = useState(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false); // State for the Group modal
  const [groupName, setGroupName] = useState(""); // Store new group name
  const [groups, setGroups] = useState([]); // List of groups for dropdown
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  // Handlers for upload type change and mobile number input
  const handleUploadTypeChange = (event) => {
    setUploadType(event.target.value);
    setCsvFile(null);
    setMobileNumbers("");
  };

  const handleMobileNumbersChange = (event) => {
    setMobileNumbers(event.target.value);
  };

  const handleCsvFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleOpenGroupModal = () => {
    setIsGroupModalOpen(true);
  };

  const handleCloseGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  // Function to fetch the group list
  const fetchGroups = async () => {
    try {
      const response = await handleGroupOperations({
        action: "read",
        username: user,
      });
      const fetchedGroups =
        response?.data?.map((group) => ({
          id: group.id, // Capture the group ID
          name: group.Group_name, // Capture the group name
        })) || []; // Ensure array of group names
      setGroups(fetchedGroups); // Set group names array
    } catch (error) {
      setGroups([]); // Set to empty array on error
      toast.error("Error fetching groups.");
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        action: "create",
        username: user,
        group_name: groupName,
        added_by: user,
      };
      await handleGroupOperations(payload);
      toast.success("Group created successfully!");
      setIsGroupModalOpen(false); // Close modal on success
      setGroupName(""); // Clear input
      fetchGroups();
      refreshGroups();
    } catch (error) {
      toast.error("Error creating group.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: user,
      Contact_group_id: selectedGroupId,
      action: "create",
      type: uploadType === "CSV File" ? "csv" : "textbox",
    };

    if (uploadType === "CSV File") {
      if (!csvFile) {
        toast.error("Please select a CSV file to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("username", payload.username);
      formData.append("Contact_group_id", payload.Contact_group_id);
      formData.append("action", payload.action);
      formData.append("type", payload.type);
      formData.append("contact_mobile_number", csvFile); // Append the CSV file

      try {
        await handleContactOperations(formData);
        toast.success("Contacts imported successfully via CSV!");
        closeContactModal();
      } catch (error) {
        toast.error("Error uploading CSV file. Please try again.");
      }
    } else {
      // Handle mobile numbers
      payload.contact_mobile_number = mobileNumbers; // Split mobile numbers by newline

      try {
        await handleContactOperations(payload); // Send the mobile numbers payload
        toast.success("Contacts imported successfully via mobile numbers!");
        closeContactModal();
      } catch (error) {
        toast.error("Error uploading mobile numbers. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Heading */}
      <div className="pb-2 border-b">
        <Typography variant="h6" gutterBottom>
          Import Contacts
        </Typography>
      </div>
      {/* Scrollable Content */}
      <div className="overflow-y-auto py-4 scrollbar-hide">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} className="flex flex-col gap-2">
            {/* Select Group */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Select Group</InputLabel>

                <Select
                  value={selectedGroup}
                  onChange={(e) => {
                    setSelectedGroup(e.target.value);
                    const selectedGroupObj = groups.find(
                      (group) => group.name === e.target.value
                    );
                    setSelectedGroupId(selectedGroupObj?.id || ""); // Set the selected group ID
                  }}
                  label="Select Group"
                >
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.name}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Upload From Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Upload From</InputLabel>
                <Select
                  value={uploadType}
                  onChange={handleUploadTypeChange}
                  label="Upload From"
                >
                  <MenuItem value="CSV File">CSV File</MenuItem>
                  <MenuItem value="Enter Mobile Number">
                    Enter Mobile Number
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Conditional Input Based on Selection */}
            {uploadType === "CSV File" ? (
              <Grid item xs={12}>
                <TextField
                  label="Upload File (Import Contacts Using .csv file)"
                  type="file"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  fullWidth
                  required
                  onChange={handleCsvFileChange}
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <TextField
                  label="Mobile No"
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  placeholder="Enter Mobile Number"
                  value={mobileNumbers}
                  onChange={handleMobileNumbersChange}
                  helperText={`For multiple numbers, use "ENTER" to separate numbers. Don't use comma, semicolon, etc. Enter only 10 Digit number, don't use 0, +91 or country code. Example: 981XXXXXXXX`}
                />
              </Grid>
            )}

            {/* Submit Button on the Right */}
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                onClick={handleOpenGroupModal}
                className="mt-2"
              >
                Add Group
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>

      {/* Group Modal */}
      <Modal
        isModalOpen={isGroupModalOpen}
        closeModal={handleCloseGroupModal}
        width="30vw"
        height="30vh"
        className="rounded p-6"
      >
        <div>
          <Typography variant="h6" className="border-b pb-2">
            New Group
          </Typography>
          <form
            onSubmit={handleCreateGroup}
            className="flex flex-col gap-4 mt-4"
          >
            <TextField
              label="Group Name"
              variant="outlined"
              fullWidth
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mb-4"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ImportContacts;
