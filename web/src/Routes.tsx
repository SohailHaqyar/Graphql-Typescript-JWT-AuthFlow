import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Hi, Home, Login, Register } from "./pages";

export const Routes = () => {
  return (
    <Router>
      <>
        <div>
          <Link to="/">Home</Link>
          <br />
          <Link to="/register">Register</Link>
          <br />
          <Link to="/login">Login</Link>
          <br />
          <Link to="/hi">Hi</Link>
        </div>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/hi" exact component={Hi} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </Switch>
      </>
    </Router>
  );
};
