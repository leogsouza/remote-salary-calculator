import React, { Component } from 'react';
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
        <p>
          Salary Annual Value:
          <input type="text" onChange={this.handleChange} />
          <button onClick={this.handleCalculate}>Calculate</button>
        </p>
        <p>{this.state.result}</p>
        
      </div>
    );
  }
}

export default App;
