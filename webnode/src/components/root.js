import React from "react";
import Storage from "./storage/index";

class Root extends React.Component {
  render() {
    return (
      <div className="App">
        <Storage />
      </div>
    );
  }
}

export default Root;
