import express from 'express';
import axios from 'axios';

const HA_URL = 'http://supervisor/core/api';
const PORT = 3000;

const app = express();

app.get('/test', async (req, res) => {
	const response = await axios.get(HA_URL);
	res.status(response.status).send(response.data);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}…`));
