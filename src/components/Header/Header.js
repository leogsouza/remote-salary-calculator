import React from 'react'
import './Header.css'

const Header = (props) => (
  <header id="header">
    {props.children}
  </header>
)

export default Header