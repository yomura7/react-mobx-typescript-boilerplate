import * as classNames from "classnames";
import * as React from "react";

import {
  TODO_FILTER_TITLES,
  TODO_FILTER_TYPES,
  TodoFilter,
} from "app/constants";
import * as style from "./style.css";

interface Props {
  filter: TodoFilter;
  activeCount: number;
  completedCount: number;
  onChangeFilter?: (filter: TodoFilter) => void;
  onClearCompleted?: () => void;
}

export default class Footer extends React.Component<Props> {
  public render() {
    return (
      <footer className={style.normal}>
        {this.renderTodoCount()}
        <ul className={style.filters}>
          {TODO_FILTER_TYPES.map(filter => (
            <li key={filter} children={this.renderFilterLink(filter)} />
          ))}
        </ul>
        {this.renderClearButton()}
      </footer>
    );
  }

  private renderTodoCount = () => {
    const { activeCount } = this.props;
    const itemWord = activeCount === 1 ? "item" : "items";

    return (
      <span className={style.count}>
        <strong>{activeCount || "No"}</strong> {itemWord} left
      </span>
    );
  };

  private renderFilterLink = (filter: TodoFilter) => {
    const title = TODO_FILTER_TITLES[filter];
    const { filter: selectedFilter } = this.props;
    const className = classNames({
      [style.selected]: filter === selectedFilter,
    });

    return (
      <a
        className={className}
        style={{ cursor: "pointer" }}
        onClick={this.handleClickFilterLink.bind(this, filter)}
      >
        {title}
      </a>
    );
  };

  private renderClearButton = () => {
    const { completedCount, onClearCompleted } = this.props;
    if (completedCount > 0) {
      return (
        <button className={style.clearCompleted} onClick={onClearCompleted} />
      );
    }
    return null;
  };

  private handleClickFilterLink = (filter: TodoFilter) => {
    const { onChangeFilter } = this.props;
    if (onChangeFilter) {
      onChangeFilter(filter);
    }
  };
}
