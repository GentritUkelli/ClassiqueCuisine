import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Layout/Header";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Router>
      <Header />
    </Router>
  );
}

export default App;
