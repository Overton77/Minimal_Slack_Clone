# Minimal Slack Clone

This is a minimal Slack clone built with HTML, CSS, Node.js, JavaScript, and socket.io. Users can join namespaces, join rooms, and message each other in real-time. This web app
was built for a course on socket.io on Udemy.

## Features

- Real-time messaging using socket.io
- Users can join different namespaces
- Users can join rooms within namespaces
- Simple and intuitive user interface

## Prerequisites

- Node.js 18 or higher

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/minimal-slack-clone.git
   cd minimal-slack-clone
   ```

2. Install the required packages:

   ```bash
   npm install
   ```

## Usage

1. Open two terminal windows.

2. In the first terminal, start the Slack server:

   ```bash
   npm run start:slack
   ```

3. In the second terminal, start the Namespace server:

   ```bash
   npm run start:namespace
   ```

4. Open your web browser and go to:

   ```
   http://localhost:9000/slack.html
   ```

5. Start using the application by joining namespaces and rooms, and message each other in real-time.