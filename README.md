# RudderStack Event Debugger (Chrome Extension)

A Chrome DevTools extension to **view all RudderStack analytics events** fired on any web page, in real time.

---

## Features

- **Live event log:** See every RudderStack event as it happens, with full payloads.
- **Event filtering & search:** Filter by event type or search by name/properties.
- **Copy event JSON:** One-click copy for easy debugging or sharing.
- **Config display:** Shows RudderStack write key and data plane URL if available.
- **Works on any site:** No code changes needed—just install and open DevTools.

---

## How It Works

1. **Content script** injects a small script (`interceptor.js`) into every page you visit.
2. The interceptor checks for `window.rudderanalytics` (the RudderStack SDK).
3. If found, it wraps all key methods (`track`, `identify`, `page`, `group`, `alias`, `reset`).
4. Every time your site calls one of these methods, the event and its data are sent to the extension.
5. The **background script** relays these events to the DevTools panel.
6. The **DevTools panel** displays all events in a searchable, filterable log.

---

## Why Use This?

- **Debug analytics instantly:** No more guessing if events fired or what data was sent.
- **Validate event structure:** See the exact payload for every call.
- **Faster QA:** Spot missing or malformed events before they reach production.
- **No backend required:** All inspection happens in your browser.

---

## Installation

1. **Clone or download** this repo.
2. Go to `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the extension folder.
5. Open DevTools (F12) on any page using RudderStack.
6. Find the **"RudderStack Debug"** panel.

---

## Demo

A sample demo page is included in `/demo`.  
You can run it locally with:

```sh
cd demo
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in Chrome.

---

## Privacy & Security

- This extension **does not collect or transmit any data** outside your browser.
- All event inspection happens locally.
