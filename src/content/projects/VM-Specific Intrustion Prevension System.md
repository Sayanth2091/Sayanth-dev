---
title: "Building a IPS specific for Virtual Machines"
summary: "Simple Intrustion Prevension System for understanding how IPS works"
date: 2024-02-15
tags: [Cybersecurity, Virtual Machine]
category: "tools"
---

# Building a Live Network Intrusion Detection System with Python and React

In the world of cybersecurity, understanding network traffic is paramount. What if you could build your own watchdog to monitor a network, detect suspicious activity in real-time, and display alerts on a modern web dashboard?

Today, we're dissecting the **VM-Specific Intrusion Prevention System (IPS)**, a fascinating project that does exactly that. It combines the power of Python for low-level network packet sniffing with the responsiveness of a React frontend. This project is a perfect showcase of how to build a full-stack application for a very practical security purpose: monitoring the network of your local virtual machines.

## Project Architecture: A Tale of Two Stacks

The application is neatly divided into two main components: a Python backend and a React frontend.

1.  **The Backend (Python & Flask)**: This is the engine of the IDS. It uses the powerful **Scapy** library to sniff network packets directly from a VirtualBox network interface. A **Flask** web server is wrapped around this core logic to expose a REST API and, most importantly, a **WebSocket** server for pushing live alerts.
2.  **The Frontend (React & Vite)**: This is the command center. Built with **React** and **Vite**, it provides a clean, modern user interface. It communicates with the backend via **axios** for initial data and uses **socket.io-client** to receive real-time alerts, displaying them instantly without needing to refresh the page. Styling is handled by **Tailwind CSS** and **Flowbite** components.

 (*Conceptual Diagram*)

## How to Run This Project

Want to see it in action? Here’s how to get the project running on your system.

### Prerequisites

