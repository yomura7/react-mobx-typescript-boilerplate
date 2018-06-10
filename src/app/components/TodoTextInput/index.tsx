import * as classNames from "classnames";
import * as React from "react";

import * as style from "./style.css";

interface Props {
  text?: string;
  placeholder?: string;
  newTodo?: boolean;
  editing?: boolean;
  onSave: (text: string) => void;
}

interface State {
  text: string;
}

export default class TodoTextInput extends React.Component<Props, State> {
  private readonly inputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props, context?: any) {
    super(props, context);
    this.state = {
      text: this.props.text || "",
    };
  }

  public render() {
    const classes = classNames(
      {
        [style.edit]: this.props.editing,
        [style.new]: this.props.newTodo,
      },
      style.normal,
    );

    return (
      <input
        className={classes}
        type="text"
        autoFocus={true}
        placeholder={this.props.placeholder}
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
        ref={this.inputRef}
      />
    );
  }

  private handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.which === 13 && this.inputRef.current) {
      const text = this.inputRef.current.value;
      this.props.onSave(text);
      if (this.props.newTodo) {
        this.setState({ text: "" });
      }
    }
  };

  private handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.setState({ text: e.target.value });
  };

  private handleBlur: React.FocusEventHandler<HTMLInputElement> = e => {
    const text = e.target.value.trim();
    if (!this.props.newTodo) {
      this.props.onSave(text);
    }
  };
}
