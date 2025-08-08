const logContainer = document.getElementById("events-log");
const clearButton = document.getElementById("clear-log");
const searchBox = document.getElementById("search-box");
const filterButtonsContainer = document.querySelector(".filter-buttons");
const configInfo = document.getElementById("config-info");

let activeFilter = "all";
let searchTerm = "";

const ICONS = {
  page: "📄",
  track: "🎯",
  identify: "👤",
  group: "👥",
  alias: "🔗",
  reset: "🔄",
  debug: "⚙️",
};

const backgroundPort = chrome.runtime.connect({ name: "devtools-panel" });

backgroundPort.postMessage({
  name: "init",
  tabId: chrome.devtools.inspectedWindow.tabId,
});

backgroundPort.onMessage.addListener(function (message) {
  if (message.type === "config") {
    renderConfig(message.payload);
  } else if (message.source === "rudderstack-debugger") {
    renderEvent(message);
  }
});

function renderConfig(config) {
  if (config.writeKey && config.dataPlaneUrl) {
    configInfo.innerHTML = `
      <strong>Write Key:</strong> <span>${config.writeKey}</span> | 
      <strong>Data Plane URL:</strong> <span>${config.dataPlaneUrl}</span>
    `;
  } else {
    configInfo.textContent =
      "RudderStack initialized. Configuration details not found on SDK object.";
  }
}

function applyFilters() {
  const logItems = logContainer.querySelectorAll(".event-item");
  logItems.forEach((item) => {
    const isTypeMatch =
      activeFilter === "all" ||
      item.classList.contains(`event-${activeFilter}`);
    const textContent = item.textContent.toLowerCase();
    const isSearchMatch = searchTerm === "" || textContent.includes(searchTerm);

    if (isTypeMatch && isSearchMatch) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
}

function renderEvent(eventData) {
  try {
    const { type, payload, timestamp } = eventData;
    const item = document.createElement("li");
    item.className = `event-item event-${type.toLowerCase()}`;
    item.setAttribute("data-event-type", type.toLowerCase());

    const icon = ICONS[type.toLowerCase()] || "📦";
    const eventName = payload && payload[0] ? JSON.stringify(payload[0]) : "";
    const properties = payload && payload[1] ? payload[1] : {};
    const propertiesString = JSON.stringify(properties, null, 2);
    const time = new Date(timestamp).toLocaleTimeString();

    item.innerHTML = `
      <div class="event-header">
        <span class="event-icon">${icon}</span>
        <span class="event-type">${type.toUpperCase()}</span>
        <span class="event-name">${eventName}</span>
        <span class="event-time">${time}</span>
      </div>
      <div class="event-body">
        <details>
          <summary>Properties</summary>
          <div class="event-payload">${propertiesString}</div>
        </details>
      </div>
    `;

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy JSON";
    copyBtn.onclick = function (e) {
      e.stopPropagation();
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy JSON";
      }, 1500);
    };
    item.querySelector("summary").appendChild(copyBtn);

    logContainer.appendChild(item);
    applyFilters(); // Check if the new item should be visible
    logContainer.scrollTop = logContainer.scrollHeight;
  } catch (e) {
    // Fail silently in panel to avoid clutter
  }
}

// --- Event Listeners ---

clearButton.addEventListener("click", () => {
  logContainer.innerHTML = "";
});

searchBox.addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase();
  applyFilters();
});

filterButtonsContainer.addEventListener("click", (e) => {
  const target = e.target.closest(".filter-btn");
  if (!target) return;

  filterButtonsContainer.querySelector(".active").classList.remove("active");
  target.classList.add("active");
  activeFilter = target.dataset.filter;
  applyFilters();
});

// Initial welcome message
setTimeout(() => {
  renderEvent({
    type: "debug",
    payload: ["Debugger panel loaded successfully!", { status: "connected" }],
    timestamp: Date.now(),
  });
}, 200);
