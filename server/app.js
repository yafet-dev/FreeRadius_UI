const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const { exec } = require("child_process");

const filePath = "/etc/freeradius/3.0/users"; // Path to the FreeRADIUS users file

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to get the file content
app.get("/users", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }
    res.send(data); // Send the raw file content
  });
});

// Endpoint to add a new entry
app.post("/users", (req, res) => {
  const { newEntry } = req.body;

  // Validate newEntry
  if (!newEntry || !newEntry.includes("Cleartext-Password")) {
    console.error("Invalid entry provided:", req.body);
    return res.status(400).send("Invalid FreeRADIUS entry");
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    // Append the new entry to the file
    const updatedData = data.trim() + "\n\n" + newEntry;

    fs.writeFile(filePath, updatedData, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return res.status(500).send("Error writing to file");
      }

      res.send("Entry added successfully");
    });
  });
});

// Endpoint to update the entire file content
app.put("/users", (req, res) => {
  const { updatedContent } = req.body;

  // Validate updatedContent
  if (!updatedContent || typeof updatedContent !== "string") {
    console.error("Invalid content provided");
    return res.status(400).send("Invalid content provided");
  }

  fs.writeFile(filePath, updatedContent, "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).send("Error writing to file");
    }

    res.send("File updated successfully");
  });
});

//run restart freeradius command
app.post("/restart", (req, res) => {
  exec("sudo systemctl restart freeradius", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restarting FreeRADIUS: ${error.message}`);
      return res.status(500).send("Failed to restart FreeRADIUS");
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    res.send("FreeRADIUS restarted successfully");
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
