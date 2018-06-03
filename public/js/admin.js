const baseUrl = 'https://my-maintenance-tracker.herokuapp.com/api/v1';
const token = `Bearer ${localStorage.token}`;
const userPage = document.getElementById('admin-page');

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
    cellStatus.innerHTML = request.status;
    cellUser.innerHTML = `${request.firstname} ${request.lastname}`;
    cellDetails.innerHTML = '<button class="ch-btn-view"> <i class="icon ion-md-albums"></i> </button>';
    cellApprove.innerHTML = '<button class="ch-btn-approve"> <i class="icon ion-md-checkmark"></i> </button>';
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

userPage.addEventListener('load', getRequests());
