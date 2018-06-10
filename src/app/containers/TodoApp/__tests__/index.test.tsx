import { mount, ReactWrapper } from "enzyme";
import { createMemoryHistory } from "history";
import { Provider } from "mobx-react";
import * as React from "react";
import { Route, Router, Switch } from "react-router";

import { Footer, TodoItem, TodoList } from "app/components";
import Root from "app/containers/Root";
import { TodoModel } from "app/models";
import { createStores } from "app/stores";
import TodoApp from "../";

it("renders without crashing", () => {
  // default fixtures for TodoStore
  const defaultTodos = [
    new TodoModel("Use Mobx"),
    new TodoModel("Use React", true),
  ];

  // prepare MobX stores
  const history = createMemoryHistory();
  const rootStore = createStores(history, defaultTodos);

  const app = mount(
    <Provider {...rootStore}>
      <Root>
        <Router history={history}>
          <Switch>
            <Route path="/" component={TodoApp} />
          </Switch>
        </Router>
      </Root>
    </Provider>,
  );

  // Mark the task "Use Mobx" as complete.
  toggleTask(app, "Use Mobx");
  expect(isTaskCompleted(app, "Use Mobx")).toBe(true);
  expect(numberOfTasksLeft(app)).toBe(0);

  // Mark the task "Use React" as incomplete.
  toggleTask(app, "Use React");
  expect(isTaskCompleted(app, "Use React")).toBe(false);
  expect(numberOfTasksLeft(app)).toBe(1);

  // Toggle all tasks.
  toggleAllTasks(app);
  expect(isTaskCompleted(app, "Use Mobx")).toBe(true);
  expect(isTaskCompleted(app, "Use React")).toBe(true);
  expect(numberOfTasksLeft(app)).toBe(0);

  // Toggle all tasks again.
  toggleAllTasks(app);
  expect(isTaskCompleted(app, "Use Mobx")).toBe(false);
  expect(isTaskCompleted(app, "Use React")).toBe(false);
  expect(numberOfTasksLeft(app)).toBe(2);
});

function toggleTask(app: ReactWrapper, text: string) {
  const wrapper = app.findWhere(
    node => node.type() === TodoItem && node.prop("todo").text === text,
  );
  expect(wrapper.length).toBe(1);
  const checkbox = wrapper.find({ type: "checkbox" });
  checkbox.simulate("change", {
    target: {
      checked: !checkbox.props().checked,
    },
  });
}

function toggleAllTasks(app: ReactWrapper) {
  const wrapper = app.find(TodoList);
  expect(wrapper.length).toBe(1);
  const checkbox = wrapper.find({ type: "checkbox" }).first();
  checkbox.simulate("change", {
    target: { checked: !checkbox.props().checked },
  });
}

function isTaskCompleted(app: ReactWrapper, text: string) {
  const wrapper = app.findWhere(
    node => node.type() === TodoItem && node.prop("todo").text === text,
  );
  expect(wrapper.length).toBe(1);
  return wrapper.find({ type: "checkbox" }).props().checked;
}

function numberOfTasksLeft(app: ReactWrapper) {
  const wrapper = app.find(Footer);
  expect(wrapper.length).toBe(1);
  const text = wrapper.find("strong").text();
  if (text === "No") {
    return 0;
  }
  return Number(text);
}
