const baseUrl = 'https://my-maintenance-tracker.herokuapp.com/api/v1';
const token = `Bearer ${localStorage.token}`;
const userPage = document.getElementById('admin-page');
const resolveRequestBtn = document.getElementById('resolve-request');
const adminSyncBtn = document.getElementById('admin-sync');
const btnNext = document.getElementById('next-btn');
const btnPrevious = document.getElementById('previous-btn');
const btnApproved = document.getElementById('approved-btn');
const btnPending = document.getElementById('pending-btn');
const btnResolved = document.getElementById('resolved-btn');
let currentFilter;
let currentPage = 1;
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
 * Appends and displays requests on the admin table
 *
 * @param {Array} data - A list of requests to be displayed on the Admin table
 */
const appendTableBody = (data) => {
  const newTableBody = document.createElement('tbody');
  let counter = 1;
  data.forEach((request) => {
    const newRow = document.createElement('tr');
    const cellNo = newRow.insertCell(0);
    const cellTitle = newRow.insertCell(1);
    const cellDate = newRow.insertCell(2);
    const cellStatus = newRow.insertCell(3);
    const cellUser = newRow.insertCell(4);
    const cellDetails = newRow.insertCell(5);
    const cellApprove = newRow.insertCell(6);
    const cellDisapprove = newRow.insertCell(7);
    cellNo.innerHTML = counter;
    cellTitle.innerHTML = request.title;
    cellDate.innerHTML = new Date(request.createdat).toLocaleString('en-GB', { hour12: true });
    cellStatus.appendChild(formatStatus(request.status));
    cellUser.innerHTML = `${request.firstname} ${request.lastname}`;
    cellDetails.innerHTML = `<button class="ch-btn-view" onclick="displayRequestDetails(${request.request_id})"> <i class="icon ion-md-albums"></i> </button>`;
    cellApprove.innerHTML = `<button class="ch-btn-approve" onclick="modifyRequest(${request.request_id}, 'approve')"> <i class="icon ion-md-checkmark"></i> </button>`;
    cellDisapprove.innerHTML = `<button class="ch-btn-disapprove" onclick="modifyRequest(${request.request_id}, 'disapprove')"> <i class="icon ion-md-close"></i> </button>`;
    newTableBody.append(newRow);
    counter += 1;
  });
  const Table = document.getElementById('admin-table');
  Table.removeChild(Table.lastChild);
  return Table.append(newTableBody);
};

/**
 * Diplays the details of a user's request
 *
 * @param {Number} requestId - The request id of the request to be displayed
 */
const displayRequestDetails = (requestId) => {
  const data = userRequestsArr.find(request => request.request_id === parseInt(requestId, 10));
  currentRequestId = data.request_id;
  document.getElementById('displayUser').innerHTML = `${data.firstname} ${data.lastname}`;
  document.getElementById('displayEmail').innerHTML = data.email;
  document.getElementById('displayId').innerHTML = data.request_id;
  document.getElementById('displayTitle').innerText = data.title;
  document.getElementById('displayType').innerText = data.type;
  document.getElementById('displayDescription').innerText = data.description;
  document.getElementById('displayStatus').innerText = data.status;
  document.getElementById('displayDate').innerText = new Date(data.createdat).toLocaleString('en-GB', { hour12: true });
  toggleModal('view-request');
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
        document.getElementById('request-count').innerHTML = `${userRequestsArr.length} requests`;
        appendTableBody(res.data);
      }
      if (res.code === 401) {
        setTimeout(() => {
          window.location.replace('signin.html');
        }, 500);
      }
    })
    .catch((err) => {
      displayAlert(err.message);
    });
};

/**
 * Modifies the status of a user's request
 *
 * @param {Number} requestId - The request id of the request to be modified
 * @param {String} actionType - The type of modification action to be performed (Approve, Disapprove, Resolve)
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
      if (res.code === 401 || res.code === 403) {
        setTimeout(() => {
          window.location.replace('signin.html');
        }, 500);
      }
    })
    .catch((err) => {
      displayAlert(err.message);
    });
};

adminSyncBtn.addEventListener('click', () => {
  displayAlert('Synchronization in progress...');
  currentPage = 1;
  currentFilter = 'none';
  getRequests();
});

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
  if (currentPage < 1) {
    displayAlert('Loading previous...');
    currentPage -= 1;
    getRequests(currentFilter, currentPage);
  } else {
    displayAlert('This is the first page');
  }
});

btnApproved.addEventListener('click', () => {
  displayAlert('Loading Approved...');
  currentPage = 1;
  currentFilter = 'approved';
  getRequests(currentFilter, currentPage);
});

btnResolved.addEventListener('click', () => {
  displayAlert('Loading Resolved...');
  currentPage = 1;
  currentFilter = 'resolved';
  getRequests(currentFilter, currentPage);
});

btnPending.addEventListener('click', () => {
  displayAlert('Loading Pending...');
  currentPage = 1;
  currentFilter = 'pending';
  getRequests(currentFilter, currentPage);
});

resolveRequestBtn.addEventListener('click', () => {
  toggleModal('view-request');
  modifyRequest(currentRequestId, 'resolve');
});

userPage.addEventListener('load', getRequests());
