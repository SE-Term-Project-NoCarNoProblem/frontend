import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
	if (!socket) {
		const token = localStorage.getItem("token");
		socket = io(
			new URL(process.env.NEXT_PUBLIC_BACKEND_URL!).origin.replaceAll(
				"http",
				"ws"
			),
			{
				path: "/socket.io/",
				auth: {
					token: localStorage.getItem("token") || "",
				},
			}
		);
	}
	return socket;
}

export function connectSocket() {
	const socket = getSocket();
	if (!socket.connected) {
		socket.connect();
	}
	return socket;
}

export function disconnectSocket() {
	if (socket && socket.connected) {
		socket.disconnect();
	}
}
