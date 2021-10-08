import express from 'express';
import axios from 'axios';
import { HA_AUTH_HEADER, HA_URL, PORT } from './constants';

const app = express();

app.get('/api/config', async (req, res) => {
	try {
		const response = await axios.get(`${HA_URL}/config`, HA_AUTH_HEADER);
		res.status(response.status).send(response.data);
	} catch (error) {
		res.status(400).send(error);
	}
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}…`));
