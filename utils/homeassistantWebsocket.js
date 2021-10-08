import WebSocket from 'ws';
import { HA_AUTH_MESSAGE, HA_WS } from '../constants';
const ws = new WebSocket(HA_WS);
ws.on('open', () => console.log('Socket connected...'));
ws.on('message', (message) => {
	console.log(`[WS]\t${message}`);
	if (JSON.parse(message).type === 'auth_required'){
		console.log('Handling Auth');
		ws.send(HA_AUTH_MESSAGE, (error) => console.error(error));
	}
});
export default ws;
