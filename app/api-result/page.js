"use client";

import { useEffect, useState } from "react";

export default function ApiResult() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://api.susaf.se4gd.eu/api/v1/effects/YtGX4fvKrGWNuV5VgosaT9xU",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({}),
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4 text-black"> {/* Change font color to black for better contrast */}
            <h1 className="text-xl font-bold text-blue-700">API Result</h1> {/* Highlight title */}
            {loading && <p className="text-gray-700">Loading...</p>} {/* Darker text for readability */}
            {error && <p className="text-red-600 font-semibold">Error: {error}</p>} {/* More visible error message */}
            {data && (
                <pre className="bg-gray-800 text-white p-2 rounded"> {/* Darker background with white text */}
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
}