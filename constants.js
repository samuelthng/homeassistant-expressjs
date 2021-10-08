const { SUPERVISOR_TOKEN } = process.env;

export const HA_BASE = `http://supervisor/core`;

export const HA_URL = `${HA_BASE}/api`;

export const HA_WS = `ws://supervisor/core/websocket`;

export const HA_AUTH_MESSAGE = { "type": "auth", "access_token": SUPERVISOR_TOKEN }

export const HA_AUTH_HEADER = {
	headers: {
		'Authorization': `Bearer ${SUPERVISOR_TOKEN}`,
		'Content-Type': 'application/json'
	}
};

export const PORT = 3000;
