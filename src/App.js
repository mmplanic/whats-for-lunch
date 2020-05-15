import React from 'react';
import './App.css';
import './CustomStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import LogIn from './components/Login/Login';
import Home from './components/Home/Home';
import CreatePoll from './components/CreatePoll/CreatePoll';
import Poll from './components/Poll/Poll';
import Order from './components/Order/Order';
import {authService} from './services/auth.service';
import Statistics from './components/Statistics/Statistics';
import Settings from './components/Settings/Settings';


export default function App() {
  return (
    <BrowserRouter>
    <Switch>      
      <PublicRoute component={LogIn} path="/login" />
      <PrivateRoute component={Home} path="/home" />
      <PrivateRoute component={CreatePoll} path="/createpoll" />
      <PrivateRoute component={Statistics} path="/stats" />
      <PrivateRoute component={Settings} path="/settings" />

      <PublicRoute component={Poll} path="/poll/:id" />
      <PublicRoute component={Order} path="/order/:id" />
     {/* <Route exact path="/orders" component={Orders}></Route>
      <Route exact path="/settings" component={Settings}></Route>
      
      <Route exact path="/results" component={PollResults}></Route>
      <Route exact path="/orderID" component={Order}></Route> */}
      <Redirect to={authService.isLoged()?"/home":"/login"} />      
      </Switch>
  </BrowserRouter>
  );
}

