import 'dotenv/config'; // Importiere Umgebungsvariablen aus der .env-Datei
import express from 'express'; // Importiere das Express-Modul
import resourcesRouter from './routes/resources.js'; // Importiere den Ressourcen-Router
import { errorHandler } from './middleware/error-handler.js'; // Importiere die Fehlerbehandlungs-Middleware

const PORT = process.env.PORT || 5002; // Definiere den Port, auf dem der Server laufen soll, entweder aus der .env-Datei oder als Fallback 5002

const app = express(); // Erstelle eine neue Express-Anwendung

// Middleware (pre-routing)
app.use(express.json()); // Middleware zum Parsen von JSON-Daten im Request-Body

// Routes
app.use('/resources', resourcesRouter); // Registriere den Ressourcen-Router unter dem Pfad /resources

// globale Fehlerbehandlung Middleware (post-routing)
app.use(errorHandler);

app.listen(PORT, () => { // Starte den Server und 
    console.log(`Server is running at http://localhost:${PORT}`); // gebe eine Nachricht in der Konsole aus, wenn der Server läuft
}); 