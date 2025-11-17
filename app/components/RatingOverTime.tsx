// "use client";
// import { useEffect, useRef } from "react";
// import Chart from "chart.js/auto";
// // function trimAtFirstNull(labels: string[], data: (number | null)[]): { labels: string[]; data: (number | null)[] } {
// //     const i = data.findIndex(v => v == null);        // null
// //     if (i === -1) return { labels, data };           // no nulls -> keep all
// //     return { labels: labels.slice(0, i), data: data.slice(0, i) as (number | null)[] };
// // }
// function todayThailandYYYYMMDD(): string {
//     return new Intl.DateTimeFormat("en-CA", {
//         timeZone: "Asia/Bangkok",   // force Thailand timezone
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//     }).format(new Date());
// }
// export default function RatingOverTime() {
//     const todayTH = todayThailandYYYYMMDD();
//     const wrapRef = useRef<HTMLDivElement | null>(null);
//     const chartRef = useRef<HTMLCanvasElement | null>(null);
//     const chartInstance = useRef<Chart<"line", (number | null)[], string> | null>(null);
//     const rawLabels = ["6.00", "7.00", "8.00", "9.00", "10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00", "18.00"]
//     const rawData = [5, 4, 3, 5, 5, 4, 5, 2, 1, 3, 3, null, null];
//     // const { labels, data: datas } = trimAtFirstNull(rawLabels, rawData);
//     // const data = {
//     //     labels: labels,
//     //     datasets: [{
//     //         label: 'Rating Over Time',
//     //         data: datas,
//     //         fill: false,
//     //         borderColor: '#F59E0B',
//     //         tension: 0.3
//     //     }]
//     // };

//     useEffect(() => {
//         async function fetchRatingOverTime() {
//             try {
//                 const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/:driverId/ratingOverTime?date=${todayTH}`);
//                 const data = {
//                     labels: result.labels,
//                     datasets: [{
//                         label: 'Rating Over Time',
//                         data: result.data,
//                         fill: false,
//                         borderColor: '#F59E0B',
//                         tension: 0.3
//                     }]
//                 };
//             } catch (err) {
//                 console.log("Failed to fetch data ", err);
//             }
//         }
//         fetchRatingOverTime();
//         if (chartRef.current) {
//             // destroy previous chart (to avoid duplicate instances on hot reload)
//             if (chartInstance.current) {
//                 chartInstance.current.destroy();
//             }

//             chartInstance.current = new Chart(chartRef.current, {
//                 type: "line",
//                 data: data,
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                         legend: { display: true },
//                     },
//                     scales: {
//                         x: {
//                             title: { display: true, text: "time" },       // ← X-axis name
//                             // type: "time", time: { unit: "month" },     // if using dates
//                         },
//                         y: {
//                             min: 0,
//                             max: 5,
//                             ticks: {
//                                 stepSize: 1,
//                                 precision: 0
//                             },
//                             title: { display: true, text: "Cancellation" }, // ← Y-axis name
//                             beginAtZero: true
//                         }
//                     }
//                 }
//             });
//             const ro = new ResizeObserver(() => {
//                 chartInstance.current?.resize();
//             });
//             if (wrapRef.current) ro.observe(wrapRef.current);

//             const onShow = () => chartInstance.current?.resize();
//             window.addEventListener("visibilitychange", onShow);

//             return () => {
//                 window.removeEventListener("visibilitychange", onShow);
//                 ro.disconnect();
//                 chartInstance.current?.destroy();
//             };
//         }
//     }, [data]);

//     return (
//         <div ref={wrapRef} className="w-full min-w-0 h-[381px] flex justify-center items-center">
//             <canvas ref={chartRef} id="graph1" />
//         </div>
//     );
// }
"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function todayThailandYYYYMMDD(): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Bangkok",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());
}

type Props = {
	driverId: string;
};

export default function RatingOverTime({ driverId }: Props) {
	const wrapRef = useRef<HTMLDivElement | null>(null);
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	const chartInstance = useRef<Chart<"line", number[], string> | null>(null);

	useEffect(() => {
		const todayTH = todayThailandYYYYMMDD();

		async function fetchRatingOverTime() {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_BACKEND_URL}/drivers/${driverId}/ratingOverTime?date=${todayTH}`
				);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const result = (await res.json()) as {
					labels: string[];
					data: number[];
				};
				console.log(result);
				// destroy any old chart before creating a new one
				if (chartInstance.current) chartInstance.current.destroy();

				if (chartRef.current) {
					chartInstance.current = new Chart(chartRef.current, {
						type: "line",
						data: {
							labels: result.labels,
							datasets: [
								{
									label: "Rating Over Time",
									data: result.data,
									fill: false,
									borderColor: "#F59E0B",
									tension: 0.2,
								},
							],
						},
						options: {
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: { display: true },
							},
							scales: {
								x: { title: { display: true, text: "Time (TH)" } },
								y: {
									min: 0,
									max: 5,
									ticks: { stepSize: 1, precision: 0 },
									title: { display: true, text: "Rating" },
									beginAtZero: true,
								},
							},
						},
					});

					// auto-resize when container changes size
					const ro = new ResizeObserver(() => chartInstance.current?.resize());
					if (wrapRef.current) ro.observe(wrapRef.current);

					const onShow = () => chartInstance.current?.resize();
					window.addEventListener("visibilitychange", onShow);

					// cleanup
					return () => {
						window.removeEventListener("visibilitychange", onShow);
						ro.disconnect();
						chartInstance.current?.destroy();
					};
				}
			} catch (err) {
				console.error("Failed to fetch data", err);
			}
		}

		fetchRatingOverTime();
	}, [driverId]);

	return (
		<div
			ref={wrapRef}
			className="min-w-0 h-full flex justify-center items-center"
		>
			<canvas ref={chartRef} id="graph1" />
		</div>
	);
}
