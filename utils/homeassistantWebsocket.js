import WebSocket from 'ws';
import { HA_AUTH_MESSAGE, HA_WS } from '../constants';

const ws = new WebSocket(HA_WS);
export const isSocketConnected = false;

const send = (data) => {
	const message = JSON.stringify(data);
	return ws.send(message);
}

const handlers = {
	auth_required: () => send(HA_AUTH_MESSAGE),
	auth_ok: () => isSocketConnected = true,
};

ws.on('message', (message) => {
	const data = JSON.parse(message);
	const handler = handlers[data.type];
	if (typeof handler === 'function') handler(data);
	else console.log(`[WS]\t${message}`);
});

export default ws;
