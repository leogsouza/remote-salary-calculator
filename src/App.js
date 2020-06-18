import { Button, Col, Row, Radio, InputNumber } from 'antd';
import Axios from "axios";
import React, { useState } from "react";
import NumberFormat from "react-number-format";
import "./App.css";
import Header from "./components/Header/Header";
import NavBar from "./components/Navbar/Navbar";

const App = () => {
  const [value, setValue] = useState(0);
  const [annual, setAnnual] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [converted, setConverted] = useState(0);
  const [calculated, setCalculated] = useState(0);
  const [type, setType] = useState('annual');
  const [hours, setHours] = useState(8)
  const [showHours, setShowHours] = useState(false);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleTypeChange = event => {
    setType(event.target.value);
    if (event.target.value === 'hourly')
      setShowHours(true)
    else
      setShowHours(false)
  };

  const handleCalculate = () => {
    currencyConverterHandler(value);    
  };

  const handleHoursChange = value => {
    setHours(value)
  }

  const currencyConverterHandler = amount => {
    const url = process.env.REACT_APP_CURRENCY_API_URL;
    const params = {
      from: "USD",
      to: "BRL",
      type: type,
      amount: amount
    };

    if (type === 'hourly') {
      params['hours'] = hours
    }

    const queryString = new URLSearchParams(params).toString();
    Axios.get(`${url}/salary/calculator?${queryString}`).then(response => {
      setAnnual(response.data.annual_salary);
      setMonthly(response.data.monthly_salary);
      setConverted(response.data.converted_salary);
      setCalculated(response.data.calculated_salary);
    });
  };

  return (
    <React.Fragment>
        <div className="App">
          <Header>
          <NavBar />
          </Header>
            <Row gutter={[0,16]}>
              <Col span={24}>
                <Radio.Group defaultValue={type} value={type} onChange={handleTypeChange}>
                  <Radio.Button value="annual">Annual</Radio.Button>
                  <Radio.Button value="monthly">Monthly</Radio.Button>
                  <Radio.Button value="daily">Daily</Radio.Button>
                  <Radio.Button value="hourly">Hourly</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
            <Row gutter={[0,16]}>
              <Col span={24}>
              <NumberFormat
                className="ant-input"
                style={{width: '15em'}}
                placeholder="Enter your salary"
                // getInputRef = {(el) => this.inputElem = el}
                onValueChange={values => {
                  handleChange({
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
            <Row gutter={[0,16]} style={{display: showHours ? 'block' : 'none' }}>
              <Col span={24}>
                <label>Hours per day: </label><InputNumber
                  placeholder="Hours por day"
                  defaultValue={8}
                  min={1} max={12} step={0.5} 
                  onChange={handleHoursChange}
                />
              </Col>
            </Row>
            <Row gutter={[0,16]}>
              <Col span={24}>
              <Button
                className="calculate-btn"
                onClick={handleCalculate}
              >
                Calculate
              </Button>
              </Col>
            </Row>
            <Row gutter={[0,24]}>
              <Col span={24}>
              <label>Salary Monthly: </label><NumberFormat
              value={monthly}
              thousandSeparator={true}
              displayType={"text"}
              prefix={"$"}
              decimalScale={2}
              fixedDecimalScale={true}
            />
            <p></p>
            <label>Salary Converted to: </label><NumberFormat
              value={converted}
              thousandSeparator={true}
              displayType={"text"}
              prefix={"R$"}
              decimalScale={2}
              fixedDecimalScale={true}
            />
            <p></p>
            <label>Brazilian Salary: </label><NumberFormat
              value={calculated}
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

export default App;
