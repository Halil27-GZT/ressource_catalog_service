import express from 'express'; // Importiere express für die Router-Funktionalität
import { readFileSync, writeFileSync } from 'fs'; // Importiere Funktionen zum Lesen und Schreiben von Dateien
import path from 'path'; // Importiere path für die Dateipfade
import { fileURLToPath } from 'url'; // Importiere fileURLToPath, um den Dateipfad aus der URL zu extrahieren
import { v4 as uuidv4 } from 'uuid'; // Importiere uuidv4 für die Generierung von eindeutigen IDs

const router = express.Router(); // Erstelle einen neuen Router


const __filename = fileURLToPath(import.meta.url); // Hole den aktuellen Dateinamen
const __dirname = path.dirname(__filename); // Hole das Verzeichnis der aktuellen Datei
const data_file = path.join(__dirname, '../data', 'resources.json'); // Definiere den Pfad zur JSON-Datei, die die Ressourcen enthält


router.get('/', (req, res, next) => { // Alle Ressourcen laden
    try { 
        const data = readFileSync(data_file, 'utf8'); // hier wird die Datei synchron gelesen
        
        const resources = JSON.parse(data); // hier wird der JSON-String in ein JavaScript-Array umgewandelt
        res.json(resources); // Sende die Ressourcen als JSON-Antwort zurück
    } catch (error) { // Fehlerbehandlung an die Fehlerbehandlungs-Middleware weiterleiten
        next(error); 
        // res.status(500).json({ error: 'Interner Serverfehler beim Laden der Ressourcen-Daten.' });
    }
});


router.get('/:id', (req, res, next) => { // Eine einzelne Ressource nach ID laden
    try {
        const resourceId = req.params.id; // ID aus den URL-Parametern extrahieren
        const data = readFileSync(data_file, 'utf8'); // Dateiinhalt lesen
        const resources = JSON.parse(data); // JSON-String in ein JavaScript-Array umwandeln
        const resource = resources.find(r => r.id === resourceId); // Die Ressource nach der ID suchen

        if (resource) { // Wenn die Ressource gefunden wurde, sende sie als JSON-Antwort zurück
            res.json(resource); // Sende die gefundene Ressource als JSON-Antwort zurück
        } else { // Wenn die Ressource nicht gefunden wurde, sende eine 404-Fehlermeldung
            res.status(404).json({ error: `Ressource mit ID ${resourceId} nicht gefunden.` }) // Sende eine 404-Fehlermeldung zurück
        }

    } catch (error) { // Fehlerbehandlung an die Fehlerbehandlungs-Middleware weiterleiten
        next(error);
        // res.status(500).json({ error: 'Interner Serverfehler beim Laden der Ressourcen-Daten.' });
    }
});


router.post('/', (req, res, next) => { // Neue Ressource erstellen
    const newData = req.body; // Die neuen Daten aus dem Request-Body extrahieren
    if (!newData.title || !newData.type) { // Überprüfen, ob die erforderlichen Felder vorhanden sind
        res.status(400).json({ error: 'title und type sind erforderlich.' }); // Wenn nicht, sende eine 400-Fehlermeldung zurück
        return; // Beende die Funktion, wenn die erforderlichen Felder fehlen
    }

    const newResource = { // Erstelle ein neues Resource-Objekt
        id: uuidv4(), // Generiere eine eindeutige ID für die neue Ressource
        ...newData // Füge die neuen Daten in das Resource-Objekt ein
    }

    try { // Speichere die neue Ressource in der Datei
        // 2. Vorhandene Daten aus der Datei lesen und in einem Array speichern.
        const data = readFileSync(data_file, 'utf8'); // Lese die Dateiinhalt synchron
        const resources = JSON.parse(data); // Wandle den JSON-String in ein JavaScript-Array um
        // 3. Das neue Objekt in das Array hinzufuegen.
        resources.push(newResource); // Füge die neue Ressource zum Array der vorhandenen Ressourcen hinzu
        // 4. Das neue Array in die Datei schreiben.
        writeFileSync(data_file, JSON.stringify(resources, null, 2), 'utf8'); // Speichere das aktualisierte Array in der Datei, formatiert mit 2 Leerzeichen Einrückung
        // 5. Antwort schicken.
        res.status(201).json(newResource); // Sende die neu erstellte Ressource als JSON-Antwort zurück mit Status 201 (Created)
    } catch (error) {
        // Fehler an die Fehlerbehandlungs-Middleware weiterleiten
        next(error);
        // res.status(500).json({ error: 'Interner Serverfehler beim Speichern der Ressourcen-Daten.' });
    }

});


