// Helper function to format content
function formatContent(items) {
  if (!items || items.length === 0) {
    return "<p>No items available.</p>";
  }

  // Generate a list of items
  const listItems = items
    .map(
      (item) => `
        <div class="item">
          <h4>${item.name}</h4>
          <p>${item.description || "No description available."}</p>
        </div>
      `
    )
    .join("");

  return `<div class="items-list">${listItems}</div>`;
}
function createListWithModal(data) {
  const ul = document.getElementById("dynamic-list");

  // Clear existing list items
  ul.innerHTML = "";

  // Loop through the data to create list items
  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name; // Display name
    li.dataset.id = item.id; // Store unique identifier
    li.classList.add("clickable-item"); // Optional: Add styling class
    li.style.cursor = "pointer";

    // Attach click event listener to fetch and display modal data
    li.addEventListener("click", async () => {
      const modal = document.getElementById("shared-modal");
      const modalTitle = document.getElementById("modal-title");
      const modalContent = document.getElementById("modal-content");

      // Show loading state in the modal
      modalTitle.textContent = "Loading...";
      modalContent.textContent = "Fetching details, please wait...";

      // Open the modal
      openModal(modal);

      try {
        // Fetch detailed data for the clicked item
        const response = await fetch(`/api/item-details?id=${item.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }

        const details = await response.json();

        // Update modal with fetched details
        modalTitle.textContent = details.title || "No Title";
        modalContent.textContent = details.content || "No Content Available";
      } catch (error) {
        // Handle errors
        modalTitle.textContent = "Error";
        modalContent.textContent = "Failed to load details.";
        console.error("Error fetching details:", error);
      }
    });

    // Append the list item to the ul
    ul.appendChild(li);
  });
}

// Function to open the modal
function openModal(modal) {
  modal.classList.add("is-active");
}

// Function to close the modal
function closeModal(modal) {
  modal.classList.remove("is-active");
}

// Setup modal close events once
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("shared-modal");

  // Add event listeners for closing the modal
  document
    .querySelector(".modal-background")
    .addEventListener("click", () => closeModal(modal));
  document
    .querySelector(".modal-close")
    .addEventListener("click", () => closeModal(modal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal(modal);
    }
  });
});
