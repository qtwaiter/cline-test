class Calculator {
    constructor() {
        this.current = '0';
        this.previous = '';
        this.operation = undefined;
        this.shouldResetCurrent = false;
        this.lastCalculated = false;
        this.historyList = document.querySelector('.history-list');
    }

    clear() {
        this.current = '0';
        this.previous = '';
        this.operation = undefined;
        this.lastCalculated = false;
    }

    delete() {
        if (this.current === '0') return;
        if (this.current.length === 1) {
            this.current = '0';
        } else {
            this.current = this.current.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.lastCalculated) {
            this.current = number.toString();
            this.lastCalculated = false;
            return;
        }
        if (this.shouldResetCurrent) {
            this.current = number.toString();
            this.shouldResetCurrent = false;
            return;
        }
        if (number === '.' && this.current.includes('.')) return;
        if (this.current === '0' && number !== '.') {
            this.current = number.toString();
        } else {
            this.current = this.current + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.current === '') return;
        if (this.previous !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previous = this.current;
        this.shouldResetCurrent = true;
        this.lastCalculated = false;
    }

    addToHistory(calculation, result) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="calculation">${calculation}</div>
            <div class="result">= ${result}</div>
        `;
        this.historyList.insertBefore(historyItem, this.historyList.firstChild);
    }

    calculate() {
        let result;
        const prev = parseFloat(this.previous);
        const current = parseFloat(this.current);
        
        if (isNaN(prev) || isNaN(current)) return;

        const calculation = `${this.getDisplayNumber(prev)} ${this.operation} ${this.getDisplayNumber(current)}`;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.current = 'Error';
                    this.previous = '';
                    this.operation = undefined;
                    this.addToHistory(calculation, 'Error: 除数不能为0');
                    return;
                }
                result = prev / current;
                break;
            case '%':
                result = (prev * current) / 100;
                break;
            default:
                return;
        }

        this.current = result.toString();
        this.addToHistory(calculation, this.getDisplayNumber(result));
        this.operation = undefined;
        this.previous = '';
        this.lastCalculated = true;
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        document.querySelector('.current').textContent = this.getDisplayNumber(this.current);
        if (this.operation != null) {
            document.querySelector('.previous').textContent = 
                `${this.getDisplayNumber(this.previous)} ${this.operation}`;
        } else {
            document.querySelector('.previous').textContent = '';
        }
    }
}

const calculator = new Calculator();

// Number buttons
document.querySelectorAll('.number').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.textContent);
        calculator.updateDisplay();
    });
});

// Operator buttons
document.querySelectorAll('.operator').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        switch (action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'calculate':
                calculator.calculate();
                break;
            default:
                calculator.chooseOperation(button.textContent);
        }
        calculator.updateDisplay();
    });
});
