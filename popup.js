const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const deleteButton = document.getElementById("delete-btn");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text.length === 0) {
    return;
  }
  const item = document.createElement("li");
  item.textContent = text;
  const button = document.createElement("button");
  const img = document.createElement("img");
  img.src = "./copy.png";
  button.appendChild(img); 
  button.addEventListener("click", () => {
    navigator.clipboard.writeText(text);
  });
  item.appendChild(button);
  list.appendChild(item);
  input.value = "";

  // Save the new item to storage
  chrome.storage.sync.get("savedItems", (data) => {
    let savedItems = data.savedItems || [];
    savedItems.push(text);
    chrome.storage.sync.set({ savedItems });
  });
});

chrome.storage.sync.get("savedItems", (data) => {
  deleteButton.style.display = "none";

  if (data.savedItems) {
    deleteButton.style.display = "block";
    for (const text of data.savedItems) {
      const item = document.createElement("li");
      item.textContent = text;
      const button = document.createElement("button");
      const img = document.createElement("img");
      img.src = "./copy.png";
      button.appendChild(img);

      button.addEventListener("click", () => {
        navigator.clipboard.writeText(text);
      });
      item.appendChild(button);
      list.appendChild(item);
    }
  }
});

window.addEventListener("beforeunload", () => {
  const savedItems = [];
  for (const item of list.children) {
    savedItems.push(item.textContent);
  }
  chrome.storage.sync.set({ savedItems });
});

deleteButton.addEventListener("click", () => {
  chrome.storage.sync.remove("savedItems", () => {
    console.log("savedItems property deleted successfully!");
  });
});
