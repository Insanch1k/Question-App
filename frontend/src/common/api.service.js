import CSRF_TOKEN from "./csrf_token.js";

function handleResponse(response) {
  if (response.status === 204) {
    return "";
  } else if (response.status === 404) {
    return null;
  } else {
      return response.json();
  }
}

function apiService(endpoint, method, data) {
  const config = {
    credentials: "same-origin",
    method: method || "GET",
    body: data !== undefined ? JSON.stringify(data) : null,
    headers: {
      "content-type": "application/json",
      "X-CSRFToken": CSRF_TOKEN
    }
  };
  return fetch(endpoint, config)
    .then(handleResponse)
    .catch(error => console.log(error));
}

export { apiService };