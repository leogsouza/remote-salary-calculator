import React, { Component } from "react";
import Axios from "axios";
import querystring from "querystring";
import NavBar from "./components/Navbar/Navbar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import "./App.css";
require('now-env');

const NumberFormatCustom = props => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      thousandSeparator
      prefix="$"
    />
  );
};
class App extends Component {
  state = {
    annual: 0,
    monthly: 0,
    converted: 0,
    calculated: 0
  };

  handleChange = event => {
    this.setState({
      annual: event.target.value
    });
  };

  handleValueChange = values => {
    this.setState({ annual: values.value });
  };

  handleCalculate = () => {
    const salary = this.state.annual;

    this.currencyConverterHandler(salary);
    
  };

  currencyConverterHandler = amount => {
    const url = process.env.REACT_APP_CURRENCY_API_URL;
    const params = {
      from: "USD",
      to: "BRL",
      type: "annual",
      amount: amount
    };
    const queryString = new URLSearchParams(params).toString();
    Axios.get(`${url}/salary/calculator?${queryString}`).then(response => {
      this.setState({
        annual: response.data.annual_salary,
        monthly: response.data.monthly_salary,
        converted: response.data.converted_salary,
        calculated: response.data.calculated_salary
      });
    });
  };

  render() {
    return (
      <React.Fragment>
        <CssBaseline>
          <div className="App">
            <NavBar />
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <TextField
                  label="Salary Annual Value"
                  onChange={this.handleChange}
                  id="formatted-numberformat-input"
                  InputProps={{
                    inputComponent: NumberFormatCustom
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleCalculate}
                >
                  Calculate
                </Button>
              </Grid>
              <Grid item xs={12}>
                <label>Salary Monthly: </label><NumberFormat
                  value={this.state.monthly}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={"$"}
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </Grid>
              <Grid item xs={12}>
                <label>Salary Converted to: </label><NumberFormat
                  value={this.state.converted}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={"R$"}
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </Grid>
              <Grid item xs={12}>
                <label>Brazilian Salary: </label><NumberFormat
                  value={this.state.calculated}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={"R$"}
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </Grid>
            </Grid>
          </div>
        </CssBaseline>
      </React.Fragment>
    );
  }
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default App;
