import WebSocket from 'ws';
import { HA_AUTH_MESSAGE, HA_WS } from '../constants';

const ws = new WebSocket(HA_WS);
export let isSocketConnected = false;
let count = 0;
const registry = {};

const send = (data, callback) => {
	if (data.type !== 'auth') {
		if (!isSocketConnected) throw Error('Socket is not connect or authenticated.');
		count++;
		data.id = count;
		registry[data.id] = {
			request: data,
			callback,
			subscribed: data.type === 'subscribe_events'
		};
	}
	const message = JSON.stringify({ id: count, ...data });
	return ws.send(message);
}

const handlers = {
	auth_required: () => send(HA_AUTH_MESSAGE),
	auth_ok: () => isSocketConnected = true,
	event: (data) => {
		if (data.id && !registry[data.id]) commands.unsubscribeEvent(data.id, data.id);
		if (data.id && registry[data.id]) {
			if (typeof callback === 'function') callback(Object.assign({}, data));
			registry[data.id].state = data;
		}
	},
	result: (data) => {
		if (data.id && registry[data.id] !== undefined) {
			registry[data.id].response = data;
			console.log(registry[data.id]);
			if (typeof callback === 'function') callback(Object.assign({}, registry[data.id]));
			if (!registry[data.id].subscribed) registry[data.id] = undefined;
		}
	}
};

export const commands = {
	ping: (callback) => send({ type: "ping" }, callback),
	getStates: (callback) => send({ type: 'get_states' }, callback),
	getConfig: (callback) => send({ type: 'get_config' }, callback),
	getServices: (callback) => send({ type: 'get_services' }, callback),
	getPanels: (callback) => send({ type: 'get_panels' }, callback),
	callService: (callback, domain, service, service_data = undefined, target = undefined) => send({
		type: 'call_service',
		domain,
		service,
		...(service_data ? { service_data } : {}),
		...(target ? { target } : {}),
	}, callback),
	subscribeEvent: (callback, event_type = undefined) => send({
		type: 'subscribe_events',
		...(event_type ? { event_type } : {}),
	}, callback),
	unsubscribeEvent: (callback, subscription) => {
		if (registry[subscription]) registry[subscription].subscribed = false;
		send({
			type: 'unsubscribe_events',
			subscription
		}, callback);
	},
}

ws.on('message', (message) => {
	const data = JSON.parse(message);
	const handler = handlers[data.type];
	if (typeof handler === 'function') handler(data);
	else console.log(`[WS]\t${message}`);
});

export default ws;
