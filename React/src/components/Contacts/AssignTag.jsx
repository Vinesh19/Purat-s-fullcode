import { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

const AssignTag = ({ onSubmitTags }) => {
  const [tags, setTags] = useState([""]); // Initially one empty input

  // Handle the change for individual tag inputs
  const handleTagChange = (index, event) => {
    const newTags = [...tags];
    newTags[index] = event.target.value;
    setTags(newTags);
  };

  // Add a new empty tag input field
  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  // Remove a tag input field
  const handleRemoveTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const validTags = tags.filter((tag) => tag.trim() !== ""); // Remove empty tags
    if (validTags.length === 0) {
      toast.error("Please add at least one valid tag.");
      return;
    }

    // Call the passed callback function with tags
    onSubmitTags(validTags);

    // Optionally reset the input fields after submission
    setTags([""]);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Fixed Header */}
      <Typography variant="h5" gutterBottom className="border-b pb-2">
        Assign Tag
      </Typography>

      {/* Scrollable Content */}
      <Box sx={{ overflowY: "auto", flexGrow: 1, paddingTop: 2 }} className="scrollbar-hide">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {tags.map((tag, index) => (
              <Grid
                item
                xs={12}
                key={index}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <TextField
                  label={`Tag ${index + 1}`}
                  value={tag}
                  onChange={(e) => handleTagChange(index, e)}
                  fullWidth
                  variant="outlined"
                />
                <IconButton
                  color="primary"
                  onClick={handleAddTag}
                  sx={{ marginLeft: 1 }}
                >
                  <AddIcon />
                </IconButton>
                {tags.length > 1 && (
                  <IconButton
                    color="secondary"
                    onClick={() => handleRemoveTag(index)}
                    sx={{ marginLeft: 1 }}
                  >
                    <DeleteIcon className="text-red-500"/>
                  </IconButton>
                )}
              </Grid>
            ))}

            {/* Submit button aligned at the right end */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AssignTag;
