let table = document.querySelector('.main-table tbody');

function getNextDate(){
	let tr = table.children[0];

	if(tr.children.length === 2){
		return new Date('December 5, 2022 00:00:00');
	}
	
	let lastChild = tr.children[tr.children.length - 1];
	
	let lastDate = new Date(parseInt(lastChild.getAttribute('data-time')));
	let acceptedDays = [1, 3, 5, 6];
	let nextAcceptedDay = acceptedDays[0];
	
	for(let weekDay of acceptedDays) {

		if(weekDay > lastDate.getDay()) {
			nextAcceptedDay = weekDay;
			break;
		}
	}
	
	let nextDate = new Date(lastDate.getTime());
	nextDate.setDate(lastDate.getDate() + (nextAcceptedDay + 7 - lastDate.getDay()) % 7);

	return nextDate;
}

window.addEventListener('DOMContentLoaded', () => {
	
	const form = document.querySelector('.new-student-form');
	const input = document.querySelector('.input-student');
	const table = document.querySelector('tbody');
	
	form.addEventListener('click', (e) => {
	  e.preventDefault(); 
	  
	  const studentName = input.value.trim();
	
	  if (!studentName) {
		alert('Please enter a student Name and Surname.');
		return;
	  }
	
	  
	  const row = document.createElement('tr');
	  
	  const nameCell = document.createElement('td');
	  const nameInput = document.createElement('input');
	  nameInput.classList.add("input-style");
	  nameInput.type = 'text';
	  nameInput.value = studentName;
	  nameInput.readOnly = true;
	  nameCell.appendChild(nameInput);
	  row.appendChild(nameCell);
	  
	  const averageCell = document.createElement('td');
	  averageCell.classList.add('average');
	  averageCell.textContent = '0.00';
	  row.appendChild(averageCell);
	  
	  const editButton = document.createElement('button');
	  editButton.classList.add('edit');
	  editButton.innerHTML = 'EDT';
	  nameCell.appendChild(editButton);
	  
	  const deleteButton = document.createElement('button');
	  deleteButton.classList.add('delete');
	  deleteButton.innerHTML = 'DLT';
	  nameCell.appendChild(deleteButton);
	  
	  table.appendChild(row);
	
	  input.value = '';
	  
	  editButton.addEventListener('click', () => {
		if (editButton.innerText === 'EDT') {
		  nameInput.removeAttribute("readonly");
		  nameInput.focus();
		  editButton.innerText = 'Save';
		} else {
		  nameInput.setAttribute("readonly", "readonly");
		  editButton.innerHTML = 'EDT';
		}
	  });
	  
	  deleteButton.addEventListener('click', () => {
		row.remove();
	  });
	});
  });
  

document.querySelector('.btn-add-day').addEventListener('click', function(){
	let nextDate = getNextDate();
	let parts = nextDate.toDateString().split(' ');
	parts.pop();

	let title = parts[0] + ' ' + parts[2] + ' ' + parts[1];
	
	let td = document.createElement('td');
	td.innerHTML = title;
	td.setAttribute('data-time', nextDate.getTime());
	
	table.children[0].appendChild(td);

	for(let i = 1; i < table.children.length; i++) {
		td = document.createElement('td');
		td.innerHTML = 0;
		td.setAttribute('score-box', 1);
		td.setAttribute('class', 'red');

		table.children[i].appendChild(td);
	}

	updateStatistic();
});

document.querySelector('.btn-remove-day').addEventListener('click', function(){
	if(table.children[0].children.length > 2) {
		for(let i = 0; i < table.children.length; i++) {
			let tr = table.children[i];
			
			tr.removeChild(tr.children[tr.children.length - 1]);
		}

		updateStatistic();
	}
});

table.addEventListener('click', function(event){
	if(event.target.hasAttribute('score-box')) {
		let point;
		let td = event.target;
		do {
			let promptValue = prompt('Enter point');

			if (promptValue === null) {
				return;
			}

			point = parseInt(promptValue);
		} while (isNaN(point));

		if(point > 5) {
			point = 5;
		}

		if(point < 0) {
			point = 0;
		}

		td.innerHTML = point;

		if(point > 0) {
			td.setAttribute('class', 'green');
		} 
		else {
			td.setAttribute('class', 'red');
		}

		updateStatistic();
	}
});

function updateStatistic(){

	let countDays = table.children[0].children.length - 2;

	document.querySelector('.statistic .total-days .value').innerHTML = countDays; 

	let countStudents = table.children.length - 1;

	document.querySelector('.statistic .total-students .value').innerHTML = countStudents;

	let missedLessons = 0;

	for(let i = 1; i < table.children.length; i++) {
		let tr = table.children[i];
		
		for(let j = 2; j < tr.children.length; j++) {
			if(tr.children[j].innerHTML == '0') {
				missedLessons++;
			}
		}
	}

	document.querySelector('.statistic .missed-lesson .value').innerHTML = missedLessons;

	let sum = 0;

	for(let i = 1; i < table.children.length; i++) {
		let tr = table.children[i];
		
		sum += parseFloat(tr.children[1].innerHTML);
	}

	let average = sum / countStudents;

	document.querySelector('.statistic .average-mark .value').innerHTML = average.toFixed(2);

	updateAverages();
}

function updateAverages(){
	for(let i = 1; i < table.children.length; i++) {
		let tr = table.children[i];
		
		if(tr.children.length === 2) {
			tr.children[1].innerHTML = '0.00';
			
			continue;
		}

		let sum = 0;

		for(let j = 2; j < tr.children.length; j++) {
			sum += parseFloat(tr.children[j].innerHTML);
		}

		let average = sum / (tr.children.length - 2);

		tr.children[1].innerHTML = average.toFixed(2);
	}
}