router.put('/:id', (req, res, next) => { // Eine Ressource aktualisieren
    // 1. ID auslesen
    const resourceId = req.params.id; // ID aus den URL-Parametern extrahieren
    const newData = req.body; // Die neuen Daten aus dem Request-Body extrahieren

    if (Object.keys(newData).length === 0) { // Überprüfen, ob neue Daten zum Aktualisieren vorhanden sind
        res.status(400).json({ error: 'Keine Daten zum Aktualisieren vorhanden.' }); // Wenn nicht, sende eine 400-Fehlermeldung zurück
        return; // Beende die Funktion, wenn keine neuen Daten zum Aktualisieren vorhanden sind
    }

    try {
        // 2. Alle Ressourcen laden
        const data = readFileSync(data_file, 'utf8'); // Lese die Dateiinhalt synchron
        const resources = JSON.parse(data); // Wandle den JSON-String in ein JavaScript-Array um

        // 3. Die Ressource nach der ID suchen
        // const resource = resources.find(r => r.id === resourceId);
        const resourceIndex = resources.findIndex(r => r.id === resourceId); // Suche den Index der Ressource im Array nach der ID

        // 4. Wenn die Ressource nicht existiert, dann 404
        if (resourceIndex === -1) { // Wenn die Ressource nicht gefunden wurde
            res.status(404).json({ error: `Ressource mit ID ${resourceId} nicht gefunden.` }); // Wenn die Ressource nicht gefunden wurde, sende eine 404-Fehlermeldung zurück
            return;
        }

        // 5. Wenn die Ressource existiert - updaten
        resources[resourceIndex] = { ...resources[resourceIndex], ...newData };

        // 6. Updates in der Datei speichern.
        writeFileSync(data_file, JSON.stringify(resources, null, 2), 'utf8');

        res.status(200).json(resources[resourceIndex]); // 7. Antwort schicken

    } catch (error) {
        // Fehler an die Fehlerbehandlungs-Middleware weiterleiten
        next(error);
        // res.status(500).json({ error: 'Interner Serverfehler bei der Verarbeitung der Ressourcen-Daten.' });
    }

});


router.delete('/:id', (req, res, next) => {
    // 1. ID auslesen
    const resourceId = req.params.id;
    try {
        // 2. Alle Ressourcen laden
        const data = readFileSync(data_file, 'utf8');
        const resources = JSON.parse(data);

        // 3. Die Ressource nach der ID suchen
        const resourceIndex = resources.findIndex(r => r.id === resourceId);

        // 4. Wenn die Ressource nicht existiert, dann 404
        if (resourceIndex === -1) {
            res.status(404).json({ error: `Ressource mit ID ${resourceId} nicht gefunden.` });
            return;
        }

        // 5. Wenn die Ressource existiert - entfernen
        resources.splice(resourceIndex, 1);

        // 6. Updates in der Datei speichern.
        writeFileSync(data_file, JSON.stringify(resources, null, 2), 'utf8');

        res.status(204).send(); // 7. Leere Antwort mit Status 204 zurückgeben

    } catch (error) {
        // Fehler an die Fehlerbehandlungs-Middleware weiterleiten
        next(error);
        // res.status(500).json({ error: 'Interner Serverfehler beim Löschen der Ressourcen-Daten.' });
    }
});

export default router; // Exportiere den Router, damit er in anderen Dateien verwendet werden kann