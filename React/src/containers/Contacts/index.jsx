import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  TablePagination,
  Paper,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Modal from "../../components/Modal"; // Import existing modal component
import DeleteConfirmation from "../../components/Crm/DeleteModal"; // Import existing delete confirmation

import { handleGroupOperations } from "../../services/api";

const GroupList = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalGroups, setTotalGroups] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null); // To store the selected group for edit/delete

  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const response = await handleGroupOperations({
        action: "read",
        username: user,
      });
      setGroups(response?.data || []);
      setTotalGroups(response?.data?.length);
    } catch (error) {
      toast.error("Error fetching groups");
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (selectedGroup) {
        await handleGroupOperations({
          action: "delete",
          group_id: selectedGroup.id,
          username: user,
        });
        toast.success("Group deleted successfully!");
        fetchGroups(); // Refresh groups after deletion
      }
    } catch (error) {
      toast.error("Error deleting group");
    } finally {
      setIsDeleteModalOpen(false); // Close the delete confirmation modal
    }
  };

  const handleEditGroup = async () => {
    try {
      if (selectedGroup) {
        await handleGroupOperations({
          action: "update",
          group_id: selectedGroup.id,
          group_name: selectedGroup.Group_name,
        });
        
        toast.success("Group updated successfully!");
        fetchGroups(); // Refresh groups after update
      }
    } catch (error) {
      toast.error("Error updating group");
    } finally {
      setIsEditModalOpen(false); // Close the edit modal
    }
  };

  const handleGroupClick = (groupId, groupName, groups) => {
    navigate(
      `/dashboard/whatsapp/contacts/${groupId}/${encodeURIComponent(
        groupName
      )}`,
      {
        state: {
          groups,
          selectedGroupId: groupId,
          selectedGroupName: groupName,
        },
      }
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  return (
    <div className="p-6 w-full">
      <Typography variant="h4">Contact Groups</Typography>

      <TableContainer component={Paper} className="shadow-sm my-6">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "25%", textAlign: "center" }}>
                Group Name
              </TableCell>
              <TableCell style={{ width: "25%", textAlign: "center" }}>
                Contacts Count
              </TableCell>
              <TableCell style={{ width: "25%", textAlign: "center" }}>
                Date Created
              </TableCell>
              <TableCell style={{ width: "25%", textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((group) => (
                <TableRow
                  key={group.id}
                  hover
                  onClick={() => handleGroupClick(group.id, group.Group_name)}
                  className="cursor-pointer"
                >
                  <TableCell style={{ textAlign: "center" }}>
                    {group.Group_name}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {group.count || "N/A"}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {new Date(group.created_at).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGroup(group);
                        setIsEditModalOpen(true); // Open edit modal
                      }}
                      className="!text-blue-600"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGroup(group);
                        setIsDeleteModalOpen(true); // Open delete modal
                      }}
                      className="!text-red-600"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalGroups}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          rowsPerPageOptions={[10, 25, 50]}
        />
      </TableContainer>

      {/* Edit Group Modal */}
      <Modal
        isModalOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        width="30%"
        height="30%"
        className="rounded-md"
      >
        <div>
          <Typography variant="h6" className="border-b pb-1">
            Edit Group
          </Typography>

          <TextField
            type="text"
            value={selectedGroup?.Group_name || ""}
            onChange={(e) =>
              setSelectedGroup({ ...selectedGroup, Group_name: e.target.value })
            }
            className="!my-4"
            placeholder="Enter new group name"
            fullWidth
            variant="outlined"
          />

          {/* Button wrapper with flexbox to align the button to the right */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditGroup}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
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
    </div>
  );
};

export default GroupList;
