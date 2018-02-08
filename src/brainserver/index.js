import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload';


import Agent from './Agent';
var agent= new Agent();

const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('*', (req, res) => {
  res.send('Server is working. Please post at "/file" to submit an image.')
});

app.post('/file', function(req, res) {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var sampleFile = req.files.file;
    // Use the mv() method to place the file somewhere on your server
    var fileAbsolutePath = path.join(__dirname, 'tmp')+"/"+sampleFile.name;
    sampleFile.mv(fileAbsolutePath, function(err) {
        if (err)
            return res.status(500).send(err);
        
        agent.runImage(fileAbsolutePath, function(output){  
            res.send(JSON.stringify(output));
        });
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});