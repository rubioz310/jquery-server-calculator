// ********* Server setup **************
const express = require('express');

//Create an instance of express by calling the function
// returned above - give and object
const app = express();
const port = 5000; // Need for the server config

// express static file serving - public is the folder name:
app.use(express.static('server/public'));

//let's you use json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//start up server
app.listen(port, () => {
    console.log('listening on port', port);
});
// ^^^^^^^^^ Server setup ^^^^^^^^^^^^^^^^^^^^^^

// ********* Server requests **************

app.post('/calculate', (req, res) => {
    let operation = req.body;
    console.log(operation);
    let results = 0;
    switch (operation.operator) {
        case "+":
            results = parseInt(operation.firstNum) + parseInt(operation.secondNum);
            break;
        case "-":
            results = operation.firstNum - operation.secondNum;
            break;
        case "*":
            results = operation.firstNum * operation.secondNum;
            break;
        case "/":
            results = operation.firstNum / operation.secondNum;
            break;
    }
    operation.results = results;
    results+="";
    res.send(results);
})