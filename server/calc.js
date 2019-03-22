var output = null; 

function doMath(firstNumber,operator,secondNumber){

    parseFirst=parseFloat(firstNumber);
    parseSecond=parseFloat(secondNumber);
    storeOperator = operator;
    
    switch (operator) {
        case "÷":
            output = parseFirst / parseSecond;
            break;
        case "-":
            output = parseFirst - parseSecond;
            break;
        case "x":
            output = parseFirst * parseSecond;
            break;
        case "+":
            output = parseFirst + parseSecond;
            break;
    }
    return output;
}

var n1=parseInt(process.argv[2]);
var op=process.argv[3];
var n2= parseInt(process.argv[4]);

// console.log(process.argv)

// console.log(n1, op, n2)

var answer=doMath(n1, op, n2);

console.log(answer);


