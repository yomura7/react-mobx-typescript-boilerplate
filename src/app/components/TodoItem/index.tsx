import * as classNames from "classnames";
import * as React from "react";

import TodoTextInput from "app/components/TodoTextInput";
import TodoModel from "app/models/TodoModel";
import * as style from "./style.css";

export interface TodoActions {
  editTodo: (id: number, data: Partial<TodoModel>) => void;
  deleteTodo: (id: number) => void;
}

interface Props extends TodoActions {
  todo: TodoModel;
}

interface State {
  editing: boolean;
}

export default class TodoItem extends React.Component<Props, State> {
  constructor(props: Props, context?: any) {
    super(props, context);
    this.state = { editing: false };
  }

  public render() {
    const { todo } = this.props;

    const element = this.state.editing ? (
      <TodoTextInput
        text={todo.text}
        editing={this.state.editing}
        onSave={this.saveTodo}
      />
    ) : (
      <div className={style.view}>
        <input
          className={style.toggle}
          type="checkbox"
          checked={todo.completed}
          onChange={this.handleToggleCheckbox}
        />
        <label onDoubleClick={this.handleDoubleClick}>{todo.text}</label>
        <button
          className={style.destroy}
          onClick={this.handleClickDeleteButton}
        />
      </div>
    );

    const classes = classNames({
      [style.completed]: todo.completed,
      [style.editing]: this.state.editing,
      [style.normal]: !this.state.editing,
    });

    return <li className={classes}>{element}</li>;
  }

  private handleDoubleClick: React.MouseEventHandler<HTMLLabelElement> = () => {
    this.setState({ editing: true });
  };

  private handleToggleCheckbox: React.ChangeEventHandler<
    HTMLInputElement
  > = e => {
    const { todo } = this.props;
    const { target } = e;
    if (
      target &&
      target.checked !== undefined &&
      target.checked !== todo.completed
    ) {
      this.updateTodo({ completed: target.checked });
    }
  };

  private handleClickDeleteButton: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    const { todo, deleteTodo } = this.props;
    deleteTodo(todo.id);
  };

  private updateTodo = (data: Partial<TodoModel>) => {
    const { todo } = this.props;
    if (data.text !== undefined && data.text.trim().length === 0) {
      this.props.deleteTodo(todo.id);
    } else {
      this.props.editTodo(todo.id, data);
    }
    this.setState({ editing: false });
  };

  private saveTodo = (text: string) => {
    this.updateTodo({ text });
  };
}
