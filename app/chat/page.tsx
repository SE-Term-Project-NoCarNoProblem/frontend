"use client";
import { Avatar } from "@mui/material";
import { IconButton } from "@mui/material";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { useRouter, useSearchParams } from "next/navigation";
import { connectSocket, disconnectSocket } from "../lib/socket";
import { fetchWithAuth } from "../lib/api";

export interface ChatMessage {
	id: string;
	content: string;
	rideId: string;
	timestamp: Date;
	senderId: string;
}

interface RideDetails {
	id: string;
	customer_id: string;
	driver_id: string;
	customer?: {
		id: string;
		user: {
			fullname: string;
			email: string;
			phone_number: string;
			profile_pic?: string;
		};
	};
	verified_driver?: {
		id: string;
		rating: number;
		driver: {
			user: {
				fullname: string;
				email: string;
				phone_number: string;
				profile_pic?: string;
			};
		};
	};
	vehicle?: {
		id: string;
		registration: string;
		model: string;
		make: string;
		color: string;
	};
}

export default function Chat() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const rideId = searchParams.get("rideId");

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(true);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const userIsDriver = rideDetails && currentUserId === rideDetails.driver_id;

	const partnerName = userIsDriver
		? rideDetails?.customer?.user.fullname || "Customer"
		: rideDetails?.verified_driver?.driver.user.fullname || "Driver";

	const partnerInfo = userIsDriver
		? "" // Customers don't have vehicle info
		: rideDetails?.vehicle
			? `${rideDetails.vehicle.make} ${rideDetails.vehicle.model} (${rideDetails.vehicle.color}) : ${rideDetails.vehicle.registration}`
			: "Vehicle information not available";

	const rating = userIsDriver
		? undefined
		: rideDetails?.verified_driver?.rating || 0;

	async function getChatMessages(rideId: string): Promise<ChatMessage[]> {
		const response = await fetchWithAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/messages/${rideId}`
		);
		if (!response.ok) {
			throw new Error("Failed to fetch chat messages");
		}
		const data = await response.json();
		return data.messages.map((m: any) => ({
			...m,
			timestamp: new Date(m.timestamp),
		}));
	}

	async function getRideDetails(rideId: string): Promise<RideDetails> {
		const response = await fetchWithAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/rides/${rideId}`
		);
		if (!response.ok) {
			throw new Error("Failed to fetch ride details");
		}
		return await response.json();
	}

	async function sendChatMessage(
		rideId: string,
		content: string
	): Promise<void> {
		const response = await fetchWithAuth(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/message/${rideId}`,
			{
				method: "POST",
				body: JSON.stringify({ content }),
			}
		);
		if (!response.ok) {
			throw new Error("Failed to send message");
		}
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (!rideId) {
			console.error("No rideId provided");
			return;
		}

		// Get current user ID from API
		fetchWithAuth(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch current user");
				}
				return response.json();
			})
			.then((data) => {
				setCurrentUserId(data.data.id);
			})
			.catch((error) => {
				console.error("Failed to get current user:", error);
			});

		// Fetch initial messages
		getChatMessages(rideId)
			.then((data) => {
				setMessages(data);
			})
			.catch((error) => {
				console.error("Failed to load messages:", error);
			});

		getRideDetails(rideId)
			.then((data) => {
				setRideDetails(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Failed to load ride details:", error);
				setLoading(false);
			});

		const socket = connectSocket();

		socket.on(
			"chat:new_message",
			(data: { rideId: string; senderId: string; content: string }) => {
				if (data.rideId === rideId) {
					setMessages((prev) => [
						...prev,
						{
							id: `temp-${Date.now()}`,
							content: data.content,
							rideId: data.rideId,
							timestamp: new Date(),
							senderId: data.senderId,
						},
					]);
				}
			}
		);

		return () => {
			socket.off("chat:new_message");
			disconnectSocket();
		};
	}, [rideId]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !rideId) return;

		try {
			await sendChatMessage(rideId, newMessage);
			setNewMessage("");
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	const handleClick = () => {
		router.push("/location");
	};

	if (!rideId) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p className="text-red-500">Error: No ride ID provided</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-screen bg-white">
			<div className="flex fixed w-full bg-[#D9D9D9] z-10">
				<div className="m-2 flex items-center">
					<IconButton onClick={handleClick}>
						<Image
							src="/icons/left-arrow.svg"
							alt="back icon"
							width={30}
							height={30}
						/>
					</IconButton>
				</div>
				<div className="flex flex-start items-center text-[#0E4663]">
					<div className="relative flex rounded-full bg-white w-15 h-15 items-center justify-center border-4 m-3 mx-4 border-gray-300">
						<Image
							alt="Profile Picture"
							src={`./globe.svg`}
							width={52}
							height={52}
							className="rounded-full"
						/>
						{rating ? (
							<div className="absolute border-2 border-white -bottom-2.5 bg-[#0E4663] rounded-full px-2 text-sm text-[#F8F8F8]">
								<span>{rating.toFixed(1)}</span>
								<span className="text-yellow-400">★</span>
							</div>
						) : (
							<div></div>
						)}
					</div>
					<div className="flex flex-col justify-center items-start mx-4 ">
						<p className="font-semibold text-[16px]">{partnerName}</p>
						{partnerInfo && <p className="text-[10px]">{partnerInfo}</p>}
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto mt-24 mb-24 px-5">
				{loading ? (
					<div className="flex justify-center items-center h-full">
						<p>Loading messages...</p>
					</div>
				) : messages.length === 0 ? (
					<div className="flex justify-center items-center h-full">
						<p className="text-gray-500">
							No messages yet. Start the conversation!
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{messages.map((message) => {
							const isOwnMessage = message.senderId === currentUserId;
							return (
								<div
									key={message.id}
									className={`flex gap-4 ${isOwnMessage ? "ml-auto" : "flex-row"}`}
								>
									{!isOwnMessage && (
										<Avatar sx={{ bgcolor: "#0E4663", color: "white" }}>
											{partnerName
												.split(" ")
												.map((n: string) => n[0])
												.join("")}
										</Avatar>
									)}
									<div
										className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
									>
										<div
											className={`px-4 py-2 rounded-lg max-w-md ${
												isOwnMessage
													? "bg-[#0E4663] text-white"
													: "bg-gray-200 text-black"
											}`}
										>
											{message.content}
										</div>
										<span className="text-xs text-gray-500 mt-1">
											{message.timestamp.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>
									{isOwnMessage && (
										<Avatar sx={{ bgcolor: "#4CAF50", color: "white" }}>
											You
										</Avatar>
									)}
								</div>
							);
						})}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			<div className="flex justify-center fixed bottom-6 w-full px-3">
				<Paper
					component="form"
					onSubmit={handleSendMessage}
					sx={{
						p: "2px 4px",
						display: "flex",
						alignItems: "center",
						width: "100%",
						maxWidth: "1000px",
					}}
				>
					<InputBase
						multiline
						minRows={1}
						maxRows={5}
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSendMessage(e as any);
							}
						}}
						sx={{
							ml: 1,
							flex: 1,
							"& .MuiInputBase-input": {
								resize: "none",
								whiteSpace: "pre-wrap",
							},
						}}
						placeholder={`send message to ${partnerName}`}
						inputProps={{ "aria-label": `send message to ${partnerName}` }}
					/>{" "}
					<IconButton
						type="submit"
						color="primary"
						sx={{ p: "10px" }}
						aria-label="send"
						disabled={!newMessage.trim()}
					>
						<Image
							src="/icons/send.svg"
							alt="send icon"
							width={24}
							height={24}
						/>
					</IconButton>
				</Paper>
			</div>
		</div>
	);
}
