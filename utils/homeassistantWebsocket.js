import WebSocket from 'ws';
import { HA_WS, SUPERVISOR_TOKEN } from '../constants';
const ws = new WebSocket(HA_WS, { auth: SUPERVISOR_TOKEN });
ws.on('open', () => console.log('Socket connected...'));
ws.on('message', (message) => {
	console.log(`[WS]\t${message}`);
});
export default ws;
