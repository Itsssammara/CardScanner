const tableBody = document.getElementById('table-body');
let lastUsers = []; // Store the last fetched users

// Fetch and display users
async function fetchUsers() {
  try {
    const response = await axios.get('https://temp-backend-3rni.onrender.com/getusers'); // Ensure this URL is correct
    const users = response.data;

    // Check if the users list has changed compared to the previous fetch
    if (JSON.stringify(users) !== JSON.stringify(lastUsers)) {
      console.log("New data detected. Updating table...");
      lastUsers = users; // Update the lastUsers with the latest data

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
        // Insert the new row at the top of the table
        tableBody.insertBefore(row, tableBody.firstChild);
      });
    } else {
      console.log("No changes in data.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    tableBody.innerHTML = `<tr><td colspan="4">Error fetching users. Please try again later.</td></tr>`;
  }
}

// Poll the server for updates every second
setInterval(fetchUsers, 1000); // Change to 1000 milliseconds for 1 second

// Fetch users when the page loads
window.onload = fetchUsers;