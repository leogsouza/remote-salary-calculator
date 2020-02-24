import { Col, Row } from 'antd';
import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <Row className="row">
      <Col xs={12}>
      <h2 className="title"><a href="/">Remote Salary Job</a></h2>
      </Col>
    </Row>
  )
};

export default Navbar;