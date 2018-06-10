import { inject, observer } from "mobx-react";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import Footer from "app/components/Footer";
import Header from "app/components/Header";
import TodoList from "app/components/TodoList";
import {
  STORE_ROUTER,
  STORE_TODO,
  TODO_FILTER_LOCATION_HASH,
  TodoFilter,
} from "app/constants";
import { RouterStore, TodoStore } from "app/stores";
import * as style from "./style.css";

interface TodoAppProps extends RouteComponentProps<{}> {
  [STORE_ROUTER]: RouterStore;
  [STORE_TODO]: TodoStore;
}

interface TodoAppState {
  filter: TodoFilter;
}

@inject(STORE_TODO, STORE_ROUTER)
@observer
export default class TodoApp extends React.Component<
  TodoAppProps,
  TodoAppState
> {
  constructor(props: TodoAppProps, context?: any) {
    super(props, context);
    this.state = { filter: TodoFilter.ALL };
  }

  public componentWillMount() {
    this.checkLocationChange();
  }

  public componentWillReceiveProps() {
    this.checkLocationChange();
  }

  public render() {
    const todoStore = this.props[STORE_TODO];
    const { children } = this.props;
    const { filter } = this.state;
    const filteredTodos = this.getFilteredTodo(filter);
    const allCompleted = todoStore.activeTodos.length === 0;
    const hasTasks = todoStore.todos.length > 0;

    return (
      <div className={style.normal}>
        <Header addTodo={todoStore.addTodo} />
        {todoStore.todos.length ? (
          <TodoList
            allCompleted={allCompleted}
            hasTodos={hasTasks}
            filteredTodos={filteredTodos}
            deleteTodo={todoStore.deleteTodo}
            editTodo={todoStore.editTodo}
            toggleAll={todoStore.toggleAll}
          />
        ) : null}
        {todoStore.todos.length ? (
          <Footer
            filter={filter}
            activeCount={todoStore.activeTodos.length}
            completedCount={todoStore.completedTodos.length}
            onClearCompleted={todoStore.clearCompleted}
            onChangeFilter={this.handleFilter}
          />
        ) : null}
        {children}
      </div>
    );
  }

  public checkLocationChange = () => {
    const router = this.props[STORE_ROUTER];
    const filter = Object.keys(TODO_FILTER_LOCATION_HASH)
      .map(key => Number(key) as TodoFilter)
      .find(f => TODO_FILTER_LOCATION_HASH[f] === router.location.hash);
    if (filter !== undefined) {
      this.setState({ filter });
    }
  };

  private getFilteredTodo = (filter: TodoFilter) => {
    const todoStore = this.props[STORE_TODO];
    switch (filter) {
      case TodoFilter.ACTIVE:
        return todoStore.activeTodos;
      case TodoFilter.COMPLETED:
        return todoStore.completedTodos;
      default:
        return todoStore.todos;
    }
  };

  private handleFilter = (filter: TodoFilter) => {
    const router = this.props[STORE_ROUTER];
    const currentHash = router.location.hash;
    const nextHash = TODO_FILTER_LOCATION_HASH[filter];
    if (currentHash !== nextHash) {
      router.replace(nextHash);
    }
  };
}
