import * as React from "react";

import TodoTextInput from "app/components/TodoTextInput";
import TodoModel from "app/models/TodoModel";

interface Props {
  addTodo: (todo: Partial<TodoModel>) => void;
}

export default class Header extends React.Component<Props> {
  public render() {
    return (
      <header>
        <h1>todos</h1>
        <TodoTextInput
          newTodo={true}
          onSave={this.handleSave}
          placeholder="What needs to be done?"
        />
      </header>
    );
  }

  private handleSave = (text: string) => {
    if (text.length) {
      this.props.addTodo({ text });
    }
  };
}
