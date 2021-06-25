$(handleReady)

function handleReady(){
    console.log("Jquery Linked");
    $('#equalBtn').on('click', getOperation);
    $('.operator').on('click', saveOperator);
}

let operator = "+";

function getOperation(){
    let firstNum = $('#firstNum').val();
    let secondNum = $('#secondNum').val();
    sendOperation(firstNum, secondNum, operator)
}

function saveOperator(){
    operator = $(this).data('operator');
    $('#addBtn').removeClass('selected');
    $('#subtractBtn').removeClass('selected');
    $('#multiplyBtn').removeClass('selected');
    $('#divideBtn').removeClass('selected');
    $(this).addClass('selected')
}

function showResults(results){
    $('#resultsSection').empty().append(results);
}

function sendOperation(firstNum, secondNum, operat){
    $.ajax({
        type: 'POST',
        url: '/calculate',
        data: {
            firstNum: firstNum,
            secondNum: secondNum,
            operator: operat
        },
        dataType: 'json'
    })
    .then(function (response) {
        showResults(response)
    })
    .catch(function (response){
        console.log('Sorry something went wrong.', response);
    });
}