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

let lastResult = "0";
let allOperations = [];

app.post('/calculate', (req, res) => {
    let operation = req.body;
    //This gets a string an splits it to an array of numbers and operators in the same order as the string
    const opArray = operation.operation.split(/(\+|-|\*|\/)+/g);
    //Convert string numbers to float type
    for (const op in opArray) {
        if(parseFloat(opArray[op])){
            opArray[op]=parseFloat(opArray[op]);
        }
    }
    //Calculate results and store operation and results in a global array for future use
    let results = calculate(opArray);

    //.unshift is used so the most recent operation will show on top of the history
    allOperations.unshift({
        operation: opArray,
        result: results
    });
    console.log(allOperations);
    lastResult = results + "";
    res.status(201);
})

app.get('/results', (req, res) =>{
    res.send(lastResult);
})
app.get('/history', (req, res) =>{
    res.send(allOperations);
})
app.delete('/history', (req, res) =>{
    allOperations=[];
    lastResult=0;
    res.send(allOperations);
})

//Function that calculates results with order of precedence of operators
function calculate(calc) {
    // --- Perform a calculation expressed as an array of operators and numbers
    let ops = [{'*': (a, b) => a * b, '/': (a, b) => a / b},
    {'+': (a, b) => a + b, '-': (a, b) => a - b}]
    let newCalc = [];
    let currentOp;

    for (let i = 0; i < ops.length; i++) {
        for (let j = 0; j < calc.length; j++) {
            if (ops[i][calc[j]]) {
                currentOp = ops[i][calc[j]];
            } else if (currentOp) {
                newCalc[newCalc.length - 1] = 
                    currentOp(newCalc[newCalc.length - 1], calc[j]);
                currentOp = null;
            } else {
                newCalc.push(calc[j]);
            }
        }
        calc = newCalc;
        newCalc = [];
    }
    if (calc.length > 1) {
        console.log('Error: unable to resolve calculation');
        return calc;
    } else {
        return calc[0];
    }
}