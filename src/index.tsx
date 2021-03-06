import { createBrowserHistory } from "history";
import { configure } from "mobx";
import { Provider } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "app";
import { TodoModel } from "app/models";
import { createStores } from "app/stores";

// enable MobX strict mode
configure({
  enforceActions: true,
});

// default fixtures for TodoStore
const defaultTodos = [
  new TodoModel("Use Mobx"),
  new TodoModel("Use React", true),
];

// prepare MobX stores
const history = createBrowserHistory();
const rootStore = createStores(history, defaultTodos);

const root = document.createElement("div");
document.body.appendChild(root);

// render react DOM
ReactDOM.render(
  <Provider {...rootStore}>
    <App history={history} />
  </Provider>,
  root,
);
