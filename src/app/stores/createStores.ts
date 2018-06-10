import { History } from "history";

import { STORE_ROUTER, STORE_TODO } from "app/constants";
import { TodoModel } from "app/models";
import RouterStore from "./RouterStore";
import TodoStore from "./TodoStore";

export default function createStores(
  history: History,
  defaultTodos: TodoModel[],
) {
  const routerStore = new RouterStore(history);
  const todoStore = new TodoStore(defaultTodos);
  return {
    [STORE_ROUTER]: routerStore,
    [STORE_TODO]: todoStore,
  };
}
