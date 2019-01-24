import React, { Component } from 'react';
import NavBar from './components/Navbar/Navbar';

import NumberFormat from "react-number-format";
import './App.css';

class App extends Component {

  state = {
    salary: null,
    result: null
  }

  handleChange = (event) => {

    this.setState({
      salary: event.target.value
    })    
  }

  handleValueChange = (values) => {
    const {formattedValue, value} = values;
    // formattedValue = $2,223
    // value ie, 2223
    console.log(value, formattedValue);
    this.setState({salary: value})
  }

  handleCalculate = () => {
    const salary = this.state.salary;

    const result = salary / 12;

    this.setState({
      result: result
    });

  }

  render() {
    return (
      <div className="App">
        <NavBar />
        <p>
          Salary Annual Value:
          <NumberFormat thousandSeparator={true} prefix={'$'} onValueChange={this.handleValueChange} />
          <button onClick={this.handleCalculate}>Calculate</button>
        </p>
        <p>
          <NumberFormat 
            value={this.state.result} 
            thousandSeparator={true} 
            displayType={'text'} 
            prefix={'$'}
            decimalScale={2}
            fixedDecimalScale={true} /></p>
        
      </div>
    );
  }
}

export default App;
