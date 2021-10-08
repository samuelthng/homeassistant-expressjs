import WebSocket from 'ws';
import { HA_AUTH_MESSAGE, HA_WS } from '../constants';

const ws = new WebSocket(HA_WS);
export const isSocketConnected = false;

const registry = {};

const send = (data, callback) => {
	if (!isSocketConnected && data.type !== 'auth') throw Error('Socket is not connect or authenticated.');
	if (data.id) registry[id] = {
		request: data,
		callback,
		subscribed: data.type === 'subscribe_events'
	};
	const message = JSON.stringify(data);
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
	ping: (id, callback) => send({ id, type: "ping" }, callback),
	getStates: (id, callback) => send({ id, type: 'get_states' }, callback),
	getConfig: (id, callback) => send({ id, type: 'get_config' }, callback),
	getServices: (id, callback) => send({ id, type: 'get_services' }, callback),
	getPanels: (id, callback) => send({ id, type: 'get_panels' }, callback),
	callService: (id, callback, domain, service, service_data = undefined, target = undefined) => send({
		id,
		type: 'call_service',
		domain,
		service,
		...(service_data ? { service_data } : {}),
		...(target ? { target } : {}),
	}, callback),
	subscribeEvent: (id, callback, event_type = undefined) => send({
		id,
		type: 'subscribe_events',
		...(event_type ? { event_type } : {}),
	}, callback),
	unsubscribeEvent: (id, callback, subscription) => {
		if (registry[subscription]) registry[subscription].subscribed = false;
		send({
			id,
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
