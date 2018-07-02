const baseUrl = 'https://my-maintenance-tracker.herokuapp.com/api/v1';
const token = `Bearer ${localStorage.token}`;
const userPage = document.getElementById('user-page');
const createRequestForm = document.getElementById('form-create-request');
const updateRequestForm = document.getElementById('form-update-request');
const userDisplayPanel = document.getElementById('user-requests');
const userPreviewPanel = document.getElementById('user-request-preview');
const btnSync = document.getElementById('user-sync');
const btnApprove = document.getElementById('user-approve');
const btnDisApprove = document.getElementById('user-disapprove');
const btnPending = document.getElementById('user-pending');
const btnResolve = document.getElementById('user-resolve');
let userRequestsArr;
let currentRequestId;
let currentFilter = 'all';

/**
 * Changes the font color of the a request's status text on display, according to the status
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
 * Formats the left/right border colors of a request according to the status of the request
 *
 * @param {Number} requestId - The id of the request, the button updates
 * @param {String} status - The status of the request, the button updates
 *
 * @returns {String} - The applicable class of the request
 */
const formatRequest = (status) => {
  let borderColor;
  switch (status) {
    case 'approved':
      borderColor = 'ch-requests ch-approve';
      break;
    case 'disapproved':
      borderColor = 'ch-requests ch-disapprove';
      break;
    case 'resolved':
      borderColor = 'ch-requests ch-resolve';
      break;
    default:
      borderColor = 'ch-requests ch-pending';
      break;
  }
  return borderColor;
};

/**
 * Evaluates and formats the action buttons a request is entitled from the request's status
 *
 * @param {Number} requestId - The id of the request, the button deletes
 * @param {String} status - The status of the request, the button deletes
 *
 * @returns {HTMLCollection} - The formated buttons
 */
const formatButtons = (status, requestId) => {
  let buttons;
  switch (status) {
    case 'approved':
      buttons = '<i class="icon ion-md-arrow-back" onclick="previousFilter()"></i>';
      break;
    case 'disapproved':
      buttons = `<i class="icon ion-md-arrow-back" onclick="previousFilter()"></i>
      <i class="icon ion-md-trash" onclick="deleteRequest(${requestId})"></i>`;
      break;
    case 'resolved':
      buttons = `<i class="icon ion-md-arrow-back" onclick="previousFilter()"></i>
      <i class="icon ion-md-trash" onclick="deleteRequest(${requestId})"></i>`;
      break;
    default:
      buttons = `<i class="icon ion-md-arrow-back" onclick="previousFilter()"></i>
      <i class="icon ion-md-create" onclick="getRequest(${requestId}, 'update')"></i>`;
      break;
  }
  return buttons;
};

/**
* Appends request data to user request display panel
*
* @param {Array} data - The requests to be displayed
*/
const append = (data) => {
  userDisplayPanel.innerHTML = '';
  data.forEach((request) => {
    const currentRequest = document.createElement('ul');
    currentRequest.setAttribute('onclick', `getRequest(${request.id}, 'preview')`);
    currentRequest.setAttribute('class', formatRequest(request.status));
    const titleCell = document.createElement('li');
    const dateCell = document.createElement('li');
    const statusCell = document.createElement('li');
    titleCell.innerText = request.title;
    dateCell.innerText = new Date(request.createdat).toLocaleString('en-GB', { hour12: true });
    statusCell.appendChild(formatStatus(request.status));
    currentRequest.appendChild(titleCell);
    currentRequest.appendChild(dateCell);
    currentRequest.appendChild(statusCell);
    userDisplayPanel.appendChild(currentRequest);
  });
  userPreviewPanel.style.display = 'none';
  userDisplayPanel.style.display = 'block';
};

/**
* Displays information for a single user's request
*
* @param {Object} data - The request to be displayed
*/
const displayPreview = (data) => {
  document.getElementById('displayTitle').innerText = data.title;
  document.getElementById('displayType').innerText = data.type;
  document.getElementById('displayDescription').innerText = data.description;
  document.getElementById('buttons').innerHTML = formatButtons(data.status, data.id);
  document.getElementById('displayStatus').innerHTML = '';
  document.getElementById('displayStatus').appendChild(formatStatus(data.status));
  document.getElementById('displayDate').innerText = new Date(data.createdat).toLocaleString('en-GB', { hour12: true });
  userDisplayPanel.style.display = 'none';
  userPreviewPanel.style.display = 'block';
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
* Fetches the requests of the authenticated user
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
      } else if (res.code === 200 && !res.data) {
        displayAlert('You don\'t have requests, click the New Request button to create a request');
      } else if (res.code === 401) {
        setTimeout(() => {
          window.location.replace('signin.html');
        }, 10);
      }
    })
    .catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
    });
};

/**
* Gets the details of a single user object, to be previewed or updated
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
* Adds an eventListener with a callback to POST user inputs for new request creation
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
        setTimeout(() => {
          getRequests();
          const width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
          if (width < 769) toggleMenu();
        }, 10);
      } else {
        displayAlert(response.message);
        toggleModal('add-request');
      }
    }).catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
      toggleModal('add-request');
    });
});

/**
* Adds an eventListener with a callback to PUT user inputs to update an existing request
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
        setTimeout(() => getRequests(), 10);
      } else {
        displayAlert(response.message);
        toggleModal('add-request');
      }
    }).catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
      toggleModal('add-request');
    });
});

/**
 * Filters user's requests by to the status
 *
 * @param {String} status - The status of the requests to be filtered
 */
const filterRequests = (status) => {
  currentFilter = status;
  let filteredRequests;
  switch (status) {
    case 'all':
      filteredRequests = userRequestsArr;
      break;
    default:
      filteredRequests = userRequestsArr.filter(request => request.status === status);
      break;
  }
  append(filteredRequests);
};


/**
 * Deletes a request on the server belonging to the authenticated user
 *
 * @param {Number} requestId - The id of the request to be deleted on the server
 */
const deleteRequest = (requestId) => {
  fetch(`${baseUrl}/users/requests/${requestId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    cache: 'reload',
  }).then(response => response.json()).then((response) => {
    if (response.code === 200) {
      displayAlert(response.message);
      getRequests();
    } else {
      displayAlert('Could not delete request');
    }
  }).catch(() => {
    displayAlert('Error connecting to the network, please check your Internet connection and try again');
  });
};

const previousFilter = () => {
  filterRequests(currentFilter);
};

btnSync.addEventListener('click', () => {
  filterRequests('all');
  toggleMenu();
});
btnApprove.addEventListener('click', () => {
  filterRequests('approved');
  toggleMenu();
});
btnDisApprove.addEventListener('click', () => {
  filterRequests('disapproved');
  toggleMenu();
});
btnPending.addEventListener('click', () => {
  filterRequests('pending');
  toggleMenu();
});
btnResolve.addEventListener('click', () => {
  filterRequests('resolved');
  toggleMenu();
});
userPage.addEventListener('load', getRequests());
