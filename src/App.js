import { Button, Col, Row } from 'antd';
import Axios from "axios";
import React, { Component } from "react";
import NumberFormat from "react-number-format";
import "./App.css";
import Header from "./components/Header/Header";
import NavBar from "./components/Navbar/Navbar";

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
      console.log('response', response);
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
          <div className="App">
            <Header>
            <NavBar />
            </Header>
              <Row gutter={[0,16]}>
                <Col span={24}>
                <NumberFormat
                  className="ant-input"
                  style={{width: '15em'}}
                  placeholder="Enter your salary"
                  getInputRef = {(el) => this.inputElem = el}
                  onValueChange={values => {
                    this.handleChange({
                      target: {
                        value: values.value
                      }
                    });
                  }}
                  thousandSeparator
                  prefix="$"
                />
                </Col>
              </Row>
              <Row gutter={[0,16]}>
                <Col span={24}>
                <Button
                  className="calculate-btn"
                  onClick={this.handleCalculate}
                >
                  Calculate
                </Button>
                </Col>
              </Row>
              <Row gutter={[0,24]}>
                <Col span={24}>
                <label>Salary Monthly: </label><NumberFormat
                value={this.state.monthly}
                thousandSeparator={true}
                displayType={"text"}
                prefix={"$"}
                decimalScale={2}
                fixedDecimalScale={true}
              />
              <p></p>
              <label>Salary Converted to: </label><NumberFormat
                value={this.state.converted}
                thousandSeparator={true}
                displayType={"text"}
                prefix={"R$"}
                decimalScale={2}
                fixedDecimalScale={true}
              />
              <p></p>
              <label>Brazilian Salary: </label><NumberFormat
                value={this.state.calculated}
                thousandSeparator={true}
                displayType={"text"}
                prefix={"R$"}
                decimalScale={2}
                fixedDecimalScale={true}
              />
                </Col>
              </Row>
          </div>
      </React.Fragment>
    );
  }
}



export default App;
