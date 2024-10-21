const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint to receive WhatsApp messages
app.post('/whatsapp', (req, res) => {
    const incomingMessage = req.body.Body.trim();
    const fromNumber = req.body.From;

    console.log(`Received message from ${fromNumber}: ${incomingMessage}`);

    // Split message into an array and save to Excel
    const data = incomingMessage.split(',').map(item => item.trim());
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet([data]);
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');

    const fileName = `user_data_${fromNumber.replace('whatsapp:', '')}.xlsx`;
    xlsx.writeFile(wb, fileName);

    // Reply to the user
    const twiml = new MessagingResponse();
    twiml.message('Your Excel file has been created!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
