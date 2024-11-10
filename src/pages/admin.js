import "./admin.css";
import DataTable from "../components/datatable";
import axios from "axios";
import React, { useEffect, useState, useRef, useMemo } from "react";
import * as d3 from "d3";

const Admin = () => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [adminPageData, setAdminPageData] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // Graphs
  const chartContainerRef = useRef(null);

  const drawPurchaseHistoryChart = (purchaseHistory, container) => {
    const processData = (data) => {
      const purchasesByDate = data.reduce((acc, entry) => {
        const date = new Date(entry.purchaseDate).toLocaleDateString(); // Convert to simple date string
        acc[date] = (acc[date] || 0) + 1; // Count purchases per date
        return acc;
      }, {});

      const result = Object.keys(purchasesByDate).map((date) => ({
        date: new Date(date), // Convert back to Date object for D3
        count: purchasesByDate[date],
      }));

      console.log("Processed data:", result); // Log processed data
      return result;
    };

    const data = processData(purchaseHistory).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    // Clear any existing SVG in the container
    d3.select(container).selectAll("svg").remove();

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width - margin.left - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([height - margin.top - margin.bottom, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5));

    svg.append("g").call(d3.axisLeft(y));

    // Draw line only if data is non-empty
    if (data.length > 1) {
      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x((d) => x(new Date(d.date))) // Ensure `date` is interpreted correctly
            .y((d) => y(d.count))
        );
    }
  };

  const [branchFormData, setbranchFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetNumber: "",
    streetName: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    latitude: 0,
    longitude: 0,
    makesDeliveries: false,
    hasTakeaway: false,
    hasDineIn: false,
  });

  const handleEditSubmit = async () => {
    try {
      // Update the backend with the edited data
      const response = await fetch(`/api/update-row/${editingRow.id}`, {
        method: "PUT",
        body: JSON.stringify(editingRow),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        handleMenuClick(selectedMenu);

        setIsModalOpen(false); // Close the modal after the update
      } else {
        alert("Error updating row");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Columns consts
  const branchColumns = ["_id", "name", "address", "contact", "services"];
  const stockColumns = [
    "name",
    "description",
    "price",
    "ingredients",
    "category",
    "available",
  ];
  const purchaseColumns = [
    "_id",
    "memberId",
    "items",
    "totalAmount",
    "purchaseDate",
  ];

  const homeHandleGraph = () => {
    fetch("http://localhost:3001/api/purchasehistory/list")
      .then((response) => response.json())
      .then((fetchedData) => {
        if (chartContainerRef.current) {
          drawPurchaseHistoryChart(fetchedData, chartContainerRef.current);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const branchHandleEdit = (row) => {
    setEditingRow({ ...row }); // Create a copy of the row for editing
    setIsModalOpen(true);
    console.log("Editing", row); // Replace with actual edit logic
  };
  const branchHandleAdd = async (e) => {
    e.preventDefault();
    try {
      const address = {
        streetNumber: branchFormData.streetNumber,
        streetName: branchFormData.streetName,
        city: branchFormData.city,
        state: branchFormData.state,
        zipCode: branchFormData.zipCode,
        country: branchFormData.country,
        longitude: branchFormData.longitude,
        latitude: branchFormData.latitude,
      };
      const openingHours = {
        monday: "8:00 AM - 10:00 PM",
        tuesday: "8:00 AM - 10:00 PM",
        wednesday: "8:00 AM - 10:00 PM",
        thursday: "8:00 AM - 10:00 PM",
        friday: "8:00 AM - 5:00 PM",
        saturday: "closed",
        sunday: "8:00 AM - 10:00 PM",
      };
      const contact = {
        phone: branchFormData.phone,
        email: branchFormData.email,
      };
      const services = {
        delivery: branchFormData.makesDeliveries,
        takeaway: branchFormData.hasTakeaway,
        dineIn: branchFormData.hasDineIn,
      };

      const branchBody = {
        name: branchFormData.name,
        address,
        contact,
        services,
        openingHours,
      };

      const res = await axios.post(
        "http://localhost:3001/api/branches/create",
        branchBody
      );
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  };
  const branchHandleDelete = (row) => {
    // Placeholder for dialog

    console.log("Deleting", row.name); // Replace with actual delete logic
    axios.delete("http://localhost:3001/api/branches/delete/" + row._id);
    window.location.reload();
  };
  const stockHandleEdit = (row) => {
    console.log("Editing", row); // Replace with actual edit logic
  };
  const stockHandleAdd = async (e) => {
    e.preventDefault();
    try {
      const address = {
        streetNumber: branchFormData.streetNumber,
        streetName: branchFormData.streetName,
        city: branchFormData.city,
        state: branchFormData.state,
        zipCode: branchFormData.zipCode,
        country: branchFormData.country,
        longitude: branchFormData.longitude,
        latitude: branchFormData.latitude,
      };
      const openingHours = {
        monday: "8:00 AM - 10:00 PM",
        tuesday: "8:00 AM - 10:00 PM",
        wednesday: "8:00 AM - 10:00 PM",
        thursday: "8:00 AM - 10:00 PM",
        friday: "8:00 AM - 5:00 PM",
        saturday: "closed",
        sunday: "8:00 AM - 10:00 PM",
      };
      const contact = {
        phone: branchFormData.phone,
        email: branchFormData.email,
      };
      const services = {
        delivery: branchFormData.makesDeliveries,
        takeaway: branchFormData.hasTakeaway,
        dineIn: branchFormData.hasDineIn,
      };

      const branchBody = {
        name: branchFormData.name,
        address,
        contact,
        services,
        openingHours,
      };

      const res = await axios.post(
        "http://localhost:3001/api/branches/create",
        branchBody
      );
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  };
  const stockHandleDelete = (row) => {
    // Placeholder for dialog

    console.log("Deleting", row); // Replace with actual delete logic
    axios.delete();
  };
  const purchaseHandleDelete = (row) => {
    // Placeholder for dialog

    console.log("Deleting", row); // Replace with actual delete logic
    axios.delete("http://localhost:3001/api/branches/delete/" + row._id);
    window.location.reload();
  };
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setbranchFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const HomeContent = () => {
    return (
      <div className="p-4 text-4xl w-screen font-bold font-serif drop-shadow-md">
        Welcome!
        <div className="flex">
          <div className="left-0 w-1/2 h-auto">
            <div className="p-4 text-2xl font-semibold font-serif drop-shadow-md">
              Purhcases Over Time:
              <div className="drop-shadow-md" ref={chartContainerRef}>
                {homeHandleGraph}
              </div>
            </div>
          </div>
          <div className="right-0 w-1/2 h-auto">
            <div className="p-4 text-2xl font-semibold font-serif drop-shadow-md">
              Purhcases Over Time:
            </div>
          </div>
        </div>
      </div>
    );
  };
  const ViewStockContent = () => (
    <div className="overflow-auto rounded-md text-md font-bold font-serif">
      <DataTable
        apiUrl={"http://localhost:3001/api/cookies"}
        columnsToDisplay={stockColumns}
        editable={false}
      />
    </div>
  );
  const AddStockContent = useMemo(() => {
    return (
      <div className="relative flex-col w-screen p-6 pl-10 pt-10 text-6xl text-gray-950 font-serif font-bold drop-shadow-lg">
        Create A Branch
        <form onSubmit={branchHandleAdd} className="relative flex">
          <div className="relative left-0 w-full h-auto ml-10">
            <label htmlFor="name" className="relative pt-10 text-2xl">
              Store Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                value={branchFormData.name}
                placeholder="name"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="phone" className="relative pt-10 text-2xl">
              Phone
            </label>
            <div className="mt-2">
              <input
                id="phone"
                type="tel"
                value={branchFormData.phone}
                placeholder="Phone"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="email" className="relative pt-10 text-2xl">
              E-mail
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                value={branchFormData.email}
                placeholder="E-mail"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex items-center mt-10">
              <input
                id="hasTakeaway"
                type="checkbox"
                checked={branchFormData.takeaway}
                onChange={handleInputChange}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded duration-100"
              />
              <label
                for="hasTakeaway"
                class="ms-2 text-xl font-medium text-gray-950"
              >
                Serves Takeaway
              </label>
            </div>
            <div class="flex items-center mt-10">
              <input
                id="hasDineIn"
                type="checkbox"
                checked={branchFormData.dinein}
                onChange={handleInputChange}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded duration-100"
              />
              <label
                for="default-checkbox"
                class="ms-2 text-xl font-medium text-gray-950"
              >
                Has Dine In
              </label>
            </div>
            <div class="flex items-center mt-10">
              <input
                id="makesDeliveries"
                type="checkbox"
                checked={branchFormData.delivery}
                onChange={handleInputChange}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded duration-100"
              />
              <label
                for="default-checkbox"
                class="ms-2 text-xl font-medium text-gray-950"
              >
                Makes Deliveries
              </label>
            </div>
          </div>
          <div className="relative right-0 w-full h-auto">
            <label htmlFor="streetNumber" className="relative pt-10 text-2xl">
              Street Number
            </label>
            <div className="relative mt-2">
              <input
                id="streetNumber"
                type="text"
                value={branchFormData.streetNumber}
                placeholder="Street Number"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="streetName" className="relative pt-10 text-2xl">
              Street Name
            </label>
            <div className="relative mt-2">
              <input
                id="streetName"
                type="text"
                value={branchFormData.streetName}
                placeholder="Street Name"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="city" className="relative pt-10 text-2xl">
              City
            </label>
            <div className="relative mt-2">
              <input
                id="city"
                type="text"
                value={branchFormData.city}
                placeholder="City"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="state" className="relative pt-10 text-2xl">
              State
            </label>
            <div className="relative mt-2">
              <input
                id="state"
                type="text"
                value={branchFormData.state}
                placeholder="State"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="zipCode" className="relative pt-10 text-2xl">
              Zip Code
            </label>
            <div className="relative mt-2">
              <input
                id="zipCode"
                type="text"
                value={branchFormData.zipCode}
                placeholder="Zip Code"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="country" className="relative pt-10 text-2xl">
              Country
            </label>
            <div className="relative mt-2">
              <input
                id="country"
                type="text"
                value={branchFormData.country}
                placeholder="Country"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="latitude" className="relative pt-10 text-2xl">
              latitude
            </label>
            <div className="relative mt-2">
              <input
                id="latitude"
                type="number"
                value={branchFormData.latitude}
                placeholder="0"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="longitude" className="relative pt-10 text-2xl">
              Longitude
            </label>
            <div className="relative mt-2">
              <input
                id="longitude"
                type="number"
                value={branchFormData.longitude}
                placeholder="Longitude"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="absolute bottom-0 h-1 ml-10">
            <button
              type="submit"
              className="relative w-mt-8 bg-green-600 rounded hover:bg-green-500 hover:ring-1 hover:ring-white duration-300"
            >
              <p className="text-2xl px-3 py-2 text-white drop-shadow-md">
                Submit
              </p>
            </button>
          </div>
        </form>
      </div>
    );
  });
  const UpdateStockContent = () => (
    <div className="overflow-auto rounded-md text-md font-bold font-serif">
      <DataTable
        apiUrl={"http://localhost:3001/api/cookies/"}
        columnsToDisplay={stockColumns}
        editable={true}
        onEdit={branchHandleEdit}
        onDelete={branchHandleDelete}
      />
    </div>
  );
  const ViewPurchasesContent = () => (
    <div className="overflow-auto rounded-md text-md font-bold font-serif">
      <DataTable
        apiUrl={"http://localhost:3001/api/purchasehistory/list"}
        columnsToDisplay={purchaseColumns}
        editable={false}
      />
    </div>
  );
  const RemovePurchasesContent = () => (
    <div className="overflow-auto rounded-md text-md font-bold font-serif">
      <DataTable
        apiUrl={"http://localhost:3001/api/purchasehistory/list"}
        columnsToDisplay={purchaseColumns}
        editable={true}
        onEdit={""}
        onDelete={purchaseHandleDelete}
      />
    </div>
  );
  const ViewBranchesContent = () => (
    <div className="overflow-auto rounded-md text-md font-bold font-serif">
      <DataTable
        apiUrl={"http://localhost:3001/api/branches/list"}
        columnsToDisplay={branchColumns}
        editable={false}
      />
    </div>
  );
  const UpdateBranchesContent = () => (
    <div className="overflow-auto rounded-md text-md font-bold font-serif">
      <DataTable
        apiUrl={"http://localhost:3001/api/branches/list"}
        columnsToDisplay={branchColumns}
        editable={true}
        onEdit={branchHandleEdit}
        onDelete={branchHandleDelete}
      />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Row</h2>
            <div>
              <label>Name: </label>
              <input
                type="text"
                value={editingRow.name}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, name: e.target.value })
                }
              />
            </div>
            <div>
              <label>Street Number: </label>
              <input
                type="text"
                value={editingRow.address.streetNumber}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, streetNumber: e.target.value })
                }
              />
              <label>Street Name: </label>
              <input
                type="text"
                value={editingRow.address.streetName}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, streetName: e.target.value })
                }
              />
              <label>City: </label>
              <input
                type="text"
                value={editingRow.address.city}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, city: e.target.value })
                }
              />
              <label>State: </label>
              <input
                type="text"
                value={editingRow.address.state}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, state: e.target.value })
                }
              />
              <label>Zip Code: </label>
              <input
                type="text"
                value={editingRow.address.zipCode}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, zipCode: e.target.value })
                }
              />
              <label>Country: </label>
              <input
                type="text"
                value={editingRow.address.country}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, country: e.target.value })
                }
              />
              <label>Latitude: </label>
              <input
                type="number"
                value={editingRow.address.latitude}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, latitude: e.target.value })
                }
              />
              <label>Longitude: </label>
              <input
                type="number"
                value={editingRow.address.longitude}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, longitude: e.target.value })
                }
              />
            </div>
            <button onClick={handleEditSubmit}>Submit</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
  const AddBranchContent = useMemo(() => {
    return (
      <div className="relative flex-col w-screen p-6 pl-10 pt-10 text-6xl text-gray-950 font-serif font-bold drop-shadow-lg">
        Create A Branch
        <form onSubmit={branchHandleAdd} className="relative flex">
          <div className="relative left-0 w-full h-auto ml-10">
            <label htmlFor="name" className="relative pt-10 text-2xl">
              Store Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                value={branchFormData.name}
                placeholder="name"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="phone" className="relative pt-10 text-2xl">
              Phone
            </label>
            <div className="mt-2">
              <input
                id="phone"
                type="tel"
                value={branchFormData.phone}
                placeholder="Phone"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="email" className="relative pt-10 text-2xl">
              E-mail
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                value={branchFormData.email}
                placeholder="E-mail"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex items-center mt-10">
              <input
                id="hasTakeaway"
                type="checkbox"
                checked={branchFormData.takeaway}
                onChange={handleInputChange}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded duration-100"
              />
              <label
                for="hasTakeaway"
                class="ms-2 text-xl font-medium text-gray-950"
              >
                Serves Takeaway
              </label>
            </div>
            <div class="flex items-center mt-10">
              <input
                id="hasDineIn"
                type="checkbox"
                checked={branchFormData.dinein}
                onChange={handleInputChange}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded duration-100"
              />
              <label
                for="default-checkbox"
                class="ms-2 text-xl font-medium text-gray-950"
              >
                Has Dine In
              </label>
            </div>
            <div class="flex items-center mt-10">
              <input
                id="makesDeliveries"
                type="checkbox"
                checked={branchFormData.delivery}
                onChange={handleInputChange}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded duration-100"
              />
              <label
                for="default-checkbox"
                class="ms-2 text-xl font-medium text-gray-950"
              >
                Makes Deliveries
              </label>
            </div>
          </div>
          <div className="relative right-0 w-full h-auto">
            <label htmlFor="streetNumber" className="relative pt-10 text-2xl">
              Street Number
            </label>
            <div className="relative mt-2">
              <input
                id="streetNumber"
                type="text"
                value={branchFormData.streetNumber}
                placeholder="Street Number"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="streetName" className="relative pt-10 text-2xl">
              Street Name
            </label>
            <div className="relative mt-2">
              <input
                id="streetName"
                type="text"
                value={branchFormData.streetName}
                placeholder="Street Name"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="city" className="relative pt-10 text-2xl">
              City
            </label>
            <div className="relative mt-2">
              <input
                id="city"
                type="text"
                value={branchFormData.city}
                placeholder="City"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="state" className="relative pt-10 text-2xl">
              State
            </label>
            <div className="relative mt-2">
              <input
                id="state"
                type="text"
                value={branchFormData.state}
                placeholder="State"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="zipCode" className="relative pt-10 text-2xl">
              Zip Code
            </label>
            <div className="relative mt-2">
              <input
                id="zipCode"
                type="text"
                value={branchFormData.zipCode}
                placeholder="Zip Code"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="country" className="relative pt-10 text-2xl">
              Country
            </label>
            <div className="relative mt-2">
              <input
                id="country"
                type="text"
                value={branchFormData.country}
                placeholder="Country"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="latitude" className="relative pt-10 text-2xl">
              latitude
            </label>
            <div className="relative mt-2">
              <input
                id="latitude"
                type="number"
                value={branchFormData.latitude}
                placeholder="0"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="longitude" className="relative pt-10 text-2xl">
              Longitude
            </label>
            <div className="relative mt-2">
              <input
                id="longitude"
                type="number"
                value={branchFormData.longitude}
                placeholder="Longitude"
                onChange={handleInputChange}
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="absolute bottom-0 h-1 ml-10">
            <button
              type="submit"
              className="relative w-mt-8 bg-green-600 rounded hover:bg-green-500 hover:ring-1 hover:ring-white duration-300"
            >
              <p className="text-2xl px-3 py-2 text-white drop-shadow-md">
                Submit
              </p>
            </button>
          </div>
        </form>
      </div>
    );
  });

  // Menus
  const toggleDropdown = (menu) => {
    // Set the open dropdown to the clicked one, or close it if it's already open
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleMenuClick = (e) => {
    if (e === "home") {
      setOpenDropdown("");
      setSelectedMenu(e);
    } else {
      setSelectedMenu(e);
    }
  };

  const checkAdmin = async () => {
    const res = await axios
      .get("http://localhost:3001/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdminPageData(res.data);
      })
      .catch((err) => {
        // Handle error
        setError(true);
      });
  };

  useEffect(() => {
    {
      homeHandleGraph();
    }
  }, [openDropdown]);

  checkAdmin();

  return (
    <>
      {!error && (
        <div className="flex bg-unsplash-[avJ9uz9Qhcw/lg] h-dvh bg-center bg-cover pb-32">
          <div className="relative flex flex-col z-10 top-20 left-2 mr-4 mt-5 h-full w-1/5 h-auto backdrop-contrast-50 backdrop-blur-2xl rounded-2xl">
            <div className="relative z-10 mt-10 font-bold text-2xl text-center text-black"></div>
            <div
              name="home"
              className={`realtive z-10 p-5 m-2 mt-10 rounded-md hover:drop-shadow-lg hover:text-black hover:bg-yellow-500 duration-300 ${
                selectedMenu === "home" && openDropdown === ""
                  ? "realtive z-10 p-5 m-2 rounded-md drop-shadow-lg text-black bg-yellow-600"
                  : ""
              }  `}
              onClick={() => handleMenuClick("home")}
            >
              <div className="relative z-10 font-bold text-2xl text-center text-white">
                Home
              </div>
            </div>
            <div name="stock">
              <div
                className={`realtive z-10 p-5 m-2 mt-10 rounded-md hover:drop-shadow-lg hover:text-black hover:bg-yellow-500 duration-300 ${
                  openDropdown === "stock"
                    ? "realtive z-10 p-5 m-2 rounded-md drop-shadow-lg text-black bg-yellow-600"
                    : ""
                } `}
                onClick={() => toggleDropdown("stock")}
              >
                <div className="relative z-10 font-bold text-2xl text-center text-white">
                  Stock
                </div>
              </div>
              {openDropdown === "stock" && (
                <div className="relative z-0 rounded-md ring-1 ring-white p-2 m-4">
                  <div
                    className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                    onClick={() => handleMenuClick("viewstock")}
                  >
                    View Stock
                  </div>
                  <div
                    className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                    onClick={() => handleMenuClick("updatestock")}
                  >
                    Update Stock
                  </div>
                </div>
              )}
            </div>
            <div name="purchases">
              <div
                className={`realtive z-10 p-5 m-2 mt-10 rounded-md hover:drop-shadow-lg hover:text-black hover:bg-yellow-500 duration-300 ${
                  openDropdown === "purchases"
                    ? "realtive z-10 p-5 m-2 rounded-md drop-shadow-lg text-black bg-yellow-600"
                    : ""
                } `}
                onClick={() => toggleDropdown("purchases")}
              >
                <div className="relative z-10 font-bold text-2xl text-center text-white">
                  Purchases
                </div>
              </div>
              {openDropdown === "purchases" && (
                <div className="relative z-0 rounded-md ring-1 ring-white p-2 m-4">
                  <div
                    className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                    onClick={() => handleMenuClick("viewpurchases")}
                  >
                    View Purchases
                  </div>
                  <div
                    className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                    onClick={() => handleMenuClick("removepurchases")}
                  >
                    Remove Purchases
                  </div>
                </div>
              )}
            </div>
            <div name="branches">
              <div
                className={`realtive -10 p-5 m-2 mt-10 rounded-md hover:drop-shadow-lg hover:text-black hover:bg-yellow-500 duration-300 ${
                  openDropdown === "branches"
                    ? "realtive z-10 p-5 m-2 rounded-md drop-shadow-lg text-black bg-yellow-600"
                    : ""
                } `}
                onClick={() => toggleDropdown("branches")}
              >
                <div className="relative z-10 font-bold text-2xl text-center text-white">
                  Branches
                </div>
              </div>
              {openDropdown === "branches" && (
                <div className="relative z-0 rounded-md ring-1 ring-white p-2 m-4">
                  <div
                    className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                    onClick={() => handleMenuClick("viewbranches")}
                  >
                    View Branches
                  </div>
                  <div
                    className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                    onClick={() => handleMenuClick("addbranch")}
                  >
                    Add Branch
                  </div>
                  <div
                    className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                    onClick={() => handleMenuClick("updatebranches")}
                  >
                    Update Branches
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative flex z-10 top-20 mr-2 ml-4 mt-5 h-full w-4/5 h-auto backdrop-contrast-50 backdrop-blur-2xl rounded-2xl">
            {selectedMenu === "home" && <HomeContent />}
            {selectedMenu === "viewstock" && <ViewStockContent />}
            {selectedMenu === "updatestock" && <UpdateStockContent />}
            {selectedMenu === "viewpurchases" && <ViewPurchasesContent />}
            {selectedMenu === "removepurchases" && <RemovePurchasesContent />}
            {selectedMenu === "viewbranches" && <ViewBranchesContent />}
            {selectedMenu === "addbranch" && AddBranchContent}
            {selectedMenu === "updatebranches" && <UpdateBranchesContent />}
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
