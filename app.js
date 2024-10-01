// Remove the scan button code
// const scanBtn = document.getElementById('scan-btn'); 

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

// Update the table to include department and IDs
function addToTable(id, name, surname, department) {
  // Create a new row and fill it with student data
  const newRow = document.createElement('tr');
  newRow.setAttribute('id', `${name}-${surname}`); // Unique ID for each student row

  const idCell = document.createElement('td');
  idCell.textContent = id; // Numeric ID for the student
  newRow.appendChild(idCell);

  const nameCell = document.createElement('td');
  nameCell.textContent = name;
  newRow.appendChild(nameCell);

  const surnameCell = document.createElement('td');
  surnameCell.textContent = surname;
  newRow.appendChild(surnameCell);

  const departmentCell = document.createElement('td');
  departmentCell.textContent = department; // Department column
  newRow.appendChild(departmentCell);

  // Add the new row to the table
  tableBody.appendChild(newRow);
}

// Modify the removeFromTable function to remove the row without checkbox logic
function removeFromTable(name, surname) {
  const rowId = `${name}-${surname}`;
  const row = document.getElementById(rowId);

  if (row) {
    tableBody.removeChild(row); // Remove the row when the student signs out
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
      addToTable(studentData.id, studentData.name, studentData.surname, studentData.department);

      signedInStudents[studentKey] = true;
      lastScanTime = currentTime;

      // Disabled scan button logic removed, as you no longer have a scan button
    } else {
      showNotification("Please wait before scanning again.");
    }
  }


// Remove the scan button event listener and reference
// scanBtn.addEventListener('click', simulateCardScan);

// Attach event to download the PDF
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

// Fetch and display users
async function fetchUsers() {
  try {
    const response = await axios.get('https://temp-backend-3rni.onrender.com/getusers'); // Update this URL as necessary
    const users = response.data;

    console.log(users);

    tableBody.innerHTML = ''; // Clear existing rows

    // Populate the table with user data
    users.forEach((user, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td> <!-- ID is now the index of the user -->
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.department}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    tableBody.innerHTML = `<tr><td colspan="4">Error fetching users. Please try again later.</td></tr>`;
  }
}

// Fetch users when the page loads
window.onload = fetchUsers;
