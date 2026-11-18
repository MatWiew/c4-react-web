# C4 Chess Club Website

A full-stack website for a chess club, bringing club news, tournament information, chess content, player standings, and contact details together in one place. The React frontend communicates with an Express/Node.js API, which stores content in MongoDB through Mongoose. An admin area provides tools for maintaining site content.

## Key features

- **Club information:** Overview and club sections, including trainer and player information.
- **News and articles:** Browse news, open articles, and manage article content through the admin interface.
- **Tournaments:** View tournaments in a calendar and manage tournament details.
- **Chess content:** Interactive chessboard and chess-related content, including puzzles.
- **Club standings:** Display top players and ratings.
- **Sponsors:** Show sponsor information and manage sponsor entries.
- **Contact:** Submit messages through the contact form; the API can forward them by email.
- **Administration:** Admin login and panels for managing club information, news, sponsors, and tournaments.
- **Responsive interface:** Built with React, Tailwind CSS, and component libraries for interactive navigation and content.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, React Router, Axios |
| Styling and UI | Tailwind CSS, RSuite, Framer Motion, React Slick |
| Chess | `react-chessboard`, `chess.ts`, React chess puzzle component |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Other services | Nodemailer for contact email, bcrypt for password hashing |

## Repository structure

```text
.
├── client/                 # React + TypeScript frontend
│   ├── public/             # Static assets and public documents
│   └── src/
│       ├── assets/         # Chess pieces, icons, and club graphics
│       ├── components/     # Site sections, admin panels, and UI components
│       ├── hooks/          # Shared React hooks
│       ├── img/            # Image assets
│       ├── App.tsx         # Main application and page composition
│       └── index.tsx       # Frontend entry point
├── server/                 # Express + TypeScript API
│   └── src/
│       └── server.ts       # API routes, MongoDB models, and server startup
├── package.json            # Root-level dependencies
└── README.md
```

## Prerequisites

- Node.js and npm
- A MongoDB database, either a local MongoDB instance or a MongoDB Atlas cluster
- Gmail credentials with an application password if you want the contact form to send email

## Local setup

### 1. Install dependencies

Install dependencies for the frontend and backend in separate terminals:

```bash
cd client
npm install
```

```bash
cd server
npm install
```

### 2. Configure backend environment variables

Create `server/.env` with the following values:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/c4-chess-club
FRONTEND_API_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
NODE_ENV=development
```

- `PORT` — API server port (defaults to `5000` if omitted).
- `MONGODB_URI` — MongoDB connection string. Replace the example with your Atlas URI or local database URI.
- `FRONTEND_API_URL` — Frontend origin allowed by the API's CORS configuration. For local development, use `http://localhost:3000`.
- `EMAIL_USER` — Gmail address used by Nodemailer to send contact form submissions and receive them.
- `EMAIL_PASS` — Gmail application password (not your regular Gmail password). Email delivery requires valid credentials.
- `NODE_ENV` — Set to `development` for local work. The server serves the built frontend when set to `production`.

Keep `.env` files and credentials private; do not commit real secrets.

### 3. Start the API server

From the `server/` directory:

```bash
npm run dev
```

The API listens on `http://localhost:5000`. The frontend's development proxy is configured to forward requests to this address.

### 4. Start the frontend

In a second terminal, from the `client/` directory:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

### Frontend (`client/`)

| Command | Description |
| --- | --- |
| `npm start` | Start the React development server. |
| `npm test` | Run the frontend test runner. |
| `npm run build` | Create an optimized production build in `client/build/`. |

### Backend (`server/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API in development with nodemon. |
| `npm run build` | Compile the TypeScript backend. |
| `npm start` | Start the compiled backend. |

## Production build

Build the frontend and backend from their respective directories:

```bash
cd client && npm run build
cd ../server && npm run build
```

Set `NODE_ENV=production` in the server environment and configure the database, CORS origin, and email credentials for your deployment. The backend is configured to serve the frontend build in production. Review the server's static-file path and deployment layout when choosing where to host the compiled API and frontend assets.

## Notes

- The backend expects MongoDB to be available and connects using `MONGODB_URI`.
- The frontend can load and display dynamic content from the API; a database populated with club content will provide the most complete experience.
- The backend package currently defines a placeholder test script; automated backend tests are not configured.
