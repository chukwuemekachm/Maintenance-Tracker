const baseUrl = 'https://my-maintenance-tracker.herokuapp.com/api/v1';
const token = `Bearer ${localStorage.token}`;
const userPage = document.getElementById('admin-page');

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
  data.forEach((request) => {
    const newRow = document.createElement('tr');
    const cellId = newRow.insertCell(0);
    const cellTitle = newRow.insertCell(1);
    const cellDate = newRow.insertCell(2);
    const cellStatus = newRow.insertCell(3);
    const cellUser = newRow.insertCell(4);
    const cellDetails = newRow.insertCell(5);
    const cellApprove = newRow.insertCell(6);
    const cellDisapprove = newRow.insertCell(7);
    cellId.innerHTML = request.request_id;
    cellTitle.innerHTML = request.title;
    cellDate.innerHTML = new Date(request.createdat).toLocaleString('en-GB', { hour12: true });
    cellStatus.appendChild(formatStatus(request.status));
    cellUser.innerHTML = `${request.firstname} ${request.lastname}`;
    cellDetails.innerHTML = '<button class="ch-btn-view"> <i class="icon ion-md-albums"></i> </button>';
    cellApprove.innerHTML = `<button class="ch-btn-approve" onclick="modifyRequest(${request.request_id}, 'approve')"> <i class="icon ion-md-checkmark"></i> </button>`;
    cellDisapprove.innerHTML = '<button class="ch-btn-disapprove"> <i class="icon ion-md-close"></i> </button>';
    newTableBody.append(newRow);
  });
  const Table = document.getElementById('admin-table');
  Table.removeChild(Table.lastChild);
  return Table.append(newTableBody);
};

/**
 * Gets a list of requests on the system using fetch api
 */
const getRequests = () => {
  fetch(`${baseUrl}/requests`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    cache: 'reload',
  })
    .then(res => res.json()).then((res) => {
      if (res.code === 200) {
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

userPage.addEventListener('load', getRequests());
