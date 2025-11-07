"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function RatingOverTime() {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const labels = ["6.00", "7.00", "8.00", "9.00", "10.00", "11.00", "12.00", "13.00", "14.00", "15.00", "16.00", "17.00", "18.00"]
    const data = {
        labels: labels,
        datasets: [{
            label: 'Rating Over Time',
            data: [5, 4, 3, 5, 5, 4, 5, 2, 1, 3, 3, 5, 4,],
            fill: false,
            borderColor: '#F59E0B',
            tension: 0.3
        }]
    };

    useEffect(() => {
        if (chartRef.current) {
            // destroy previous chart (to avoid duplicate instances on hot reload)
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(chartRef.current, {
                type: "line",
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true },
                    },
                    scales: {
                        x: {
                            title: { display: true, text: "time" },       // ← X-axis name
                            // type: "time", time: { unit: "month" },     // if using dates
                        },
                        y: {
                            min: 0,
                            max:5,
                            ticks:{
                                stepSize:1,
                                precision:0
                            },
                            title: { display: true, text: "Cancellation" }, // ← Y-axis name
                            beginAtZero: true
                        }
                    }
                }
            });
            const ro = new ResizeObserver(() => {
                chartInstance.current?.resize();
            });
            if (wrapRef.current) ro.observe(wrapRef.current);

            
            const onShow = () => chartInstance.current?.resize();
            window.addEventListener("visibilitychange", onShow);

            return () => {
                window.removeEventListener("visibilitychange", onShow);
                ro.disconnect();
                chartInstance.current?.destroy();
            };
        }
    }, [data]);

    return (
        <div ref={wrapRef} className="w-full min-w-0 h-[381px] flex justify-center items-center">
            <canvas ref={chartRef} id="graph1"  />
        </div>
    );
}
