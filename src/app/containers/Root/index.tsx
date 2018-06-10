import * as React from "react";

export default class Root extends React.Component {
  public render() {
    return (
      <div className="container">
        {this.props.children}
        {this.renderDevTool()}
      </div>
    );
  }

  private renderDevTool = () => {
    if (process.env.NODE_ENV !== "production") {
      const DevTools = require("mobx-react-devtools").default;
      return <DevTools />;
    }
    return null;
  };
}
