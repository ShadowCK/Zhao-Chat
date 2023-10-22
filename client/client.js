console.log("hello world!");

const handleResponse = async (response, method) => {
  const content = document.querySelector("#content");

  switch (response.status) {
    case 200:
      content.innerHTML = `<b>Success</b>`;
      break;
    case 201:
      content.innerHTML = `<b>Created</b>`;
      break;
    case 204:
      content.innerHTML = `<b>Updated(No Content)</b>`;
      break;
    case 400:
      content.innerHTML = `<b>Bad Request</b>`;
      break;
    case 500: // internal server error
      content.innerHTML = `<b>Internal Server Error</b>`;
      break;
    case 404:
    default:
      content.innerHTML = `<b>Not Found</b>`;
      break;
  }

  const contentType = response.headers.get("content-type");
  // No content is needed to be parsed. Let's bail out.
  if (method == "HEAD" || response.status === 204) {
    return;
  }
  // Parse content
  if (contentType && contentType.includes("application/json")) {
    const obj = await response.json();
    console.log(obj);
    content.innerHTML += `<p>${JSON.stringify(obj)}</p>`;
  } else {
    console.error("Unhandled content type:", contentType);
  }
};

const sendRequest = (url, method, body) => {
  fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  })
    .then((response) => handleResponse(response, method))
    .catch((error) => {
      console.error("Error:", error);
      const content = document.querySelector("#content");
      content.innerHTML = `<b>Error: ${error.message}</b>`;
    });
};

const init = () => {
  console.log("Hello!");
  // TODO
};

window.onload = init;
