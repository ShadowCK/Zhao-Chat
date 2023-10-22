// Function to display messages to the user using a popup (alert)
const showMessage = (message) => {
  alert(message);
};

// Function to handle the response from the server
const handleResponse = async (response, method) => {
  // Based on the response status, show relevant message to the user
  switch (response.status) {
    case 200:
      showMessage("Success");
      break;
    case 201:
      showMessage("Created");
      break;
    case 204:
      showMessage("Updated(No Content)");
      break;
    case 400:
      showMessage("Bad Request");
      break;
    case 500:
      showMessage("Internal Server Error");
      break;
    case 404:
    default:
      showMessage("Not Found");
      break;
  }

  // For HEAD request or a status of 204, no content is expected.
  if (method === "HEAD" || response.status === 204) {
    return;
  }

  const contentType = response.headers.get("content-type");

  // If the content type is JSON, parse and log it to the console
  if (contentType && contentType.includes("application/json")) {
    const obj = await response.json();
    console.log(obj);
  } else {
    console.error("Unhandled content type:", contentType);
  }
};

// Function to send a request to the server
const sendRequest = (url, method, body) => {
  fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // Stringify the body if it exists, else it will be treated as undefined (no body)
    body: body ? JSON.stringify(body) : undefined,
  })
    .then((response) => handleResponse(response, method))
    .catch((error) => {
      console.error("Error:", error);
      showMessage(`Error: ${error.message}`);
    });
};

// Initialize the event listeners on page load
const init = () => {
  console.log("Zhao Drift initialized!");

  const fetchBottleBtn = document.querySelector("#fetchBottle");
  const sendMessageBtn = document.querySelector("#sendMessage");
  const messageInput = document.querySelector("#messageInput");

  // Fetch a bottle when the relevant button is clicked
  fetchBottleBtn.addEventListener("click", () => {
    sendRequest("/fetchBottle", "GET");
  });

  // Send a message when the relevant button is clicked
  sendMessageBtn.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message.length >= 5 && message.length <= 1000) {
      sendRequest("/sendMessage", "POST", { message });
      messageInput.value = ""; // Clear the input after sending
    } else {
      showMessage("Message must be between 5 and 1000 characters long!");
    }
  });
};

window.onload = init;
