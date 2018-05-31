const baseUrl = 'https://my-maintenance-tracker.herokuapp.com/api/v1';
const token = `Bearer ${localStorage.token}`;
const userPage = document.getElementById('user-page');
const createRequestForm = document.getElementById('form-create-request');

/*
* Appends request data to user request display Table
*
* @param {object} data - The request to be displayed on the table
*/
const append = (data) => {
  const newTableBody = document.createElement('tbody');
  data.forEach((request) => {
    const newRow = document.createElement('tr');
    const cellId = newRow.insertCell(0);
    const cellTitle = newRow.insertCell(1);
    const cellDate = newRow.insertCell(2);
    const cellStatus = newRow.insertCell(3);
    const cellDetails = newRow.insertCell(4);
    cellId.innerHTML = request.id;
    cellTitle.innerHTML = request.title;
    cellDate.innerHTML = new Date(request.createdat).toLocaleString('en-GB', { hour12: true });
    cellStatus.innerHTML = request.status;
    cellDetails.innerHTML = `<button class="ch-btn-view" onclick="getRequest(${request.id})">View</button>`;
    newTableBody.append(newRow);
  });
  const Table = document.getElementById('user-table');
  Table.removeChild(Table.lastChild);
  return Table.append(newTableBody);
};

/*
* Displays information from a single user request on the view request modal
*
* @param {object} data - The request to be displayed on the request modal
*/
const display = (data) => {
  document.getElementById('displayTitle').innerText = data.title;
  document.getElementById('displayType').innerText = data.type;
  document.getElementById('displayDescription').innerText = data.description;
  document.getElementById('displayStatus').innerText = data.status;
  document.getElementById('displayDate').innerText = new Date(data.createdat).toLocaleString('en-GB', { hour12: true });
  toggleModal('view-request');
};

/*
* Fetches the request of the logged in user
*/
const getRequests = () => {
  fetch(`${baseUrl}/users/requests`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    cache: 'reload',
  })
  .then(res => res.json()).then((res) => {
    if (res.code === 200) {
      append(res.data);
    }
      // displayAlert(res.message);
      if (res.code === 401) {
        setTimeout(() => {
          window.location.replace('signin.html');
        }, 3000);
      }
    })
  .catch((err) => {
    displayAlert(err.message);
  });
};

/*
* Gets the details of a single user object
*
* @param {number} data - The id of the request to be fetched
*/
const getRequest = (requestId) => {
  fetch(`${baseUrl}/users/requests/${requestId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': token },
    cache: 'reload'
  })
  .then(response => response.json())
  .then((response) => {
    if (response.code === 200) {
      display(response.data[0]);
    } else {
      display(response.message)
    }
  })
  .catch((error) => {
    displayAlert(error.message, 3);
  })
};

/*
* Adds an eventListener with a callback to POST user request inputs
*
* @param {object} submitEvent - The submitEvent
*/
createRequestForm.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();
  const title = document.getElementById('title').value;
  const type = document.getElementById('type').value;
  const description = document.getElementById('description').value;

  fetch(`${baseUrl}/users/requests`, {
    method: 'POST',
    body: JSON.stringify({ title, type, description }),
    headers: { 'Content-Type': 'application/json', Authorization: token },
  })
  .then(response => response.json())
  .then((response) => {
    if (response.code === 201) {
      displayAlert(response.message);
      toggleModal('add-request');
      setTimeout(() => getRequests(), 1000);
    } else {
      displayAlert(response.message);
      toggleModal('add-request');
    }
  }).catch((error) => {
    displayAlert(error.message);
    toggleModal('add-request');
  });
});

userPage.addEventListener('load', getRequests());
