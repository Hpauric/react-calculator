import React, {
  Component
}
from 'react';
import './App.css';



function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function checkLengthOfText(text, textLength) {
  if (text.length > textLength) {
    let newText = "..." + text.slice(text.length - textLength);
    return newText;
  }
  else return text;
}

class Keypad extends Component {
  constructor(props) {
    super(props);
  }
  manageEvent(e) {
    this.props.clickHandle(e);
  }
  render() {
    return (
      <button id={this.props.type} onClick={this.manageEvent.bind(this)}>
        {this.props.buttonText}
      </button>
    );
  }
}

class Screen extends Component {
  constructor() {
    super();
  }

  displayText() {
    let text = this.props.storedValue;
    if (text !== "") {
      return "(" + text + ")";
    }
  }

  render() {
    return (
      <div id="screen">
        <div>{this.props.input}</div>
        <div className="text-small">
          <div id="calculations">{this.props.calculation}</div>
          <div id="stored-value">{this.displayText()}</div>
        </div>
      </div>
    );
  }
}

class Main extends Component {
  constructor() {
    super();
    this.state = {
      number: "0", // number to display on top part of screen
      storedValue: "0", // used for operations
      operator: "",
      calculation: "",
      decimalPointClicked: false,
      newNumberFlag: false
    };
  }

  //cleaning display screen
  displayClearAll() {
    // reseting state to default state
    this.setState({
      number: "0",
      storedValue: "0",
      operator: "",
      calculation: "",
      decimalPointClicked: false
    });
  }
  
  displayClearEntry() {
    // clear number
    let numberLength = this.state.number.length + 1;
    let indexPosition = this.state.calculation.length - numberLength;
    
    this.setState((prevState, props) => {
          return {
            number: "0",
            calculation: prevState.calculation.slice(0, indexPosition),
          };
    });
  }
  

  equalsResultSetState(result) {
    this.setState({
      number: result,
      storedValue: result,
      operator: "equals",
      decimalPointClicked: false,
      newNumberFlag: false
    });
  }

  performAddition(nextOperatorValue) {
    let result =
      parseFloat(this.state.number) + parseFloat(this.state.storedValue);
    result = round(result, 3);

    if (nextOperatorValue === "equals") {
      this.equalsResultSetState(result);
    }
    else {
      this.setState({
        number: "0",
        storedValue: result,
        operator: nextOperatorValue,
        decimalPointClicked: false,
        newNumberFlag: false
      });
    }
  }
  performSubtraction(nextOperatorValue) {
    let result =
      parseFloat(this.state.storedValue) - parseFloat(this.state.number);
    result = round(result, 3);

    if (nextOperatorValue === "equals") {
      this.equalsResultSetState(result);
    }
    else {
      this.setState({
        number: "0",
        storedValue: result,
        operator: nextOperatorValue,
        decimalPointClicked: false,
        newNumberFlag: false
      });
    }
  }
  performMultiplication(nextOperatorValue) {
    let result =
      parseFloat(this.state.number) * parseFloat(this.state.storedValue);
    result = round(result, 3);

    if (nextOperatorValue === "equals") {
      this.equalsResultSetState(result);
    }
    else {
      this.setState({
        number: "0",
        storedValue: result,
        operator: nextOperatorValue,
        decimalPointClicked: false,
        newNumberFlag: false
      });
    }
  }
  performDivision(nextOperatorValue) {
    let result =
      parseFloat(this.state.storedValue) / parseFloat(this.state.number);
    result = round(result, 3);

    if (nextOperatorValue === "equals") {
      this.equalsResultSetState(result);
    }
    else {
      this.setState({
        number: "0",
        storedValue: result,
        operator: nextOperatorValue,
        decimalPointClicked: false,
        newNumberFlag: false
      });
    }
  }

  performCalculation(nextOperatorValue) {
    if (this.state.operator === "plus") {
      this.performAddition(nextOperatorValue);
    }
    else if (this.state.operator === "minus") {
      this.performSubtraction(nextOperatorValue);
    }
    else if (this.state.operator === "multiply") {
      this.performMultiplication(nextOperatorValue);
    }
    else if (this.state.operator === "divide") {
      this.performDivision(nextOperatorValue);
    }
    else if (this.state.operator === "") {
      // no operator
      this.setState({
        storedValue: this.state.number,
        number: "0",
        operator: nextOperatorValue,
        decimalPointClicked: false
      });
    }
    else if (this.state.operator === "equals") {
      if (!this.state.newNumberFlag) {
        console.log("not a new number");

        this.setState((prevState, props) => {
          return {
            storedValue: prevState.number,
            number: "0",
            operator: nextOperatorValue,
            decimalPointClicked: false
          };
        });

      }
      else {
        this.setState({
          number: this.state.storedValue,
          operator: nextOperatorValue,
          decimalPointClicked: false
        });
      }
    }
  }

