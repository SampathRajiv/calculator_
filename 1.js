const display = document.getElementById("display");

function addToDisplay(input) {
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function evaluates() {
    try {
        let result = calculateExpression(display.value);
        display.value = result;
    } catch (error) {
        display.value = "SYNTAX ERROR";
    }
}

function calculateExpression(expression) {
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

    function convertToRPN(tokens) {
        let outputQueue = [];
        let operatorStack = [];

        tokens.forEach(token => {
            if (!isNaN(token)) {
                outputQueue.push(token);
            } else if (token in precedence) {
                while (operatorStack.length > 0) {
                    let topOperator = operatorStack[operatorStack.length - 1];
                    if (topOperator in precedence && precedence[token] <= precedence[topOperator]) {
                        outputQueue.push(operatorStack.pop());
                    } else {
                        break;
                    }
                }
                operatorStack.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();
            }
        });

        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }

        return outputQueue;
    }

    function evaluateRPN(rpnTokens) {
        let stack = [];

        rpnTokens.forEach(token => {
            if (!isNaN(token)) {
                stack.push(parseFloat(token));
            } else {
                let num2 = stack.pop();
                let num1 = stack.pop();
                switch (token) {
                    case '+': stack.push(num1 + num2); break;
                    case '-': stack.push(num1 - num2); break;
                    case '*': stack.push(num1 * num2); break;
                    case '/': stack.push(num1 / num2); break;
                }
            }
        });

        return stack[0];
    }

    function tokenize(expression) {
        return expression.match(/\d+(\.\d+)?|[+\-*/()]|\S/g);
    }

    let tokens = tokenize(expression);
    let rpnTokens = convertToRPN(tokens);
    return evaluateRPN(rpnTokens);
}
