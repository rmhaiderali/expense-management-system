import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container } from "react-bootstrap";
import "./Home.css";
import { getTransactions } from "../../Utils/ApiRequest";
import axios from "axios";
import Spinner from "../../Components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import SideCard from "./SideCard";
import { toast } from "react-toastify";

const AdminHome = () => {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  const navigate = useNavigate();

  const [cUser, setcUser] = useState();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("1");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");

  useEffect(() => {
    setFilteredTransactions(
      transactions.filter((t) =>
        t.user?.name.toLowerCase().includes(filterKeyword.toLowerCase())
      )
    );
  }, [transactions, filterKeyword]);

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));

        // if (user.isAvatarImageSet === false || user.avatarImage === "") {
        //   navigate("/setAvatar");
        // }

        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        // console.log(cUser._id, frequency, startDate, endDate, type);
        const token = JSON.parse(localStorage.getItem("token"));

        const { data } = await axios.post(
          getTransactions,
          {
            frequency: frequency,
            startDate: startDate,
            endDate: endDate,
            type: type,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(data);

        if (
          ["User not found", "Invalid Token", "Unauthorized"].includes(
            data.message
          )
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }

        setTransactions(data.transactions);

        setLoading(false);
      } catch (err) {
        // toast.error("Error please Try again...", toastOptions);
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  function getImageDimensions(src) {
    return new Promise(function (resolve) {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve({ w: img.width, h: img.height });
    });
  }

  const downloadTransactions = (isPDF) => {
    const capture = document.createElement("div");
    document.body.appendChild(capture);

    try {
      capture.style.minWidth = "1000px";
      capture.style.maxWidth = "1000px";

      capture.innerHTML = document
        .querySelector("#transactionsTable")
        .outerHTML.replace("border-radius: 0.375rem", "");

      capture.querySelector(".pdftable").style.display = "block";

      [
        capture.querySelector("thead > tr"),
        ...capture.querySelectorAll("tbody > tr"),
      ].map((e) => e.removeChild(e.lastChild));

      html2canvas(capture, { useCORS: true, allowTaint: true, scale: 2 }).then(
        async (canvas) => {
          const image = canvas.toDataURL({ format: "png" });
          const size = await getImageDimensions(image);

          if (isPDF) {
            const orientation = size.w > size.h ? "l" : "p";
            const pdf = new jsPDF(orientation, "px", [size.w / 4, size.h / 4]);
            pdf.addImage(image, "PNG", 0, 0, size.w / 4, size.h / 4);
            pdf.save("transactions.pdf");
          }
          //
          else {
            let a = document.createElement("a");
            a.href = image;
            a.download = "transactions.png";
            a.click();
          }
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to genrate PDF", toastOptions);
    }
    document.body.removeChild(capture);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div
          style={{ display: "flex", padding: "10px" }}
          className="mainContent"
        >
          <SideCard
            transactions={transactions}
            frequency={frequency}
            startDate={startDate}
            endDate={endDate}
          />
          <div
            style={{
              position: "relative",
              zIndex: "2 !important",
              minWidth: "0",
              flexGrow: "1",
              padding: "0 10px",
            }}
            className="mt-2"
          >
            <div style={{ minWidth: "400px" }}></div>
            {/* <h1 className="text-white text-center">Welcome {cUser?.name}</h1> */}
            <div className="filterRow">
              <div className="text-white half">
                <Form.Group controlId="formSelectFrequency">
                  <Form.Label>Search by User</Form.Label>
                  <Form.Control
                    type="text"
                    value={filterKeyword}
                    placeholder="Enter Username"
                    onChange={(e) => setFilterKeyword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </div>

              <div className="text-white half">
                <Form.Group controlId="formSelectFrequency">
                  <Form.Label>Select Frequency</Form.Label>
                  <Form.Select
                    name="frequency"
                    value={frequency}
                    onChange={handleChangeFrequency}
                  >
                    <option value="1">Today</option>
                    <option value="7">Last Week</option>
                    <option value="30">Last Month</option>
                    <option value="365">Last Year</option>
                    {/* <option value="custom">Custom</option> */}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* {frequency === "custom" && (
                <div style={{ marginTop: "32px" }}>
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                  />
                </div>
              )}

              {frequency === "custom" && (
                <div style={{ marginTop: "32px" }}>
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End Date"
                    style={{ marginTop: "32px" }}
                  />
                </div>
              )}

              <div
                className="text-white iconBtnBox"
                style={{ marginTop: "32px" }}
              >
                <FormatListBulletedIcon
                  sx={{ cursor: "pointer", width: "18px", height: "18px" }}
                  onClick={handleTableClick}
                  className={`${
                    view === "table" ? "iconActive" : "iconDeactive"
                  }`}
                />
                <BarChartIcon
                  sx={{ cursor: "pointer", width: "18px", height: "18px" }}
                  onClick={handleChartClick}
                  className={`${
                    view === "chart" ? "iconActive" : "iconDeactive"
                  }`}
                />
              </div> */}

              {/* {transactions?.length > 0 && view === "table" && (
                <Button
                  variant="primary"
                  style={{ marginTop: "32px" }}
                  onClick={() => downloadTransactions(false)}
                >
                  Export as Image
                </Button>
              )} */}

              {transactions?.length > 0 && view === "table" && (
                <Button
                  className="full"
                  variant="primary"
                  style={{ marginTop: "32px" }}
                  onClick={() => downloadTransactions(true)}
                >
                  Export as PDF
                </Button>
              )}
            </div>

            {view === "table" ? (
              <TableData
                data={filteredTransactions}
                user={cUser}
                key={filterKeyword}
              />
            ) : (
              <Analytics transactions={transactions} user={cUser} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHome;
