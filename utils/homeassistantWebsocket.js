import WebSocket from 'ws';
import { HA_AUTH_MESSAGE, HA_WS } from '../constants';
const ws = new WebSocket(HA_WS);
ws.on('open', () => console.log('Socket connected...'));
ws.on('message', (message) => {
	console.log(`[WS]\t${message}`);
	if (message.type === 'auth_required') ws.send(HA_AUTH_MESSAGE);
});
export default ws;
