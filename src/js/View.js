export default class View {
  constructor() {
		this.deleteTask = null;
    this.board = documetn.querySelector('.container');
    this.addCard = null;
    this.draggedEl = null;
    this.ghostEl = null;
    this.board = null;
    this.shiftX = null;
    this.shiftY = null;
    this.addListenerShowAndDel = this.addListenerShowAndDel.bind(this);
    this.addListenerAddCard = this.addListenerAddCard.bind(this);
    this.listener = this.listener.bind(this);
    this.addListenerDnd = this.addListenerDnd.bind(this);
    this.down = this.down.bind(this);
    this.move = this.move.bind(this);
    this.up = this.up.bind(this);
  }

  addListenerDnd() {
    this.board = document.querySelector('.app');
    this.board.addEventListener('mousedown', this.down);
    this.board.addEventListener('mousemove', this.move);
    this.board.addEventListener('mouseup', this.up);
  }

  up(event) {
    if (!this.draggedEl) {
      return;
    }
    const area = document.elementFromPoint(event.clientX, event.clientY);
    if (area.classList.contains('tasks') || area.closest('.tasks')) {
      area.closest('.tasks').appendChild(this.draggedEl);
      this.draggedEl.style.cursor = 'auto';
      this.draggedEl.classList.remove('dragged');
      this.draggedEl = null;
      this.shiftX = null;
      this.shiftY = null;
    } else {
      this.draggedEl.classList.remove('dragged');
      this.draggedEl.style.cursor = 'auto';
      this.draggedEl = null;
      this.shiftX = null;
      this.shiftY = null;
    }
  }

  move(event) {
    event.preventDefault();
    if (!this.draggedEl) {
      return;
    }
    this.draggedEl.style.left = `${event.pageX - this.shiftX}px`;
    this.draggedEl.style.top = `${event.pageY - this.shiftY}px`;
    this.draggedEl.style.cursor = 'grabbing';
  }
  /* eslint-disable */
  getCoords(elem) {
    const box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
    };
  }

  down(event) {
    event.preventDefault();
    if (event.target.classList.contains('textarea')) {
      event.target.focus();
      return;
    } if (!event.target.classList.contains('task')) {
      return;
    }
    this.draggedEl = event.target;

    this.draggedEl.classList.add('dragged');

    const coords = this.getCoords(this.draggedEl);
    this.shiftX = event.pageX - coords.left;
    this.shiftY = event.pageY - coords.top;
    this.draggedEl.style.left = `${event.pageX - this.shiftX}px`;
    this.draggedEl.style.top = `${event.pageY - this.shiftY}px`;
  }

  getMark(todo, progress, done) {
    this.app = document.createElement('div');
    this.app.classList.add('app');
    this.app.innerHTML = `
      <div class="todo block">
        <h4>TODO</h4>
        ${this.getTasks(todo).outerHTML}
        <div class="new-card">Add new card</div>
      </div>
      <div class="progress block">
        <h4>In progress</h4>
        ${this.getTasks(progress).outerHTML}
        <div class="new-card">Add new card</div>
      </div>
      <div class="done block">
        <h4>Done</h4>
        ${this.getTasks(done).outerHTML}
        <div class="new-card">Add new card</div>
      </div>
    `;
    this.container.appendChild(this.app);
  }

  listener(event) {
    this.showForm(event);
    if (event.target.classList.contains('delete-task')) {
      const parent = event.target.closest('.block');
      this.deleteTask(Number(event.target.id), parent.classList[0]);
    }
  }

  addListenerShowAndDel() {
    this.container.addEventListener('click', this.listener);
  }

  getTasks(data) {
    const tasts = document.createElement('div');
    tasts.classList.add('tasks');
    data.forEach((elem) => {
      const task = document.createElement('div');
      const deleteTask = document.createElement('div');
      task.classList.add('task');

      const tastText = document.createElement('div');
      tastText.textContent = elem.text;
      task.appendChild(tastText);
      deleteTask.classList.add('delete-task');
      deleteTask.id = elem.id;
      deleteTask.innerHTML = '&#10006';
      task.appendChild(deleteTask);

      tasts.appendChild(task);
    });
    return tasts;
  }

  showForm(event) {
    const { target } = event;
    if (target.classList.contains('new-card')) {
      const sibling = target.previousElementSibling;
      target.innerHTML = `
        <div class="footer">
            <button class="button">Add Card</button>
            <div>&#10006</div>
        </div>
      `;
      const newTask = document.createElement('textarea');
      newTask.placeholder = 'Enter a title for this card...';
      newTask.classList.add('textarea');
      sibling.appendChild(newTask);
      this.container.addEventListener('click', this.addListenerAddCard);
    }
  }

  addListenerAddCard(event) {
    if (event.target.classList.contains('button')) {
      const parent = event.target.closest('.block');
      const { value } = parent.querySelector('.textarea');
      this.addCard(event, value, parent);
    }
  }

  clear() {
    this.container.innerHTML = '';
  }
}