$(handleReady)

function handleReady(){
    console.log("Jquery Linked");
    $('#equalBtn').on('click', operationData);
    // $('.operator').on('click', saveOperator);
    $('.calculatorBtn').on('click', addToInput)
    $('#clearBtn').on('click', clearFields);
    getHistory();

}

// let operator = "+";

function addToInput(){
    $('#operationInput').val($('#operationInput').val() + $(this).text());
}
function operationData(){
    // let operation = {
    //     firstNum: $('#firstNum').val(),
    //     secondNum: $('#secondNum').val(),
    //     operator: operator
    // }
    postOperation(operation);
    getResults();
    getHistory();
}
function postOperation(operation){
    $.ajax({
        type: 'POST',
        url: '/calculate',
        data: {
            firstNum: operation.firstNum,
            secondNum: operation.secondNum,
            operator: operation.operator
        },
        dataType: 'json'
    })
    .then(function (response) {
        
    })
    .catch(function (response){
        console.log('Sorry something went wrong.', response);
    });
}

// function saveOperator(){
//     operator = $(this).data('operator');
//     $('#addBtn').removeClass('selected');
//     $('#subtractBtn').removeClass('selected');
//     $('#multiplyBtn').removeClass('selected');
//     $('#divideBtn').removeClass('selected');
//     $(this).addClass('selected')
// }

function getResults(operation){
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
function showResults(results){
    $('#resultsSection').empty().append(results);
}
function clearFields(){
    $('#firstNum').val('');
    $('#secondNum').val('');
    showResults(0);
}

function getHistory(){
    $.ajax({
        type: 'get',
        url: '/history'
    })
    .then(function (response) {
        showHistory(response)
    })
    .catch(function (response){
        console.log('Sorry something went wrong.', response);
    });
}

function showHistory(operationsHistory){
    $('#operationsHistorySection').empty();
    for (const operation of operationsHistory) {
        $('#operationsHistorySection').append(`
            <li>${operation.firstNum} ${operation.operator} ${operation.secondNum} = ${operation.results}</li>
        `)
    }
}