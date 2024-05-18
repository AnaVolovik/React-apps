import React from 'react';
import './App.scss';

const buttons = [
  { id: 'clear', value: 'AC' },
  { id: 'seven', value: '7' },
  { id: 'eight', value: '8' },
  { id: 'nine', value: '9' },
  { id: 'divide', value: '/' },
  { id: 'four', value: '4' },
  { id: 'five', value: '5' },
  { id: 'six', value: '6' },
  { id: 'multiply', value: '*' },
  { id: 'one', value: '1' },
  { id: 'two', value: '2' },
  { id: 'three', value: '3' },
  { id: 'subtract', value: '-' },
  { id: 'zero', value: '0' },
  { id: 'decimal', value: '.' },
  { id: 'add', value: '+' },
  { id: 'equals', value: '=' }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expression: '',
      currentVal: '0'
    };
    this.isNumber = this.isNumber.bind(this);
    this.isDot = this.isDot.bind(this);
    this.isOperator = this.isOperator.bind(this);
    this.isEquals = this.isEquals.bind(this);
    this.trimExpression = this.trimExpression.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    buttons.forEach(button => {
      const btn = document.getElementById(button.id);
      if (btn) {
        btn.addEventListener('click', this.handleClick);
      }
    });
  }
  
  componentWillUnmount() {
    buttons.forEach(button => {
      const btn = document.getElementById(button.id);
      if (btn) {
        btn.removeEventListener('click', this.handleClick);
      }
    });
  }
  
  trimExpression(expression) {
    const indexOfEquals = expression.indexOf('=');
    if (indexOfEquals !== -1) {
      expression = expression.substring(indexOfEquals + 1);
    }
    return expression;
  }
  
  isNumber(value) {
    let { currentVal, expression } = this.state;
    expression = this.trimExpression(expression);
    if (currentVal === '0') {
      currentVal = value;
    } else {
      currentVal += value;
    }
    expression += value;
    this.setState({ currentVal, expression });
  }
  
  isDot(value) {
    let { currentVal, expression } = this.state;
    expression = this.trimExpression(expression);
    if (!currentVal.includes('.')) {
      if (value === '.' && expression.slice(-1) === '.') {
        currentVal += '';
        expression += '';
      } else {
        currentVal += value;
        expression += value;
      }
    }
    this.setState({ currentVal, expression });
  }
  
  isOperator(value) {
    let { currentVal, expression } = this.state;
    expression = this.trimExpression(expression);
    const lastCharIsOperator = ['+', '-', '*', '/'].includes(currentVal.slice(-1));
                
    if ((value === '+' || value === '*' || value === '/') && lastCharIsOperator) {
      if (this.state.currentVal  === '-') {
        expression = expression.slice(0, -2) + value;
      }
      expression = expression.slice(0, -1) + value;
    } else if (value === '-' && lastCharIsOperator) {
        if (this.state.currentVal.slice(0, -1) === '-' && this.state.currentVal  === '-') {
          expression += value;
        } else if (this.state.currentVal.slice(0, -1) !== '-' && this.state.currentVal !== '-') {
          expression += value;
        }
    } else {
      expression += value;
    }

    if (lastCharIsOperator) {
      currentVal = currentVal.slice(0, -1) + value;
    } else {
      currentVal = value;
    }
    this.setState({ currentVal, expression });
  }
  
  isEquals() {
    let { expression } = this.state;
    try {
      const result = eval(expression);
      let resultStr = result % 1 !== 0 ? parseFloat(result.toFixed(4)).toString() : result.toString();
      this.setState({
        expression: `${expression}=${resultStr}`,
        currentVal: resultStr
      });
    } catch (error) {
      this.setState({
        currentVal: 'Ошибка',
        expression: ''
      });
      setTimeout(() => {
        this.setState({
          currentVal: '0'
        });
      }, 1000);
    }
  }
  
  handleClick(event) {
    const clickedButton = buttons.find(button => button.id === event.target.id);
    if (clickedButton) {
      const { id, value } = clickedButton;
      let newExpression = this.state.expression;
      let newCurrentVal = this.state.currentVal;

      let result = 0;
      let isResult = false;
      
      if (id === 'clear') {
        this.setState({
          expression: '',
          currentVal: '0'
        });
        return;
      } else if (/[0-9]/.test(value)) {
        this.isNumber(value);
      } else if (['+', '-', '*', '/'].includes(value)) {
        this.isOperator(value);
      } else if (value === '.') {
        this.isDot(value);
      } else if (id === 'equals') {
        this.isEquals();
      } 
      
      setTimeout(() => {
        let newCurrentVal = this.state.currentVal;
        if (newCurrentVal.length > 20) {
          let previousVal = newCurrentVal.slice(0, 20); // Keep first 20 characters as previous value
          this.setState({ currentVal: 'Превышен лимит' });
          setTimeout(() => this.setState({ currentVal: previousVal }), 1000);
        }
      }, 0);
      
      newExpression = this.state.expression;
      newCurrentVal = this.state.currentVal;
      
      this.setState({
        expression: newExpression,
        currentVal: newCurrentVal
      });
    }
  }
     
  render() {
    return(
      <div className='app-wrapper'>
        <Calculator expression={this.state.expression} currentVal={this.state.currentVal} />
        <h4>
          <a href='https://codepen.io/ana_volovik'>by Anastasia Volovik</a>
        </h4>
      </div>
    );
  }
}

const Calculator = (props) => {
  return(
    <div className='calculator'>
      <Display expression={props.expression} currentVal={props.currentVal}/>
      <Buttons />
    </div>
  );
};

const Display = (props) => {
  return(
    <div className='screen'>
      <div className='screen-expression'>{props.expression}</div>
      <div className='screen-current-val' id='display'>{props.currentVal}</div>
    </div>
  );
};

const Buttons = () => {
  return(
    <div className='buttons'>
      {buttons.map(button => (
        <button
          key={button.id}
          id={button.id}
          className='buttons-btn btn'
        >
          {button.value}
        </button>
      ))}
    </div>
  );
};

export default App;