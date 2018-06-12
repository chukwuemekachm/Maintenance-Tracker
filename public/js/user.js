const baseUrl = 'https://my-maintenance-tracker.herokuapp.com/api/v1';
const token = `Bearer ${localStorage.token}`;
const userPage = document.getElementById('user-page');
const createRequestForm = document.getElementById('form-create-request');
const updateRequestForm = document.getElementById('form-update-request');
const filterBtn = document.getElementById('filter');
let userRequestsArr;
let currentRequestId;

/**
 * Changes the font color of the status on display, according to the status
 *
 * @param {String} status - The state of the request
 *
 * @returns {Object} - The span element that has been formated to fit the request state
 */
const formatStatus = (status) => {
  const statusElement = document.createElement('span');
  statusElement.textContent = status;
  statusElement.style.fontWeight = 'bold';
  switch (status) {
    case 'approved':
      statusElement.style.color = '#f39c12';
      break;
    case 'disapproved':
      statusElement.style.color = '#E74C3C';
      break;
    case 'resolved':
      statusElement.style.color = '#2ecc71';
      break;
    default:
      statusElement.style.color = '#3498db';
      break;
  }
  return statusElement;
};

/**
 * Disables or enables the update button of a request
 *
 * @param {Number} requestId - The id of the request, the button updates
 * @param {String} status - The status of the request, the button updates
 */
const formatUpdateBtn = (requestId, status) => {
  let updatebtn;
  if (status === 'pending') {
    updatebtn = `<button class="ch-btn-view" onclick="getRequest(${requestId},'update')"> <i class="icon ion-md-create"></i> </button>`;
  } else {
    updatebtn = '<button type="button" disabled class="ch-btn-view"> <i class="icon ion-md-create"></i> </button>';
  }
  return updatebtn;
};

/**
* Appends request data to user request display Table
*
* @param {object} data - The request to be displayed on the table
*/
const append = (data) => {
  const newTableBody = document.createElement('tbody');
  let counter = 1;
  data.forEach((request) => {
    const newRow = document.createElement('tr');
    const cellNo = newRow.insertCell(0);
    const cellTitle = newRow.insertCell(1);
    const cellDate = newRow.insertCell(2);
    const cellStatus = newRow.insertCell(3);
    const cellDetails = newRow.insertCell(4);
    const cellUpdate = newRow.insertCell(5);
    cellNo.innerHTML = counter;
    cellTitle.innerHTML = request.title;
    cellDate.innerHTML = new Date(request.createdat).toLocaleString('en-GB', { hour12: true });
    cellStatus.appendChild(formatStatus(request.status));
    cellDetails.innerHTML = `<button class="ch-btn-view" onclick="getRequest(${request.id},'preview')"> <i class="icon ion-md-albums"></i> </button>`;
    cellUpdate.innerHTML = formatUpdateBtn(request.id, request.status);
    newTableBody.append(newRow);
    counter += 1;
  });
  const Table = document.getElementById('user-table');
  Table.removeChild(Table.lastChild);
  return Table.append(newTableBody);
};

/**
* Displays information from a single user request on the view request modal
*
* @param {object} data - The request to be displayed on the request modal
*/
const displayPreview = (data) => {
  document.getElementById('displayTitle').innerText = data.title;
  document.getElementById('displayType').innerText = data.type;
  document.getElementById('displayDescription').innerText = data.description;
  document.getElementById('displayStatus').innerHTML = data.status;
  document.getElementById('displayDate').innerText = new Date(data.createdat).toLocaleString('en-GB', { hour12: true });
  toggleModal('view-request');
};

/**
* Displays information from a single user request on the update request modal
*
* @param {object} data - The request to be displayed on the request modal
*/
const displayUpdate = (data) => {
  currentRequestId = data.id;
  document.getElementById('updateTitle').value = data.title;
  document.getElementById('updateType').value = data.type;
  document.getElementById('updateDescription').value = data.description;
  toggleModal('update-request');
};

/**
* Fetches the request of the logged in user
*/
const getRequests = () => {
  fetch(`${baseUrl}/users/requests`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    cache: 'reload',
  })
    .then(res => res.json()).then((res) => {
      if (res.code === 200 && res.data) {
        userRequestsArr = res.data;
        append(res.data);
      } else {
        displayAlert('User does not have requests, click the New Request button to create a request');
      }
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

/**
* Gets the details of a single user object
*
* @param {number} data - The id of the request to be fetched
*/
const getRequest = (requestId, displayType) => {
  const request = userRequestsArr.find(requestItem => requestItem.id === parseInt(requestId, 10));
  if (displayType === 'preview' && request) {
    displayPreview(request);
  } else if (displayType === 'update' && request) {
    displayUpdate(request);
  } else {
    displayAlert('Could not get details of the request');
  }
};

/**
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

/**
* Adds an eventListener with a callback to POST user request inputs
*
* @param {object} submitEvent - The submitEvent
*/
updateRequestForm.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();
  const title = document.getElementById('updateTitle').value;
  const type = document.getElementById('updateType').value;
  const description = document.getElementById('updateDescription').value;

  fetch(`${baseUrl}/users/requests/${currentRequestId}`, {
    method: 'PUT',
    body: JSON.stringify({ title, type, description }),
    headers: { 'Content-Type': 'application/json', Authorization: token },
  })
    .then(response => response.json())
    .then((response) => {
      if (response.code === 200) {
        displayAlert(response.message);
        toggleModal('update-request');
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

/**
 * Adds a click event listener to filterBtn
 */
filterBtn.addEventListener('change', () => {
  const { value: filterString } = filterBtn;
  let filteredRequests;
  switch (filterString) {
    case 'all':
      filteredRequests = userRequestsArr;
      break;
    default:
      filteredRequests = userRequestsArr.filter(request => request.status === filterString);
      break;
  }
  append(filteredRequests);
});

userPage.addEventListener('load', getRequests());
