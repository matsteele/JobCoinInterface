import React, { useState } from "react";
import ReactDOM from "react-dom";
import LogIn from "./components/log_in";
import Dashboard from "./components/dashboard";
import { Global, css } from "@emotion/core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { StoreProvider } from "./store/store";

export default function App(): JSX.Element {
  return (
    <StoreProvider>
      <Global styles={globalStyles} />
      <Router>
        <Route exact path="/" component={LogIn} />
        <Route path="/dashboard" component={Dashboard} />
      </Router>
    </StoreProvider>
  );
}

//styles
import styleUtils from "utils/styles";
const globalStyles = css`
  body {
    background-color: ${styleUtils.basicGray};
    display: flex;
    height: 100vh;
    justify-content: center;
  }
`;

//render
const root = document.getElementById("app-root");
ReactDOM.render(<App />, root);
