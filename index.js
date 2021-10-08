import express from 'express';

const HA_URL = 'http://supervisor/core/api';

const app = express();

app.get('/test', async (req, res) => {
	const response = await fetch(HA_URL, { method: 'GET' });
	const data = await response.json();
	res.status(response.status).send(data);
});
