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
import nowEnv from 'now-env';

nowEnv.config();

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
    salary: 0,
    result: 0,
    converted: 0,
  };

  handleChange = event => {
    this.setState({
      salary: event.target.value
    });
  };

  handleValueChange = values => {
    const { formattedValue, value } = values;
    // formattedValue = $2,223
    // value ie, 2223
    console.log(value, formattedValue);
    this.setState({ salary: value });
  };

  handleCalculate = () => {
    const salary = this.state.salary;

    const result = salary / 12;

    this.setState({
      result: result
    });

    this.currencyConverterHandler(result);
  };

  currencyConverterHandler = amount => {
    const url = process.env.REACT_APP_CURRENCY_API_URL;
    console.log(process.env);
    const params = {
      base: "USD",
      symbols: "BRL"
    };
    Axios.get(`${url}/latest?${querystring.stringify(params)}`).then(response => {
      const {rates} = response.data;
      const currentRate = rates[params.symbols].toFixed(2);
      const valueConverted = (currentRate * amount).toFixed(2);
      console.log(currentRate, amount)

      this.setState({converted: valueConverted});

    }
    );
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
                <label>Salary calculated: </label><NumberFormat
                  value={this.state.result}
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
