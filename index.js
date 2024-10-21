const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

// Handle incoming messages
app.post('/whatsapp', (req, res) => {
    const incomingMessage = req.body.Body.trim();
    const fromNumber = req.body.From;

    console.log(`Received message from ${fromNumber}: ${incomingMessage}`);

    // Respond to the user (for testing)
    const twiml = new MessagingResponse();
    twiml.message('Your message was received!');
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