  equalsOperatorClick(e) {
    this.performCalculation("equals");
    this.setState({
      newNumberFlag: true
    });
    this.updateChainedText(" =");
  }

  updateChainedText(text, operator) {
    if (this.state.operator !== "equals") {
      // if equals has not just been hit, chain the addition
      let newText = this.state.calculation.toString().concat(text);
      newText = checkLengthOfText(newText, 18);
      this.setState({
        calculation: newText
      });
    }
    else {
      // if equals has been just hit,
      // and if it's not an operator that was hit after equals
      // set the calculation text to the current number
      if (!operator) {
        this.setState({
          calculation: text
        });
      }
      else {
        // Otherwise, set the calculation to the stored value
        // with the new operator appended
        this.setState((prevState, props) => {
          return {
            calculation: prevState.storedValue.toString().concat(text)
          };
        });
      }
    }
  }

  plusOperatorClick(e) {
    this.performCalculation("plus");
    this.updateChainedText(" + ", true);
  }
  minusOperatorClick(e) {
    this.performCalculation("minus");
    this.updateChainedText(" - ", true);
  }
  multiplyOperatorClick(e) {
    this.performCalculation("multiply");
    this.updateChainedText(" x ", true);
  }
  divisionOperatorClick(e) {
    this.performCalculation("divide");
    this.updateChainedText(" / ", true);
  }

  decimalPointClick(e) {
    if (!this.state.decimalPointClicked) {
      this.setState({
        number: this.state.number + ".",
        calculation: this.state.calculation.toString().concat("."),
        decimalPointClicked: true,
        newNumberFlag: false
      });
    }
  }

  // Displaying numbers on screen

  keypadClick(e) {
    let pressedButton = e.target.innerHTML;
    if (this.state.newNumberFlag === true && this.state.operator === "equals") {
      this.setState({
        storedValue: "0"
          //operator: "",
      });
    }
    if (this.state.number === "0" || this.state.newNumberFlag === true) {
      this.setState(
        (prevState, props) => {
          return {
            number: pressedButton,
            newNumberFlag: false
          };
        },
        () => {
          this.updateChainedText(pressedButton, false);
        }
      );
    }
    else {
      let newNumber = this.state.number + pressedButton;
      newNumber = checkLengthOfText(newNumber, 10);
      /*
      this.setState({
        number: newNumber,
        newNumberFlag: false,
      });
      this.updateChainedText(pressedButton);
      */

      this.setState(
        (prevState, props) => {
          return {
            number: newNumber,
            newNumberFlag: false
          };
        },
        () => {
          this.updateChainedText(pressedButton);
        }
      );
    }
  }

  render() {
    return (
      <div className="center-block" id="main">
        <h1>React Calculator</h1>
        <Screen
          input={this.state.number}
          calculation={this.state.calculation}
          storedValue={this.state.storedValue}
          />
        
        <div id="keypad-container">
          <Keypad
          type="clear"
          clickHandle={this.displayClearAll.bind(this)}
          buttonText={"AC"}
          />
          <Keypad
          buttonText={"CE"}
          clickHandle={this.displayClearEntry.bind(this)}
          />
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(val => {
            return (
              <Keypad
                clickHandle={this.keypadClick.bind(this)}
                buttonText={val}
                />
            );
          })}
          <Keypad clickHandle={this.keypadClick.bind(this)} buttonText={0} />
          <Keypad
            clickHandle={this.decimalPointClick.bind(this)}
            buttonText={"."}
            />
          <Keypad
            clickHandle={this.plusOperatorClick.bind(this)}
            buttonText={"+"}
            />
          <Keypad
            clickHandle={this.minusOperatorClick.bind(this)}
            buttonText={"-"}
            />
          <Keypad
            clickHandle={this.multiplyOperatorClick.bind(this)}
            buttonText={"x"}
            />
          <Keypad
            clickHandle={this.divisionOperatorClick.bind(this)}
            buttonText={"/"}
            />
          <Keypad
            clickHandle={this.equalsOperatorClick.bind(this)}
            buttonText={"="}
            />
        </div>
      </div>
    );
  }
}


export default Main;
