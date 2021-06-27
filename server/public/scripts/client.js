$(handleReady)

function handleReady(){
    $('#equalBtn').on('click', operationData);
    $('.calculatorBtn').on('click', addToInput);
    $('.operatorBtn').on('click', addToInput);
    $('#clearBtn').on('click', clearFields);
    $('#clearHistoryBtn').on('click', clearHistory);
    $('#operationsHistorySection').on('click', 'li', rerunCalculation);
    getResults();
    clearFields();

    //This prevents typing letters and other special characters besides + - * / .  on the main input
    $('#operationInput').on('keypress', function (event) {
        let regex = new RegExp("[0-9]|([.+*/-])");
        let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
           event.preventDefault();
           return false;
        }
    });
}

//When clicking on the calculator buttons it will show it's value on the input field
function addToInput(){
    //This replace the initial 0 with the new numbers
    if($('#operationInput').val()==0){
        $('#operationInput').val('')
    }
    $('#operationInput').val($('#operationInput').val() + $(this).text());
}

//Check if the input is a valid operation and send it to server if it is
function operationData(){
    let goodOperation = false;
    let operation = $('#operationInput').val();
    let numbers = operation.match(/\d+(\.\d+)?/g).map(v => parseFloat(v));
    let operators = operation.match(/(\+|-|\*|\/)+/g);
    if(numbers&&operators){
        if(numbers.length>operators.length){
            for (const op of operators) {
                if(op.length<2){
                    goodOperation = true;
                }
            }
        }
    }
    if(goodOperation){
        postOperation(operation);

    }else{
        console.log('Fix input please');
    }
}
//Sends operation to server
function postOperation(operation){
    $.ajax({
        type: 'POST',
        url: '/calculate',
        data: {operation: operation},
        dataType: 'text'
    })
    .then(function (response) {
        getResults();
    })
    .catch(function (response){
        console.log('Sorry something went wrong.', response);
    });
}
//Get results from last operation
function getResults(){
    $.ajax({
        type: 'get',
        url: '/results'
    })
    .then(function (response) {
        showResults(response)
    })
    .catch(function (response){
        console.log('Sorry something went wrong.', response);
    });
}
//Show results of last operation on DOM
function showResults(results){
    $('#resultsSection').empty().append(results);
    getHistory();
}
//Gets a history of all previous operations
function getHistory(){
    $.ajax({
        type: 'get',
        url: '/history'
    })
    .then(function (response) {
        showHistory(response);
    })
    .catch(function (response){
        console.log('Sorry something went wrong.', response);
    });
}
//Shows all operations history on DOM with the most recent one on top
function showHistory(operationsHistory){
    $('#operationsHistorySection').empty();
    for (const operation of operationsHistory) {
        let appendStr = `<li>`;
        for (const key in operation) {
            if(key=="operation"){
                for (const element of operation[key]) {
                    appendStr+=`${element} `;
                }
            }
        }
        appendStr+='</li>';
        $('#operationsHistorySection').append(appendStr);
    }
}

//Clicking on a operation from history reruns the calculation
function rerunCalculation(){
    let calculation = $(this).text();
    $('#operationInput').val(calculation.replace(/\s/g,''));
    postOperation(calculation);
}
//Clear all operations history and input field
function clearHistory(){
    $.ajax({
        type: 'delete',
        url: '/history'
    })
    .then(function (response) {
        getResults();
        clearFields();
    })
    .catch(function (response){
        console.log('Sorry something went wrong.', response);
    });
}
//Clears input fields

function clearFields(){
    $.ajax({
        type: 'delete',
        url: '/results'
    })
    .then(function (response) {
        $('#operationInput').val('0');
        getResults();
    })
    .catch(function (response){
        console.log('Sorry something went wrong.', response);
    });
}