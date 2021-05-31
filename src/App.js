import { Button, Col, Row, Radio, InputNumber, Select } from 'antd';
import Axios from "axios";
import React, { useState } from "react";
import NumberFormat from "react-number-format";

import "./App.css";
import Header from "./components/Header/Header";
import NavBar from "./components/Navbar/Navbar";

import currencyList from './currencyList';

const { Option } = Select;
const locale = 'en-us';
const currencyOptions = currencyList.data.map(c => ({
  label: c.name,
  value: c.code,
  symbol: c.symbol
}));



const App = () => {
  const [value, setValue] = useState(0);
  const [annual, setAnnual] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [converted, setConverted] = useState(0);
  const [calculated, setCalculated] = useState(0);
  const [type, setType] = useState('annual');
  const [hours, setHours] = useState(8)
  const [showHours, setShowHours] = useState(false);
  const [currency, setCurrency] = useState(currencyOptions[0].value);
  const [currencySymbol, setCurrencySymbol] = useState(currencyOptions[0].symbol);

  const handleTypeChange = event => {
    setType(event.target.value);
    if (event.target.value === 'hourly')
      setShowHours(true)
    else
      setShowHours(false)
  };

  const handleCurrencyChange = currency => {
    
    const currencyOpt = currencyOptions.find(c => c.value === currency);
    if (currencyOpt) {
      setCurrencySymbol(currencyOpt.symbol);
      setCurrency(currency)
    }
  }

  const handleCalculate = () => {
    currencyConverterHandler(value);    
  };

  const handleHoursChange = value => {
    setHours(value)
  }


  const currencyFormatter = selectedCurrency => value =>{
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: selectedCurrency
    }).format(value);
  }
  
  const currencyParser = val => {
    try {
      if (typeof val === 'string' && !val.length) {
        val = '0.0';
      }
  
      let group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
      let decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
      let reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
      reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
  
      reversedVal = reversedVal.replace(/[^0-9.]/g, "");
  
      let digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
      const needsDigitsAppend = digitsAfterDecimalCount > 2;
  
      if (needsDigitsAppend) {
        reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount -2);
      }

      if (digitsAfterDecimalCount === 1) {
        reversedVal = reversedVal / 10;
        digitsAfterDecimalCount++;
      }
      
      setValue(reversedVal);
      return Number.isNaN(reversedVal) ? 0 : reversedVal;
  
    } catch (error) {
      console.log(error);
    }
  };

  const currencyConverterHandler = amount => {
    const url = process.env.REACT_APP_CURRENCY_API_URL;
    const params = {
      from: currency,
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
              <Col span={24}>
                <Select
                  showSearch
                  value={currency}
                  style={{ width: '7rem', marginTop: '1rem',  marginRight: '1rem'}}
                  onChange={handleCurrencyChange}
                >
                  {currencyOptions.map(opt => (
                    <Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
                <InputNumber
                  defaultValue={null}
                  style={{width: '15em'}}
                  formatter={currencyFormatter(currency)}
                  parser={currencyParser}
                />
              </Col>
              <Col span={24} style={{display: showHours ? 'block' : 'none' }}>
                <label>Hours per day: </label><InputNumber
                  placeholder="Hours por day"
                  defaultValue={8}
                  min={1} max={12} step={0.5} 
                  onChange={handleHoursChange}
                />
              </Col>
              <Col span={24}>
                <Button
                  className="calculate-btn"
                  onClick={handleCalculate}
                >
                  Calculate
                </Button>
              </Col>
              <Col span={24}>
                <label>Salary Annual: </label><NumberFormat
                  value={annual}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={currencySymbol}
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
                <p></p>
                <label>Salary Monthly: </label><NumberFormat
                  value={monthly}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={currencySymbol}
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
