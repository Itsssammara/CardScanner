const scanBtn = document.getElementById('scan-btn');
const studentNameElem = document.getElementById('student-name');
const studentSurnameElem = document.getElementById('student-surname');
const studentDepartmentElem = document.getElementById('student-status'); // Now represents department
const studentStatusElem = document.getElementById('last-scan-time'); // Now represents on-site status
const tableBody = document.getElementById('table-body');
const notificationElem = document.getElementById('notification');
const downloadBtn = document.getElementById('download-btn');

let lastScanTime = 0;
let signedInStudents = {};

// Update the display function to show the department and status
function displayStudentInfo(name, surname, department, status) {
  studentNameElem.textContent = name;
  studentSurnameElem.textContent = surname;
  studentDepartmentElem.textContent = department; // Department displayed here
  studentStatusElem.textContent = status; // On-site status displayed here
}

// Update the table to include department and checkboxes in the status column
function addToTable(name, surname, department) {
  // Create a new row and fill it with student data
  const newRow = document.createElement('tr');
  newRow.setAttribute('id', `${name}-${surname}`); // Unique ID for each student row

  const nameCell = document.createElement('td');
  nameCell.textContent = name;
  newRow.appendChild(nameCell);

  const surnameCell = document.createElement('td');
  surnameCell.textContent = surname;
  newRow.appendChild(surnameCell);

  const departmentCell = document.createElement('td');
  departmentCell.textContent = department; // Department column
  newRow.appendChild(departmentCell);

  // Create a checkbox for the Status column
  const statusCell = document.createElement('td');
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('id', `status-${name}-${surname}`); // Unique ID for the checkbox
  checkbox.checked = true; // Automatically check the checkbox when a student is signed in
  statusCell.appendChild(checkbox);
  newRow.appendChild(statusCell);

  // Add the new row to the table
  tableBody.appendChild(newRow);
}

// Modify the removeFromTable function to handle checkbox uncheck
function removeFromTable(name, surname) {
  const rowId = `${name}-${surname}`;
  const row = document.getElementById(rowId);

  if (row) {
    const checkbox = document.getElementById(`status-${name}-${surname}`);
    checkbox.checked = false; // Uncheck the checkbox when the student signs out

    tableBody.removeChild(row); // Optionally, you can still remove the row if needed
  }
}

// Display notification for sign-in/out actions
function showNotification(message) {
  notificationElem.textContent = message;
  notificationElem.classList.remove('hidden');
  notificationElem.classList.add('show');

  // Hide notification after 3 seconds
  setTimeout(() => {
    notificationElem.classList.remove('show');
    notificationElem.classList.add('hidden');
  }, 3000);
}

// Simulate the card scan process and handle sign-in/sign-out logic
function simulateCardScan() {
  const studentData = {
    name: "Ammara",
    surname: "Hoosen",
    department: "Studio" // Department instead of status
  };

  const studentKey = `${studentData.name}-${studentData.surname}`;
  const currentTime = new Date().getTime();

  if (signedInStudents[studentKey]) {
    // Student already signed in, sign them out
    removeFromTable(studentData.name, studentData.surname);
    delete signedInStudents[studentKey];
    showNotification(`${studentData.name} ${studentData.surname} has signed out.`);
  } else {
    // Check if 1 minute has passed since the last scan
    if (currentTime - lastScanTime > 60000) {
      displayStudentInfo(studentData.name, studentData.surname, studentData.department, "On-site");
      addToTable(studentData.name, studentData.surname, studentData.department);

      signedInStudents[studentKey] = true;
      lastScanTime = currentTime;

      scanBtn.disabled = true;
      setTimeout(() => {
        scanBtn.disabled = false;
      }, 60000); // 1-minute delay
    } else {
      showNotification("Please wait before scanning again.");
    }
  }
}

// Attach click event to the scan button
scanBtn.addEventListener('click', simulateCardScan);

downloadBtn.addEventListener('click', () => {
  const element = document.body; // You can change this to any specific element you want to download

  // Options for the pdf format
  const opt = {
    margin: 1,
    filename: 'StatusDashboard.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  // Generate the PDF using html2pdf library
  html2pdf().from(element).set(opt).save();
});

async function fetchUsers() {
  try {
    const response = await axios.get('https://temp-backend-3rni.onrender.com/getusers'); // Update this URL as necessary
    const users = response.data;

    console.log(users)

    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    // Populate the table with user data
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.department}</td>
        `;
        tableBody.appendChild(row);
    });
} catch (error) {
    console.error("Error fetching users:", error);
    // Optionally display an error message in the table
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `<tr><td colspan="4">Error fetching users. Please try again later.</td></tr>`;
}
}

window.onload = fetchUsers;
