import Model from "./Model";

export default class Controller {
  constructor() {
    this.model = new Model();
    this.container = document.querySelector(".container");
    this.block = null;
    this.id = 0;
    this.board = null;
    this.shiftX = null;
    this.shiftY = null;
    this.addListenerDnd = this.addListenerDnd.bind(this);
    this.addListenerAdd = this.addListenerAdd.bind(this);
    this.addListenerMouseOverandOut = this.addListenerMouseOverandOut.bind(
      this
    );
    this.draggedEl = null;
  }

  start() {
    const todo = this.model.getTodo();
    const progress = this.model.getInProgress();
    const done = this.model.getDone();
    this.getMark(todo, progress, done);
    this.addListenerDnd();
    this.addListenerAdd();
    this.addListenerMouseOverandOut();
  }

  newCard(title, id) {
    const divCont = document.createElement("div");
    divCont.classList.add("new-card");
    divCont.setAttribute("id", id);
    divCont.innerHTML = `
		  <div class="new-card-title">
			  <div class="title">${title}</div>
			  <img src="./img/cross.png" alt="Removing" class="delete-card invisible">
		  </div>
	   `;

    return divCont;
  }

  getCont(data) {
    const cont = document.createElement("div");
    cont.classList.add("cont");

    data.forEach((item) => {
      cont.appendChild(this.newCard(item.title, item.id));
    });

    return cont;
  }

  getMark(todo, progress, done) {
    this.block = document.createElement("div");
    this.block.classList.add("block");
    this.block.innerHTML = `
      <div class="todo column">
        <div><h4>TODO</h4></div>
        ${this.getCont(todo).outerHTML}
        <div class="adding-card">
          <a href="" onclick="return false" class="add-card-title"><img src="./img/plus.png" alt="Adding" class="plus-card" />Add another card</a>
        </div>
      </div>

      <div class="in-progress column">
        <div><h4>IN PROGRESS</h4></div>
        ${this.getCont(progress).outerHTML}
        <div class="adding-card">
          <a href="" onclick="return false" class="add-card-title"><img src="./img/plus.png" alt="Adding" class="plus-card" />Add another card</a>
        </div>
      </div>

      <div class="done column">
        <div><h4>DONE</h4></div>
        ${this.getCont(done).outerHTML}
        <div class="adding-card">
          <a href="" onclick="return false" class="add-card-title"><img src="./img/plus.png" alt="Adding" class="plus-card" />Add another card</a>
        </div>
      </div>
    `;

    this.container.appendChild(this.block);
  }

  getCoords(elem) {
    const box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
    };
  }

  addListenerDnd() {
    this.board = document.querySelector(".block");

    this.board.addEventListener("mousedown", (event) => {
      event.preventDefault();
      if (
        event.target.classList.contains("title-card") ||
        event.target.classList.contains("delete-card")
      ) {
        event.target.focus();
        return;
      } else if (!event.target.closest(".new-card")) {
        return;
      }

      this.draggedEl = event.target.closest(".new-card");

      this.model.deleteCard(
        Number(this.draggedEl.getAttribute("id")),
        this.draggedEl.closest(".column").classList[0]
      );

      this.draggedEl.classList.add("dragged");

      const coords = this.getCoords(this.draggedEl);
      this.shiftX = event.pageX - coords.left;
      this.shiftY = event.pageY - coords.top;
      this.draggedEl.style.left = `${event.pageX - this.shiftX}px`;
      this.draggedEl.style.top = `${event.pageY - this.shiftY}px`;
    });

    this.board.addEventListener("mousemove", (event) => {
      event.preventDefault();
      if (!this.draggedEl) {
        return;
      }
      this.draggedEl.style.left = `${event.pageX - this.shiftX}px`;
      this.draggedEl.style.top = `${event.pageY - this.shiftY}px`;
      this.draggedEl.style.cursor = "grabbing";
    });

    this.board.addEventListener("mouseup", (event) => {
      event.preventDefault();
      if (!this.draggedEl) {
        return;
      }
      const area = document.elementFromPoint(event.clientX, event.clientY);
      const newCard = {
        title: this.draggedEl.querySelector(".title").textContent,
        id: this.id,
      };

      this.id++;

      if (
        area.classList.contains("cont") ||
        area.closest(".column").querySelector(".cont")
      ) {
        if (area.classList.contains(".new-card")) {
          area.closest(".cont").insertBefore(this.draggedEl, area);
          const lastCard = {
            title: area.querySelector(".title").textContent,
            id: Number(area.getAttribute("id")),
          };

          this.model.addChCard(
            lastCard,
            newCard,
            area.closest(".column").classList[0]
          );
        } else if (area.closest(".new-card") !== null) {
          area
            .closest(".cont")
            .insertBefore(this.draggedEl, area.closest(".new-card"));
          const lastCard = {
            title: area.closest(".new-card").querySelector(".title")
              .textContent,
            id: Number(area.closest(".new-card").getAttribute("id")),
          };

          this.model.addChCard(
            lastCard,
            newCard,
            area.closest(".column").classList[0]
          );
        } else {
          this.model.addCard(newCard, area.closest(".column").classList[0]);
        }
        this.draggedEl.style.cursor = "auto";
        this.draggedEl.classList.remove("dragged");
        this.draggedEl = null;
        this.shiftX = null;
        this.shiftY = null;
      } else {
        this.draggedEl.classList.remove("dragged");
        this.draggedEl.style.cursor = "auto";
        this.draggedEl = null;
        this.shiftX = null;
        this.shiftY = null;
      }

      this.container.innerHTML = "";
      this.start();
    });
  }

  addListenerAdd() {
    this.container.addEventListener("click", (event) => {
      //this.getMark(todo, progress, done);
      const { target } = event;
      target.innerHTML = `
          <div class=add-card-form>
            <input class="title-card" type="text" placeholder="Enter a title for this card...">
            <div class="button-cont">
              <button class="add-card">Add Card</button>
              <img src="./img/cross.png" alt="Clossing" class="closing-form">
            </div>
          </div>
        `;

      target.querySelector(".add-card").addEventListener("click", (event) => {
        event.preventDefault();

        const parent = event.target.closest(".column");
        const { value } = parent.querySelector(".title-card");

        if (value !== "") {
          const obj = {
            title: value,
            id: this.id,
          };

          this.model.addCard(obj, parent.classList[0]);
          this.id++;
          this.container.innerHTML = "";
          this.start();
        }
      });

      target.querySelector(".closing-form").addEventListener("click", () => {
        this.container.innerHTML = "";
        this.start();
      });
    });
  }

  addListenerMouseOverandOut() {
    this.container.addEventListener("mouseover", (event) => {
      const { target } = event;

      if (
        target.closest(".new-card") ||
        target.classList.contains("new-card")
      ) {
        const delEl = target.closest(".new-card").querySelector(".delete-card");
        delEl.classList.remove("invisible");

        delEl.addEventListener("click", () => {
          const parent = target.closest(".column");
          const el = delEl.closest(".new-card");
          this.model.deleteCard(
            Number(el.getAttribute("id")),
            parent.classList[0]
          );
          this.container.innerHTML = "";
          this.start();
        });
      }
    });

    this.container.addEventListener("mouseout", (event) => {
      const { target } = event;

      if (
        target.closest(".new-card") ||
        target.classList.contains("new-card")
      ) {
        const delEl = target.closest(".new-card").querySelector(".delete-card");
        delEl.classList.add("invisible");
      }
    });
  }
}
