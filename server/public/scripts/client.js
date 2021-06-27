$(handleReady)

function handleReady(){
    $('#equalBtn').on('click', operationData);
    $('.calculatorBtn').on('click', addToInput);
    $('.operatorBtn').on('click', addToInput);
    $('#clearBtn').on('click', clearFields);
    $('#clearHistoryBtn').on('click', clearHistory);
    $('#operationsHistorySection').on('click', 'li', rerunCalculation);
    getResults();
    getHistory();

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
    getResults();
    getHistory();
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
}
//Clears input fields
function clearFields(){
    $('#operationInput').val('0');
    showResults(0);
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
//Shows all previous operation on DOM with the most recent one on top
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

function clearHistory(){
    $.ajax({
        type: 'delete',
        url: '/history'
    })
    .then(function (response) {
        showHistory(response);
        clearFields();
    })
    .catch(function (response){
        console.log('Sorry something went wrong.', response);
    });
}
function rerunCalculation(){
    let calculation = $(this).text();
    $('#operationInput').val(calculation.replace(/\s/g,''));
    postOperation(calculation);
    getResults();
    getHistory();
}