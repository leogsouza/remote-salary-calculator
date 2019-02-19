import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from '@material-ui/core/Typography';
import classes from './Navbar.module.css';

const Navbar = () => {
  return (
    <div className={classes.Navbar}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Remote Salary Job
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
};

export default Navbar;