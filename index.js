import express from 'express';
import axios from 'axios';
import { HA_AUTH_HEADER, HA_URL, PORT } from './constants';

const app = express();

app.get('/test', async (req, res) => {
	const response = await axios.get(HA_URL, HA_AUTH_HEADER);
	res.status(response.status).send(response.data);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}…`));
