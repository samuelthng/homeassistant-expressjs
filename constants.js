export const HA_URL = 'http://supervisor/core/api';

export const PORT = 3000;

export const HA_AUTH_HEADER = {
	headers: {
		'Authorization': `token ${process.env.SUPERVISOR_TOKEN}`
	}
};
