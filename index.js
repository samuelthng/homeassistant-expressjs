import express from 'express';
import axios from 'axios';
import { HA_AUTH_HEADER, HA_URL, PORT } from './constants';
import socket from './utils/homeassistantWebsocket';

const app = express();

app.get('/homeassistant*', async (req, res) => {
	const { originalUrl } = req;
	const query = originalUrl.split('/homeassistant')[1];
	if (!query) res.status(400).send({ message: "Invalid endpoint." });
	try {
		const response = await axios.get(`${HA_URL}${query}`, HA_AUTH_HEADER);
		res.status(response.status).send(response.data);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.post('/homeassistant*', async (req, res) => {
	const { originalUrl } = req;
	const query = originalUrl.split('/homeassistant')[1];
	if (!query) res.status(400).send({ message: "Invalid endpoint." });
	try {
		const response = await axios.post(`${HA_URL}${query}`, req.body, HA_AUTH_HEADER);
		res.status(response.status).send(response.data);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}…`));

console.log(socket);
