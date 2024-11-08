import React, { useEffect, useState } from "react";
import * as d3 from "d3";

function DataTable({ apiUrl, columnsToDisplay, editable }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    if (apiUrl) {
      setLoading(true); // Show loading initially
      fetch(apiUrl)
        .then((response) => response.json())
        .then((fetchedData) => {
          setData(fetchedData); // Set the fetched data
          setLoading(false); // Data loaded, stop loading
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false); // Stop loading on error
        });
    }
  }, [apiUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Filter the columns if `columnsToDisplay` is passed
  const filteredData = data.map((row) => {
    const filteredRow = {};
    columnsToDisplay.forEach((col) => {
      if (row[col] !== undefined) {
        filteredRow[col] = row[col];
      }
    });
    return filteredRow;
  });

  const handleEdit = (row) => {
    console.log("Editing", row); // Replace with actual edit logic
  };

  const handleDelete = (row) => {
    console.log("Deleting", row); // Replace with actual delete logic
  };

  if (editable) {
    return (
      <div id="d3-table-container" className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-transparent drop-shadow-md">
          <thead>
            <tr>
              {columnsToDisplay.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 border-2 border-inherit bg-yellow-600 text-left font-bold text-lg capitalize drop-shadow-lg"
                >
                  {header}
                </th>
              ))}
              <th className="px-4 py-2 border-2 border-inherit bg-yellow-600 text-left font-bold text-lg capitalize drop-shadow-lg">
                Actions
              </th>{" "}
              {/* Actions column */}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columnsToDisplay.map((key, colIndex) => (
                    <td key={colIndex} className="px-4 py-2 border text-white">
                      {typeof row[key] === "object"
                        ? Object.values(row[key]).join(", ")
                        : row[key]}
                    </td>
                  ))}
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEdit(row.id)}
                      className="realtive px-3 py-1 mb-2 bg-blue-500 text-white drop-shadow-md rounded mr-2 hover:bg-blue-600 hover:ring-1 hover:ring-white duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="realtive px-3 py-1 bg-red-500 text-white drop-shadow-md rounded hover:bg-red-600 hover:ring-1 hover:ring-white duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnsToDisplay.length + 1}>
                  No data available for selected columns
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div id="d3-table-container" className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-transparent drop-shadow-md">
        <thead>
          <tr>
            {columnsToDisplay.map((header) => (
              <th
                key={header}
                className="px-4 py-2 border-2 border-inherit bg-yellow-600 text-left font-bold text-lg capitalize drop-shadow-lg"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columnsToDisplay.map((key, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border text-white">
                  {typeof row[key] === "object"
                    ? Object.values(row[key]).join(", ")
                    : row[key]}
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
