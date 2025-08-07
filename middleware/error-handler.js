const errorHandler = (err, req, res, next) => { // Fehlerbehandlungs-Middleware
    console.error(err.stack); // Hier wird der Fehler-Stack in der Konsole ausgegeben
    res.status(500).json({  // Sende eine JSON-Antwort mit dem Fehler
        error: 'Ein interner Serverfehler ist aufgetreten.' // Allgemeine Fehlermeldung
    }); // Sende eine JSON-Antwort mit dem Fehler
}

export { errorHandler }; // Exportiere die Fehlerbehandlungs-Middleware, damit sie in anderen Dateien verwendet werden kann
