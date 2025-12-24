# GlassPlanner

A liquid-glass aesthetic academic planner that transforms Canvas calendar exports (.ics) into an organized, AI-powered task list.

## Features

- **ICS Import**: Drag and drop your Canvas `.ics` calendar feed.
- **Glassmorphism UI**: A beautiful, responsive interface with dynamic backgrounds and glass-like cards.
- **Auto-Organization**: Automatically groups assignments by class and sorts them by due date.
- **AI Tutor Integration**: powered by Google Gemini.
  - Break down complex assignments.
  - Get explanations and study guides directly within the app.
  - Context-aware chat that knows the details of your specific assignment.

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Google Gemini API key:
   ```
   API_KEY=your_google_genai_api_key
   ```
4. Run the development server:
   ```bash
   npm start
   ```

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- Google Gemini API (`@google/genai`)
