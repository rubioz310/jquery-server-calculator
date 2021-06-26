$(handleReady)

function handleReady(){
    console.log("Jquery Linked");
    $('#equalBtn').on('click', operationData);
    $('.operator').on('click', saveOperator);
}

let operator = "+";

function operationData(){
    let operation = {
        firstNum: $('#firstNum').val(),
        secondNum: $('#secondNum').val(),
        operator: operator
    }
    postOperation(operation);
    getResults();
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

function saveOperator(){
    operator = $(this).data('operator');
    $('#addBtn').removeClass('selected');
    $('#subtractBtn').removeClass('selected');
    $('#multiplyBtn').removeClass('selected');
    $('#divideBtn').removeClass('selected');
    $(this).addClass('selected')
}

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