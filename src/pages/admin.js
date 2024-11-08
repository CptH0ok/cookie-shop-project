import "./admin.css";
import DataTable from "../components/datatable"
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const Admin = () => {
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [adminPageData, setAdminPageData] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [openDropdown, setOpenDropdown] = useState(null);

  const HomeContent = () => <div className="p-4">Welcome to Home</div>;
  const ViewStockContent = () => <div className="overflow-auto rounded-md text-md font-bold font-serif"><DataTable apiUrl={"http://localhost:3001/api/cookies"} /></div>;
  const UpdateStockContent = () => <div className="p-4">Update Stock</div>;
  const ViewPurchasesContent = () => <div className="p-4">View Purchases</div>;
  const RemovePurchasesContent = () => (
    <div className="p-4">Remove Purchases</div>
  );
  const ViewBranchesContent = () => <div className="overflow-auto rounded-md text-md font-bold font-serif"><DataTable apiUrl={"http://localhost:3001/api/branches/list"} /></div>;
  const OpenBranchesContent = () => <div className="p-4">Open Branches</div>;
  const CloseBranchesContent = () => <div className="p-4">Close Branches</div>;
  const UpdateBranchesContent = () => (
    <div className="p-4">Update Branches</div>
  );

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
        if (err.response) {
          // Server responded with a status other than 2xx
          setError(err.response.data);
        } else {
          // Something happened in setting up the request
          setError(err.response.data);
        }
      });
  };

  checkAdmin();

  return (
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
          {openDropdown == "branches" && (
            <div className="relative z-0 rounded-md ring-1 ring-white p-2 m-4">
              <div
                className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                onClick={() => handleMenuClick("viewbranches")}
              >
                View Branches
              </div>
              <div
                className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                onClick={() => handleMenuClick("openbranches")}
              >
                Open Branches
              </div>
              <div
                className="relative z-0 text-gray-300 m-2 p-2 rounded-md font-bold text-xl text-center hover:bg-white hover:text-black duration-300"
                onClick={() => handleMenuClick("closebranches")}
              >
                Close Branches
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
        {selectedMenu === "openbranches" && <OpenBranchesContent />}
        {selectedMenu === "closebranches" && <CloseBranchesContent />}
        {selectedMenu === "updatebranches" && <UpdateBranchesContent />}
      </div>
    </div>
  );
};

export default Admin;
