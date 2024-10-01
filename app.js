const tableBody = document.getElementById('table-body');

// Fetch and display users
async function fetchUsers() {
  try {
    const response = await axios.get('https://temp-backend-3rni.onrender.com/getusers'); // Ensure this URL is correct
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
