const formInput = document.getElementById('task-name');
const btnAdd = document.querySelector('.form__button');
const taskList = document.querySelector('.tasks__list');
const delComplBtn = document.querySelector('.delComplBtn');

const darkTheme = document.querySelector('.theme-dark');
const lightTheme = document.querySelector('.theme-light');
const themeStyle = document.querySelector('link');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let draggableNode = null;

// saveToLocalStorege();
render();

// DATE

const curDate = new Date();
const dateContainer = document.querySelector('.header__date');

let options = {
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric',
};

let now = curDate.toLocaleString('en', options);
const datePar = dateContainer.querySelector('p');
datePar.append(now);

// LISTNERS
btnAdd.addEventListener('click', addTask);
taskList.addEventListener('click', delTask);
taskList.addEventListener('click', doneTask);
delComplBtn.addEventListener('click', delComplTasks);

darkTheme.addEventListener('click', drowDark);
lightTheme.addEventListener('click', drowLight);

// FUNCTIONS

function addTask(event) {
	event.preventDefault();
	if (!formInput.value) return;
	const taskText = formInput.value;

	const storageTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	};
	tasks.push(storageTask);
	saveToLocalStorege();

	formInput.value = '';
	formInput.focus();

	render();
}

function delTask(event) {
	event.preventDefault();
	if (event.target.classList.contains('button__del')) {
		const parent = event.target.closest('.tasks__item');

		const id = Number(parent.id);
		const index = tasks.findIndex((task) => task.id == id);
		tasks.splice(index, 1);
		saveToLocalStorege();

		parent.remove();
	}
}

function doneTask(event) {
	event.preventDefault();
	if (event.target.classList.contains('button__done')) {
		const parent = event.target.closest('.tasks__item');
		parent.classList.toggle('tasks__done');
		const id = Number(parent.id);
		const task = tasks.find((task) => task.id === id);
		task.done = !task.done;
		saveToLocalStorege();
	}
}

function delComplTasks(event) {
	event.preventDefault();
	if (delComplBtn) {
		const doneTasks = document.querySelectorAll('.tasks__done');
		doneTasks.forEach((item) => {
			const parent = item.closest('li');
			const id = Number(parent.id);
			const index = tasks.findIndex((task) => task.id === id);
			tasks.splice(index, 1);
			saveToLocalStorege();
			parent.remove();
		});
	}
}

function saveToLocalStorege() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
	localStorage.setItem('themeStyle', JSON.stringify(themeStyle.href));
}

function render() {
	while (taskList.firstChild) {
		taskList.removeChild(taskList.firstChild);
	}
	tasks.forEach((task) => renderTask(task));
	makeDraggable();
}

function renderTask(task) {
	themeStyle.href = JSON.parse(localStorage.getItem('themeStyle'));

	const cssClass = task.done ? 'tasks__item tasks__done' : 'tasks__item';
	const newTask = `
									<li id="${task.id}" class="${cssClass}" draggable="true">
										<div class="tasks__text">
											<span contenteditable="false">${task.text}</span>
										</div>
										<div class="tasks__buttons">
											<button class="button button__done">
												Done
												<ion-icon name="checkmark-circle-outline"></ion-icon>
											</button>
											<button class="button button__del">
												Del
											<ion-icon name="close-circle-outline" disabled></ion-icon>
											</button>
										</div>
									</li>
	`;
	taskList.insertAdjacentHTML('beforeend', newTask);
}

function drowDark(event) {
	event.preventDefault();
	themeStyle.href = './styles/themes/style-dark.css';
	saveToLocalStorege();
}
function drowLight(event) {
	event.preventDefault();
	themeStyle.href = './styles/style.css';
	saveToLocalStorege();
}

// DRAG&DROP

function dragStart(e) {
	this.classList.add('selected');
	draggableNode = this;
}

function dragEnd(e) {
	this.classList.remove(`selected`);
}

function dragDrop(e) {
	if (draggableNode.id === this.id) {
		return;
	}

	const draggableTaskIndex = tasks.findIndex(
		(task) => task.id == draggableNode.id
	);
	const targetTaskIndex = tasks.findIndex((task) => task.id == this.id);
	let target = tasks.splice(targetTaskIndex, 1, tasks[draggableTaskIndex])[0];
	tasks.splice(draggableTaskIndex, 1, target);
	draggableNode = null;
	saveToLocalStorege();
	render();
}

function makeDraggable() {
	document.querySelectorAll(`.tasks__item`).forEach((taskelement) => {
		taskelement.addEventListener('dragstart', dragStart);
		taskelement.addEventListener('dragover', (e) => e.preventDefault());
		taskelement.addEventListener('dragend', dragEnd);
		taskelement.addEventListener('drop', dragDrop);
	});
}
