import React from 'react';
import { Link } from 'react-router-dom'
import {Navbar, Nav, Button} from 'react-bootstrap';
import {authService} from '../../services/auth.service';
import logo from './img/hamburger-icon.png';
import { appStorage } from '../../services/appStorage.service';




export default function NavBar({history}){
    const {pathname} = history.location;


    const handleLogOut = ()=>{
        authService.LogOut();
        history.push("/login");
    }
    return(


<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
<Link className="navbar-brand" to="/home">
      <img
        alt=""
        src={logo}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      Hunger
    </Link>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
        <Link className = {`nav-link ${pathname==="/home"?" active":""}`} to="/home">Home</Link>
        <Link className={`nav-link ${pathname==="/createpoll"?" active":""}`} to="/createpoll">Create poll</Link>
        <Link className={`nav-link ${pathname==="/restaurants"?" active":""}`} to="/restaurants">Restaurants</Link>
        <Link className={`nav-link ${pathname==="/stats"?" active":""}`} to="/stats">Statistics</Link>
        <Link className={`nav-link ${pathname==="/settings"?" active":""}`} to="/settings">Settings</Link>
    </Nav>
    <Nav>
        <label style={{color:'white', margin:"auto",marginRight:"10px"}}>{appStorage.getAdmin()}</label>
        <Button variant="outline-info" onClick={handleLogOut}>Log Out</Button>
    </Nav>
  </Navbar.Collapse>
</Navbar>
    )
}