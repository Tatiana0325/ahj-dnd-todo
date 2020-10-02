export default class Model {
  constructor() {
    this.todo = [];
    this.inProgress = [];
    this.done = [];
  }

  addCard(card, count) {
    if (count === "todo") {
      this.todo.push(card);
    }

    if (count === "in-progress") {
      this.inProgress.push(card);
    }

    if (count === "done") {
      this.done.push(card);
    }
  }

  deleteCard(id, count) {
    if (count === "todo") {
      this.todo = this.todo.filter((item) => item.id !== id);
    }

    if (count === "in-progress") {
      this.inProgress = this.inProgress.filter((item) => item.id !== id);
    }

    if (count === "done") {
      this.done = this.done.filter((item) => item.id !== id);
    }
  }

  addChCard(lastCard, newCard, count) {
    if (count === "todo") {
      let card = this.todo.find(
        (item) => item.id === lastCard.id && item.title === lastCard.title
      );
      let inT = this.todo.indexOf(card);
      this.todo.splice(inT, 0, newCard);
    }

    if (count === "in-progress") {
      let card = this.inProgress.find(
        (item) => item.id === lastCard.id && item.title === lastCard.title
      );
      let inP = this.inProgress.indexOf(card);
      this.inProgress.splice(inP, 0, newCard);
    }

    if (count === "done") {
      let card = this.done.find(
        (item) => item.id === lastCard.id && item.title === lastCard.title
      );
      let inD = this.done.indexOf(card);
      this.done.splice(inD, 0, newCard);
    }
  }

  getTodo() {
    return this.todo;
  }

  getInProgress() {
    return this.inProgress;
  }

  getDone() {
    return this.done;
  }
}
