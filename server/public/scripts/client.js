$(handleReady)

function handleReady(){
    console.log("Jquery Linked");
    $('#equalBtn').on('click', operationData);
    // $('.operator').on('click', saveOperator);
    $('.calculatorBtn').on('click', addToInput)
    $('#clearBtn').on('click', clearFields);
    // getHistory();
    //This prevents typing letters and other special characters beside + - * / .  on the main input
    $('#operationInput').on('keypress', function (event) {
        let regex = new RegExp("[0-9+.*/-]");
        let key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
           event.preventDefault();
           return false;
        }
    });

}

// let operator = "+";

function addToInput(){
    $('#operationInput').val($('#operationInput').val() + $(this).text());
}
function operationData(){
    let operation = $('#operationInput').val();

    postOperation(operation);
    // getResults();
    // getHistory();
}
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