*   [Node.js and npm](https://nodejs.org/)
*   [Python 3](https://www.python.org/)
*   [VirtualBox](https://www.virtualbox.org/) installed, with a "Host-Only Network" adapter enabled.
*   [Npcap](https://npcap.com/) (for Scapy to work correctly on Windows).

### Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd VM-Specific-IPS/backend
    ```

2.  **Create `requirements.txt`**:
    Create a file named `requirements.txt` and add the following lines:
    ```
    Flask
    Flask-SocketIO
    Flask-Cors
    scapy
    python-virtualbox
    ```

3.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Backend Server**:
    You may need to run this with administrator privileges for Scapy to access network interfaces.
    ```bash
    sudo python ids.py
    ```
    The backend server will start, and the packet sniffer will begin monitoring the "VirtualBox Host-Only Network".

### Frontend Setup

1.  **Navigate to the project root**:
    ```bash
    cd VM-Specific-IPS
    ```

2.  **Install Node.js Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Frontend Dev Server**:
    ```bash
    npm run dev
    ```

4.  **Access the Dashboard**:
    Open your browser and go to `http://localhost:5173` (or whatever port Vite specifies). You should now see the live dashboard.

## The Backend: Sniffing Packets with Python

The core of the intrusion detection logic resides in `backend/ids.py`. Let's break it down.

### Packet Sniffing with Scapy

The script uses Scapy's `sniff` function to capture every packet on the specified network interface. This is run in a separate thread so it doesn't block the Flask web server.

```python
# backend/ids.py

# ... imports ...

def monitor_packet(packet):
    """Main packet processing function."""
    detect_ping(packet)
    detect_port_scan(packet)

if __name__ == "__main__":
    # Start sniffing in a separate thread
    from threading import Thread
    Thread(target=lambda: sniff(iface="VirtualBox Host-Only Network", prn=monitor_packet)).start()

    # Start Flask app
    app.run(debug=True)
```

### Threat Detection Logic

For every packet captured, two detection functions are called:

1.  **Ping Flood Detection (`detect_ping`)**: This function checks for ICMP echo requests (pings). It keeps a count of pings from each source IP. If the count exceeds a `PING_THRESHOLD` within a time window, it flags the IP.

    ```python
    # backend/ids.py
    PING_THRESHOLD = 5
    ping_counts = defaultdict(int)

    def detect_ping(packet):
        """Detect excessive ICMP requests."""
        global ping_counts
        if packet.haslayer(ICMP) and packet[ICMP].type == 8:
            src_ip = packet[IP].src
            ping_counts[src_ip] += 1
            if ping_counts[src_ip] > PING_THRESHOLD:
                reason = "Excessive ICMP requests"
                block_ip(src_ip, reason)
    ```

2.  **Port Scan Detection (`detect_port_scan`)**: This function monitors TCP packets. It tracks the set of destination ports that each source IP tries to connect to. If an IP tries to access more unique ports than the `PORT_SCAN_THRESHOLD`, it's flagged as a potential port scanner.

    ```python
    # backend/ids.py
    PORT_SCAN_THRESHOLD = 10
    port_access_counts = defaultdict(set)

    def detect_port_scan(packet):
        """Detect potential port scanning."""
        global port_access_counts
        if packet.haslayer(TCP):
            src_ip = packet[IP].src
            dst_port = packet[TCP].dport
            port_access_counts[src_ip].add(dst_port)
            if len(port_access_counts[src_ip]) > PORT_SCAN_THRESHOLD:
                reason = "Port scanning activity detected"
                block_ip(src_ip, reason)
    ```

### Real-Time Alerts with WebSockets

When `block_ip` is called, it doesn't just log the IP; it uses **Flask-SocketIO** to immediately push a `message` event to all connected frontend clients. This is what makes the dashboard update in real-time.

```python
# backend/ids.py
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
blocked_ips = defaultdict(str)
messages = []

def block_ip(ip, reason):
    if not ip in blocked_ips:
        blocked_ips[ip] = reason
        msg = {
            'id': int(uuid.uuid4()),
            'message': ip,
            'hidden': reason
        }
        handle_message(msg) # This emits the socket message

@socketio.on('message')
def handle_message(msg):
    socketio.emit('message', msg)
    messages.append(msg)
```

## The Frontend: A Real-Time React Dashboard

The frontend, located in the `src/` directory, is a clean and effective interface for viewing the IDS alerts.

### Connecting to the Backend

In `App.jsx`, the component establishes a WebSocket connection and listens for the `message` event. When a new message arrives, it's added to the `messages` state, causing the UI to re-render and display the new alert.

```jsx
// src/App.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Card from './components/Card';
import { CustomModal } from './components/Modal';

const socket = io('http://localhost:5000'); // Flask server address

function App() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(undefined);

  useEffect(() => {
    // Listen for incoming messages from the WebSocket server
    socket.on('message', (message) => {
      setOpen("default"); // Trigger the warning modal
      console.log(message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('message');
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className='bg-purple-900 min-h-screen z-10 p-10'>
      <div className='bg-white p-10 mx-auto mt-20 rounded-3xl'>
        <h1 className='text-4xl font-bold mb-10'>Intrusion Prevention System</h1>
        <h1 className='text-3xl font-light mb-10'>Blocked IPs</h1>
        <CustomModal open={open} setOpen={setOpen} />
        <ul className='flex flex-col gap-y-5 mt-5'>
          {messages.map((msg) => (
            <Card key={msg.id} hidden={msg.hidden} message={msg.message} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
```

### Displaying Information

*   **`Card.jsx`**: This component renders each blocked IP address and its reason. It includes a button to toggle the visibility of the reason.
*   **`Modal.jsx`**: When a new IP is blocked, a modal window from Flowbite pops up, showing a detailed warning and recommended actions.
*   **`Banner.jsx`**: This component makes a separate API call to `/get-machines` to fetch and display the names of the VirtualBox machines, providing context for the monitored environment.

## Conclusion and Next Steps

The VM-Specific IPS project is a brilliant demonstration of how to build a practical, full-stack security tool. It effectively uses Python for its powerful networking capabilities and React for its dynamic and modern UI framework.

The project has a solid foundation that could be extended in many ways:

*   **Activate Prevention**: The `iptables` command in `block_ip` is currently commented out. Uncommenting it on a Linux host would turn this from a passive IDS into an active IPS.
*   **More Sophisticated Rules**: Add detection for other common attacks, such as SQL injection (by inspecting packet payloads), ARP spoofing, or specific malware signatures.
*   **Configuration**: Allow users to adjust thresholds and select the network interface to monitor directly from the UI.
*   **Data Persistence**: Save blocked IPs and alert history to a database so the information persists across server restarts.
*   **Detailed Dashboard**: Add graphs and charts to visualize traffic patterns and attack frequency over time.

Whether you're a security enthusiast, a Python developer, or a React aficionado, there's a lot to learn from this project's elegant and effective design.