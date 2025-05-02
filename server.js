import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: 'adforce-solution.com',
    user: 'uvz4vwxnacdec',
    password: '1*e^c32BK(&1',
    database: 'db85rygu1vbtt1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
});

app.get('/api/media', (req, res) => {
    if (db.state === 'disconnected') {
        console.error('La connexion MySQL est fermée.');
        res.status(500).send('Erreur : Connexion MySQL fermée.');
        return;
    }

    const query = 'SELECT * FROM cartographie_medias';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des données :', err);
            res.status(500).send('Erreur serveur');
            return;
        }
        res.json(results);
    });
});

db.on('error', (err) => {
    console.error('Erreur MySQL :', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconnexion à la base de données...');
        db.connect((error) => {
            if (error) {
                console.error('Erreur lors de la reconnexion :', error);
            } else {
                console.log('Reconnexion réussie.');
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Serveur backend en cours d'exécution sur http://localhost:${port}`);
});
