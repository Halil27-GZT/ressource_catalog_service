const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Hier wird der Fehler-Stack in der Konsole ausgegeben
    res.status(500).json({ 
        error: 'Ein interner Serverfehler ist aufgetreten.' 
    }); // Sende eine JSON-Antwort mit dem Fehler
}

export { errorHandler };
