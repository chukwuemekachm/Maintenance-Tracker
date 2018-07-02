const baseUrl = 'https://my-maintenance-tracker.herokuapp.com/api/v1';
const token = `Bearer ${localStorage.token}`;
const adminPage = document.getElementById('admin-page');
const userDisplayPanel = document.getElementById('user-requests');
const userPreviewPanel = document.getElementById('user-request-preview');
const btnSync = document.getElementById('user-sync');
const btnApprove = document.getElementById('user-approve');
const btnPending = document.getElementById('user-pending');
const btnResolve = document.getElementById('user-resolve');
const btnNext = document.getElementById('next-btn');
const btnPrevious = document.getElementById('previous-btn');
let userRequestsArr;
let currentFilter = 'all';
let currentPage = 1;

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
      buttons = `<i class="icon ion-md-arrow-back" onclick="previousFilter()"></i>
      <i class="icon ion-md-done-all" onclick="modifyRequest(${requestId}, 'resolve')"></i>`;
      break;
    case 'disapproved':
      buttons = '<i class="icon ion-md-arrow-back" onclick="previousFilter()"></i>';
      break;
    case 'resolved':
      buttons = '<i class="icon ion-md-arrow-back" onclick="previousFilter()"></i>';
      break;
    default:
      buttons = `<i class="icon ion-md-arrow-back" onclick="previousFilter()"></i>
      <i class="icon ion-md-checkmark" onclick="modifyRequest(${requestId}, 'approve')"></i>
      <i class="icon ion-md-close" onclick="modifyRequest(${requestId}, 'disapprove')"></i>`;
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
    currentRequest.setAttribute('onclick', `getRequest(${request.request_id})`);
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
  document.getElementById('displayUser').innerText = `${data.firstname} ${data.lastname}`;
  document.getElementById('displayEmail').innerText = data.email;
  document.getElementById('displayTitle').innerText = data.title;
  document.getElementById('displayType').innerText = data.type;
  document.getElementById('displayDescription').innerText = data.description;
  document.getElementById('buttons').innerHTML = formatButtons(data.status, data.request_id);
  document.getElementById('displayStatus').innerHTML = '';
  document.getElementById('displayStatus').appendChild(formatStatus(data.status));
  document.getElementById('displayDate').innerText = new Date(data.createdat).toLocaleString('en-GB', { hour12: true });
  userDisplayPanel.style.display = 'none';
  userPreviewPanel.style.display = 'block';
};

/**
 * Gets a list of requests on the system using fetch api
 *
 * @param {String} filterType - The type of requests to be returned
 * @param {Number} pageNo - The page no to be returned
 */
const getRequests = (filterType, pageNo = 1) => {
  fetch(`${baseUrl}/requests?filterType=${filterType}&pageNo=${pageNo}&cache-bust=${Date.now()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    cache: 'reload',
  })
    .then(res => res.json()).then((res) => {
      if (res.code === 200) {
        userRequestsArr = res.data;
        append(res.data);
      }
      if (res.code === 401) {
        setTimeout(() => {
          window.location.replace('signin.html');
        }, 10);
      } else if (res.code === 403) {
        setTimeout(() => {
          window.location.replace('user.html');
        }, 10);
      }
    })
    .catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
    });
};

/**
 * Modifies the status of a user's request
 *
 * @param {Number} requestId - The request id of the request to be modified
 * @param {String} actionType - The type of modification action to be performed
 * (Approve, Disapprove, Resolve)
 */
const modifyRequest = (requestId, actionType) => {
  fetch(`${baseUrl}/requests/${requestId}/${actionType}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    cache: 'reload',
  })
    .then(res => res.json()).then((res) => {
      displayAlert(res.message);
      if (res.code === 200) {
        getRequests();
      }
      if (res.code === 401) {
        setTimeout(() => {
          window.location.replace('signin.html');
        }, 10);
      } else if (res.code === 403) {
        setTimeout(() => {
          window.location.replace('user.html');
        }, 10);
      }
    })
    .catch(() => {
      displayAlert('Error connecting to the network, please check your Internet connection and try again');
    });
};

/**
* Gets the details of a single user object
*
* @param {Number} data - The id of the request to be fetched
*/
const getRequest = (requestId) => {
  const request = userRequestsArr
    .find(requestItem => requestItem.request_id === parseInt(requestId, 10));
  displayPreview(request);
};

const previousFilter = () => {
  append(userRequestsArr);
};

btnNext.addEventListener('click', () => {
  if (userRequestsArr.length < 12) {
    displayAlert('This is the last page');
  } else {
    displayAlert('Loading next...');
    currentPage += 1;
    getRequests(currentFilter, currentPage);
  }
});

btnPrevious.addEventListener('click', () => {
  if (currentPage > 1) {
    displayAlert('Loading previous...');
    currentPage -= 1;
    getRequests(currentFilter, currentPage);
  } else {
    displayAlert('This is the first page');
  }
});
btnSync.addEventListener('click', () => {
  displayAlert('Synchronization in progress...');
  currentPage = 1;
  currentFilter = 'none';
  getRequests();
  toggleMenu();
});
btnApprove.addEventListener('click', () => {
  displayAlert('Loading Approved...');
  currentPage = 1;
  currentFilter = 'approved';
  getRequests(currentFilter, currentPage);
  toggleMenu();
});
btnPending.addEventListener('click', () => {
  displayAlert('Loading Pending...');
  currentPage = 1;
  currentFilter = 'pending';
  getRequests(currentFilter, currentPage);
  toggleMenu();
});
btnResolve.addEventListener('click', () => {
  displayAlert('Loading Resolved...');
  currentPage = 1;
  currentFilter = 'resolved';
  getRequests(currentFilter, currentPage);
  toggleMenu();
});

adminPage.addEventListener('load', getRequests());
