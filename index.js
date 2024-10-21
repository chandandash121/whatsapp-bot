const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

// Handle incoming messages
app.post('/whatsapp', (req, res) => {
    const incomingMessage = req.body.Body.trim();
    const fromNumber = req.body.From;

    console.log(`Received message from ${fromNumber}: ${incomingMessage}`);

    // Split the incoming message by commas
    const data = incomingMessage.split(',').map(item => item.trim());

    if (data.length !== 4) {
        const twiml = new MessagingResponse();
        twiml.message('Please send the data in the format: Name, Age, Email, Phone');
        return res.end(twiml.toString());
    }

    const [name, age, email, phone] = data;

    // Create a new workbook and a worksheet
    const workbook = xlsx.utils.book_new();
    const worksheetData = [
        ['Name', 'Age', 'Email', 'Phone'], // Column headers
        [name, age, email, phone],          // Data row
    ];
    const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    // Save the workbook to a file
    const filePath = `./${name.replace(/\s+/g, '_')}_contact.xlsx`; // Create a filename
    xlsx.writeFile(workbook, filePath);

    // Reply to the user
    const twiml = new MessagingResponse();
    twiml.message(`Your data has been processed and saved to ${filePath}!`);
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
