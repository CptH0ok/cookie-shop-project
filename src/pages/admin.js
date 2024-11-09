import "./admin.css";
import DataTable from "../components/datatable";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const Admin = () => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [adminPageData, setAdminPageData] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [openDropdown, setOpenDropdown] = useState(null);

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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState(false);
  const [takeaway, setTakeaway] = useState(false);
  const [dinein, setDinein] = useState(false);
  const contact = [phone,email];
  const services = [delivery,takeaway,dinein];

  // Requests
  const branchBody = {name, address, contact, services}

  const handleAddBranch = async (e) => {
    e.preventDefault();
    try {
        
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
    </div>
  );
  const AddBranchContent = () => (
    <div className="relative p-6 pl-10 pt-10 text-6xl text-gray-950 font-serif font-bold drop-shadow-lg">
      Create A Branch
      <form onSubmit={handleAddBranch} className="relative ">
        <label htmlFor="name" className="relative pt-10 text-2xl">
          Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            value={name}
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
          />
        </div>
        <label htmlFor="name" className="relative pt-10 text-2xl">
          Address
        </label>
        <div className="mt-2">
          <input
            type="text"
            value={address}
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
          />
        </div>
        <label htmlFor="name" className="relative pt-10 text-2xl">
          Phone
        </label>
        <div className="mt-2">
          <input
            type="tel"
            value={phone}
            placeholder="Phone"
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
          />
        </div>
        <label htmlFor="name" className="relative pt-10 text-2xl">
          E-mail
        </label>
        <div className="mt-2">
          <input
            type="email"
            value={email}
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
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
            onChange={(e) => setDinein(e.target.delivery)}
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
        <button
        type="submit"
        className="relative mt-8 bg-green-600 rounded hover:bg-green-500 hover:ring-1 hover:ring-white duration-300"
      >
        <p className="text-2xl px-3 py-2 text-white drop-shadow-md">
            Submit
        </p>
      </button>
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
