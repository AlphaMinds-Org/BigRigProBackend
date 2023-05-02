const multer = require('multer');
const fs = require('fs');

// Function to get the maximum ID from your database or wherever you are storing your IDs
function getMaxId() {
  // Your implementation here
}

// Create a storage object with a destination function that will dynamically create the folder based on the max ID
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const maxId = getMaxId();
    const folderName = `uploads/${maxId + 1}`;
    fs.mkdirSync(folderName, { recursive: true });
    cb(null, folderName);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Create the Multer object using the storage object
const upload = multer({ storage: storage });

// Use the upload middleware in your route handler to upload files to the dynamically created folder