# MyStudyPlanner

## Link al deploy
https://study-planner-github-io.onrender.com

## Struttura del progetto
- backend: server Node.js + Express
- frontend: applicazione Ionic + Angular

## Tecnologie
- Frontend: Ionic, Angular, TypeScript
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Deployment: Render

## Installazione e avvio - Backend
1. Posizionarsi nella cartella `backend`
2. Installare le dipendenze:
   npm install
3. Creare un file `.env` con le seguenti variabili:
   MONGO_URI=mongodb+srv://admin:S6868645s_@mystudyplanner.q8wra1y.mongodb.net/?appName=mystudyplanner
   PORT=3000
4. Avviare il server con:
   npm run start

## API disponibili
### Tasks
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

### Focus Sessions
- GET /api/focus-sessions
- POST /api/focus-sessions

## Note
Il file `.env` non è incluso nel repository.
