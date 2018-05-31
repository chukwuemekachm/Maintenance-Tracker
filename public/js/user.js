const baseUrl = 'http://localhost:3000/api/v1';
const token = `Bearer ${localStorage.token}`;
const userPage = document.getElementById('user-page');

const append = (data) => {
  const newTableBody = document.createElement('tbody');
  data.map((request) => {
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
    cellDetails.innerHTML = '<button class="ch-btn-view">View</button>';
    newTableBody.append(newRow);
  });
  const Table = document.getElementById('user-table');
  Table.removeChild(Table.lastChild);
  Table.append(newTableBody);
};

const getRequests = () => {
  if (token) {
    fetch(`${baseUrl}/users/requests`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      cache: 'reload',
    }).then(res => res.json()).then((res) => {
      if (res.code === 200) {
        displayAlert(res.message);
        append(res.data);
      }
      displayAlert(res.message);
      if (res.code === 401) {
        setTimeout(() => {
          window.location.replace('signin.html');
        }, 3000);
      }
    })
      .catch((err) => {
        displayAlert(err.message);
      });
  } else {
    window.location.replace('signin.html');
  }
};

userPage.addEventListener('load', getRequests());
