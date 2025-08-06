import express from 'express'; // Importiere express für die Router-Funktionalität
import { readFileSync, writeFileSync } from 'fs'; // Importiere Funktionen zum Lesen und Schreiben von Dateien
import path from 'path'; // Importiere path für die Dateipfade
import { fileURLToPath } from 'url'; // Importiere fileURLToPath, um den Dateipfad aus der URL zu extrahieren
import { v4 as uuidv4 } from 'uuid'; // Importiere uuidv4 für die Generierung von eindeutigen IDs

const router = express.Router(); // Erstelle einen neuen Router


const __filename = fileURLToPath(import.meta.url); // Hole den aktuellen Dateinamen
const __dirname = path.dirname(__filename); // Hole das Verzeichnis der aktuellen Datei
const data_file = path.join(__dirname, '../data', 'resources.json'); // Definiere den Pfad zur JSON-Datei, die die Ressourcen enthält


router.get('/', (req, res, next) => {
    try {
        const data = readFileSync(data_file, 'utf8');
        const resources = JSON.parse(data);
        res.json(resources);
    } catch (error) {
        // Fehler an die Fehlerbehandlungs-Middleware weiterleiten
        next(error);
        // res.status(500).json({ error: 'Interner Serverfehler beim Laden der Ressourcen-Daten.' });
    }
});


router.get('/:id', (req, res, next) => {
    try {
        const resourceId = req.params.id;
        const data = readFileSync(data_file, 'utf8');
        const resources = JSON.parse(data);
        const resource = resources.find(r => r.id === resourceId);

        if (resource) {
            res.json(resource);
        } else {
            res.status(404).json({ error: `Ressource mit ID ${resourceId} nicht gefunden.` })
        }

    } catch (error) {
        // Fehler an die Fehlerbehandlungs-Middleware weiterleiten
        next(error);
        // res.status(500).json({ error: 'Interner Serverfehler beim Laden der Ressourcen-Daten.' });
    }
});


router.post('/', (req, res, next) => {
    const newData = req.body;

    if (!newData.title || !newData.type) {
        res.status(400).json({ error: 'title und type sind erforderlich.' });
        return;
    }

    // 1. Neues Resource Objekt

    const newResource = {
        id: uuidv4(),
        ...newData
    }

    try {
        // 2. Vorhandene Daten aus der Datei lesen und in einem Array speichern.
        const data = readFileSync(data_file, 'utf8');
        const resources = JSON.parse(data);
        // 3. Das neue Objekt in das Array hinzufuegen.
        resources.push(newResource);
        // 4. Das neue Array in die Datei schreiben.
        writeFileSync(data_file, JSON.stringify(resources, null, 2), 'utf8');
        // 5. Antwort schicken.
        res.status(201).json(newResource);
    } catch (error) {
        // Fehler an die Fehlerbehandlungs-Middleware weiterleiten
        next(error);
        // res.status(500).json({ error: 'Interner Serverfehler beim Speichern der Ressourcen-Daten.' });
    }

});


router.put('/:id', (req, res, next) => {
    // 1. ID auslesen
    const resourceId = req.params.id;
    const newData = req.body;

    if (Object.keys(newData).length === 0) {
        res.status(400).json({ error: 'Keine Daten zum Aktualisieren vorhanden.' });
        return;
    }

    try {
        // 2. Alle Ressourcen laden
        const data = readFileSync(data_file, 'utf8');
        const resources = JSON.parse(data);

        // 3. Die Ressource nach der ID suchen
        // const resource = resources.find(r => r.id === resourceId);
        const resourceIndex = resources.findIndex(r => r.id === resourceId);

        // 4. Wenn die Ressource nicht existiert, dann 404
        if (resourceIndex === -1) {
            res.status(404).json({ error: `Ressource mit ID ${resourceId} nicht gefunden.` });
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

export default router;