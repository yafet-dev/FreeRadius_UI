require("dotenv").config();
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { exec } = require("child_process");
const jwt = require("jsonwebtoken");

const app = express();
const usersFilePath = "/etc/freeradius/3.0/users"; // Path to the FreeRADIUS users file
const clientsFilePath = "/etc/freeradius/3.0/clients.conf"; // Path to the FreeRADIUS clients file

app.use(cors());
app.use(express.json());

// Hardcoded credentials from environment variables
const USER_USERNAME = process.env.USER_USERNAME;
const USER_PASSWORD = process.env.USER_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

console.log("USER_USERNAME:", USER_USERNAME);
console.log("USER_PASSWORD:", USER_PASSWORD);
console.log("JWT_SECRET:", JWT_SECRET ? "Loaded" : "Not Loaded");

// Middleware to authenticate requests using JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).send("Access token missing");
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid or expired token");
    }
    req.user = user; // attach decoded user if needed
    next();
  });
}

// Login endpoint to obtain a JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  // Check against hardcoded credentials
  if (username === USER_USERNAME && password === USER_PASSWORD) {
    // Create the JWT payload
    const payload = { username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Token valid for 1 hour
    return res.json({ token });
  } else {
    return res.status(401).send("Invalid credentials");
  }
});

// Function to handle file operations
defineFileRoutes(clientsFilePath, "/clients");
defineFileRoutes(usersFilePath, "/users");

function defineFileRoutes(filePath, baseRoute) {
  // Protected endpoint to get the file content
  app.get(baseRoute, authenticateToken, (req, res) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file ${filePath}:`, err);
        return res.status(500).send("Error reading file");
      }
      res.send(data);
    });
  });

  // Protected endpoint to add a new entry
  app.post(baseRoute, authenticateToken, (req, res) => {
    const { newEntry } = req.body;

    if (!newEntry || typeof newEntry !== "string") {
      console.error("Invalid entry provided:", req.body);
      return res.status(400).send("Invalid entry");
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(`Error reading file ${filePath}:`, err);
        return res.status(500).send("Error reading file");
      }

      const updatedData = data.trim() + "\n\n" + newEntry;

      fs.writeFile(filePath, updatedData, "utf8", (err) => {
        if (err) {
          console.error(`Error writing to file ${filePath}:`, err);
          return res.status(500).send("Error writing to file");
        }

        res.send("Entry added successfully");
      });
    });
  });

  // Protected endpoint to update the entire file content
  app.put(baseRoute, authenticateToken, (req, res) => {
    const { updatedContent } = req.body;

    if (!updatedContent || typeof updatedContent !== "string") {
      console.error("Invalid content provided");
      return res.status(400).send("Invalid content provided");
    }

    fs.writeFile(filePath, updatedContent, "utf8", (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}:`, err);
        return res.status(500).send("Error writing to file");
      }

      res.send("File updated successfully");
    });
  });
}

// Protected endpoint to restart FreeRADIUS
app.post("/restart", authenticateToken, (req, res) => {
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
