import { observable } from "mobx";

export default class TodoModel {
  private static nextId = 1;

  private static generateId() {
    return this.nextId++;
  }

  @observable public text: string;
  @observable public completed: boolean;
  public readonly id: number;

  constructor(text?: string, completed: boolean = false) {
    this.id = TodoModel.generateId();
    this.text = text || "";
    this.completed = completed;
  }
}
