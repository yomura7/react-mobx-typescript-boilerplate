import * as React from "react";

import TodoItem, { TodoActions } from "app/components/TodoItem";
import TodoModel from "app/models/TodoModel";
import * as style from "./style.css";

interface Props extends TodoActions {
  allCompleted: boolean;
  filteredTodos: TodoModel[];
  hasTodos: boolean;
  toggleAll: () => void;
}

export default class TodoList extends React.Component<Props> {
  constructor(props: Props, context?: any) {
    super(props, context);
  }

  public render() {
    const { filteredTodos, ...actions } = this.props;
    return (
      <section className={style.main}>
        {this.renderToggleAll()}
        <ul className={style.normal}>
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} {...actions} />
          ))}
        </ul>
      </section>
    );
  }

  private renderToggleAll = () => {
    const { allCompleted, hasTodos } = this.props;
    if (hasTodos) {
      return (
        <input
          className={style.toggleAll}
          type="checkbox"
          checked={allCompleted}
          onChange={this.handleToggleAll}
        />
      );
    }
    return null;
  };

  private handleToggleAll = () => {
    this.props.toggleAll();
  };
}
