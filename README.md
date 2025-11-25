# Dialogues @ Beloit 🗣️

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)

**Dialogues @ Beloit** is a modern, anonymous-first discussion platform designed for the Beloit College community. It provides a safe, engaging space for students to share thoughts, ask questions, and connect with peers in a visually stunning, dark-themed environment.

## ✨ Features

- **🚀 Real-time Discussions**: Start conversations instantly with location tagging and topic categorization.
- **💬 Threaded Comments**: Engage in deep discussions with a reddit-style nested comment system.
- **🗳️ Community Voting**: Upvote or downvote posts and comments to surface the best content.
- **🔒 Secure Authentication**: Seamless sign-up and login powered by Supabase Auth.
- **🎨 Premium UI/UX**: A sleek, dark-mode interface featuring particle physics backgrounds and glassmorphism effects.
- **📱 Fully Responsive**: Optimized for a flawless experience on mobile, tablet, and desktop.
- **🛡️ Moderation Tools**: Authors can close discussions to manage conversation flow.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL (via Supabase)

## 📚 Documentation

For detailed information about the application architecture, workflows, and implementation:

👉 **[View Complete Workflow Documentation](docs/WORKFLOW.md)**

The documentation includes:
- System architecture diagrams
- Authentication flow
- Main application workflows (browse, create, comment, vote)
- Database schema and relationships
- Component hierarchy
- Security implementation
- Deployment guide

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account

### Live Demo

Check out the live application here: https://dialogues-beloit.vercel.app/

### Local Development

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

3.  **Database Setup**
    Run the SQL scripts provided in `schema.sql` (and `migration.sql` for cascade deletes) in your Supabase SQL Editor to set up the tables and security policies.

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the app**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
