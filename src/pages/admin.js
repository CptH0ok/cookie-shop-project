import "./admin.css";
import DataTable from "../components/datatable";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

const Admin = () => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [adminPageData, setAdminPageData] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // Branch Inputs
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const streetNumberInputRef = useRef(null);
  const streetNameInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const stateInputRef = useRef(null);
  const zipCodeInputRef = useRef(null);
  const countryInputRef = useRef(null);
  const latitudeInputRef = useRef(null);
  const longitudeInputRef = useRef(null);
  const [name, setName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [takeaway, setTakeaway] = useState(false);
  const [dinein, setDinein] = useState(false);
  const address = [
    streetNumber,
    streetName,
    city,
    state,
    zipCode,
    country,
    latitude,
    longitude,
  ];
  const contact = [phone, email];
  const services = [delivery, takeaway, dinein];

  useEffect(() => {
    if (name !== "") {
      nameInputRef.current.focus();
    } else if (email !== "") {
      emailInputRef.current.focus();
    } else if (phone !== "") {
      phoneInputRef.current.focus();
    } else if (streetNumber !== "") {
      streetNumberInputRef.current.focus();
    } else if (streetName !== "") {
        streetNameInputRef.current.focus();
    } else if (city !== "") {
        cityInputRef.current.focus();
    } else if (state !== "") {
        stateInputRef.current.focus();
    } else if (zipCode !== "") {
        zipCodeInputRef.current.focus();
    } else if (country !== "") {
        countryInputRef.current.focus();
    } else if (latitude !== "") {
        streetNumberInputRef.current.focus();
    } else if (longitude !== "") {
        longitudeInputRef.current.focus();
    } 
  }, [name, email, phone, streetNumber, streetName, city, state, zipCode, country, latitude, longitude]);

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

  // Consts
  const branchColumns = ["_id", "name", "address", "contact", "services"];
  const stockColumns = [
    "name",
    "description",
    "price",
    "ingredients",
    "category",
    "available",
  ];

  const branchHandleEdit = (row) => {
    setEditingRow({ ...row }); // Create a copy of the row for editing
    setIsModalOpen(true);
    console.log("Editing", row); // Replace with actual edit logic
  };
  const branchHandleDelete = (row) => {
    // Placeholder for dialog

    console.log("Deleting", row.name); // Replace with actual delete logic
    axios.delete("http://localhost:3001/api/branches/delete/" + row._id);
  };
  const stockHandleEdit = (row) => {
    console.log("Editing", row); // Replace with actual edit logic
  };
  const stockHandleDelete = (row) => {
    // Placeholder for dialog

    console.log("Deleting", row); // Replace with actual delete logic
    axios.delete();
  };
  const purchaseHandleDelete = (row) => {
    // Placeholder for dialog

    console.log("Deleting", row); // Replace with actual delete logic
    axios.delete();
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    try {
      const branchBody = { name, address, contact, services };
      const res = await axios.post(
        "http://localhost:3001/api/branches/create",
        {}
      );
      localStorage.setItem("token", res.data.token);
      setError("");
      // Redirect to protected page
    } catch (err) {
      setError("Error creating account");
    }
  };

  // Page Contents
  const HomeContent = () => <div className="p-4">Welcome to Home</div>;
  const ViewStockContent = () => (
    <div className="overflow-auto rounded-md text-md font-bold font-serif">
      <DataTable
        apiUrl={"http://localhost:3001/api/cookies"}
        columnsToDisplay={stockColumns}
        editable={false}
      />
    </div>
  );
  const UpdateStockContent = () => <div className="p-4">Update Stock</div>;
  const ViewPurchasesContent = () => <div className="p-4">View Purchases</div>;
  const RemovePurchasesContent = () => (
    <div className="p-4">Remove Purchases</div>
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
              <label>Address: </label>
              <input
                type="text"
                value={editingRow.address}
                onChange={(e) =>
                  setEditingRow({ ...editingRow, address: e.target.value })
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
  const AddBranchContent = () => (
    <div className="relative flex-col w-screen p-6 pl-10 pt-10 text-6xl text-gray-950 font-serif font-bold drop-shadow-lg">
      Create A Branch
      <form onSubmit={handleAddBranch} className="relative flex">
        <div className="relative left-0 w-full h-auto ml-10">
          <label htmlFor="name" className="relative pt-10 text-2xl">
            Store Name
          </label>
          <div className="mt-2">
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <label htmlFor="name" className="relative pt-10 text-2xl">
            Phone
          </label>
          <div className="mt-2">
            <input
              ref={phoneInputRef}
              type="tel"
              value={phone}
              placeholder="Phone"
              onChange={(e) => setPhone(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <label htmlFor="name" className="relative pt-10 text-2xl">
            E-mail
          </label>
          <div className="mt-2">
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div class="flex items-center mt-10">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={takeaway}
              onChange={(e) => setTakeaway(e.target.takeaway)}
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 duration-100"
            />
            <label
              for="default-checkbox"
              class="ms-2 text-xl font-medium text-gray-950"
            >
              Serves Takeaway
            </label>
          </div>
          <div class="flex items-center mt-10">
            <input
              id="default-checkbox"
              type="checkbox"
              checked={dinein}
              onChange={(e) => setDinein(e.target.dinein)}
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 duration-100"
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
              id="default-checkbox"
              type="checkbox"
              checked={delivery}
              onChange={(e) => setDelivery(e.target.delivery)}
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 duration-100"
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
              ref={streetNumberInputRef}
              type="text"
              value={streetNumber}
              placeholder="Street Number"
              onChange={(e) => setStreetNumber(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <label htmlFor="streetName" className="relative pt-10 text-2xl">
            Street Name
          </label>
          <div className="relative mt-2">
            <input
              ref={streetNameInputRef}
              type="text"
              value={streetName}
              placeholder="Street Name"
              onChange={(e) => setStreetName(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <label htmlFor="city" className="relative pt-10 text-2xl">
            City
          </label>
          <div className="relative mt-2">
            <input
              ref={cityInputRef}
              type="text"
              value={city}
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <label htmlFor="state" className="relative pt-10 text-2xl">
            State
          </label>
          <div className="relative mt-2">
            <input
              ref={stateInputRef}
              type="text"
              value={state}
              placeholder="State"
              onChange={(e) => setState(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <label htmlFor="zipCode" className="relative pt-10 text-2xl">
            Zip Code
          </label>
          <div className="relative mt-2">
            <input
              ref={zipCodeInputRef}
              type="text"
              value={zipCode}
              placeholder="Zip Code"
              onChange={(e) => setZipCode(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <label htmlFor="country" className="relative pt-10 text-2xl">
            Country
          </label>
          <div className="relative mt-2">
            <input
              ref={countryInputRef}
              type="text"
              value={country}
              placeholder="Country"
              onChange={(e) => setCountry(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <label htmlFor="latitude" className="relative pt-10 text-2xl">
            latitude
          </label>
          <div className="relative mt-2">
            <input
              ref={latitudeInputRef}
              type="number"
              value={latitude}
              placeholder="0"
              onChange={(e) => setLatitude(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
          <label htmlFor="longitude" className="relative pt-10 text-2xl">
            Longitude
          </label>
          <div className="relative mt-2">
            <input
              ref={longitudeInputRef}
              type="number"
              value={longitude}
              placeholder="Longitude"
              onChange={(e) => setLongitude(e.target.value)}
              className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="absolute bottom-0 h-1 ml-10">
        <button
          type="submit"
          className="relative w-mt-8 bg-green-600 rounded hover:bg-green-500 hover:ring-1 hover:ring-white duration-300"
        >
          <p className="text-2xl px-3 py-2 text-white drop-shadow-md">Submit</p>
        </button>
        </div>
      </form>
    </div>
  );

  // Menus
  const toggleDropdown = (menu) => {
    // Set the open dropdown to the clicked one, or close it if it's already open
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleMenuClick = (Admin) => {
    setSelectedMenu(Admin);
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

  checkAdmin();

  return (
    <>
      {!error && (
        <div className="flex bg-unsplash-[avJ9uz9Qhcw/lg] h-dvh bg-center bg-cover pb-32">
          <div className="relative flex flex-col z-10 top-20 left-2 mr-4 mt-5 h-full w-1/5 h-auto backdrop-contrast-50 backdrop-blur-2xl rounded-2xl">
            <div className="relative z-10 mt-10 font-bold text-2xl text-center text-black">
              {" "}
              Header{" "}
            </div>
            <div
              name="home"
              className={`realtive z-10 p-5 m-2 rounded-md hover:drop-shadow-lg hover:text-black hover:bg-yellow-500 duration-300`}
              onClick={() => handleMenuClick("home")}
            >
              <div className="relative z-10 font-bold text-2xl text-center text-white">
                Home
              </div>
            </div>
            <div name="stock">
              <div
                className={`realtive z-10 p-5 m-2 rounded-md hover:drop-shadow-lg hover:text-black hover:bg-yellow-500 duration-300 ${
                  openDropdown == "stock"
                    ? "realtive z-10 p-5 m-2 rounded-md drop-shadow-lg text-black bg-yellow-600"
                    : ""
                } `}
                onClick={() => toggleDropdown("stock")}
              >
                <div className="relative z-10 font-bold text-2xl text-center text-white">
                  Stock
                </div>
              </div>
              {openDropdown == "stock" && (
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
                className={`realtive z-10 p-5 m-2 rounded-md hover:drop-shadow-lg hover:text-black hover:bg-yellow-500 duration-300 ${
                  openDropdown == "purchases"
                    ? "realtive z-10 p-5 m-2 rounded-md drop-shadow-lg text-black bg-yellow-600"
                    : ""
                } `}
                onClick={() => toggleDropdown("purchases")}
              >
                <div className="relative z-10 font-bold text-2xl text-center text-white">
                  Purchases
                </div>
              </div>
              {openDropdown == "purchases" && (
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
                className={`realtive z-10 p-5 m-2 rounded-md hover:drop-shadow-lg hover:text-black hover:bg-yellow-500 duration-300 ${
                  openDropdown == "branches"
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
            {selectedMenu === "addbranch" && <AddBranchContent />}
            {selectedMenu === "updatebranches" && <UpdateBranchesContent />}
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
