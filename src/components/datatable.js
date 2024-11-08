import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

// DataTable component that fetches data from an API and renders a table with D3
function DataTable({ apiUrl }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data when the component mounts
    useEffect(() => {
        if (apiUrl) {
            setLoading(true);  // Show loading initially
            fetch(apiUrl)
                .then(response => response.json())
                .then(fetchedData => {
                    setData(fetchedData); // Set the fetched data
                    setLoading(false); // Data loaded, stop loading
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setLoading(false); // Stop loading on error
                });
        }
    }, [apiUrl]); // Dependency array ensures this runs again if `apiUrl` changes

    // Render loading state or the table if data is available
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div id="d3-table-container" className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        {/* Render table headers dynamically based on the keys of the first object in data */}
                        {Object.keys(data[0]).map(header => (
                            <th key={header} className="px-4 py-2 border bg-gray-200 text-left">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {/* For each row, render the values of the properties dynamically */}
                            {Object.keys(row).map((key, colIndex) => (
                                <td key={colIndex} className="px-4 py-2 border">
                                    {/* If the value is an object, display its properties (assuming they are simple strings or numbers) */}
                                    {typeof row[key] === 'object' ? 
                                        Object.values(row[key]).join(", ") : 
                                        row[key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
