import React, { useState, useEffect } from "react";
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

const AdminHome = () => {
  const navigate = useNavigate();

  const [cUser, setcUser] = useState();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

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

  const downloadTransactions = (isPDF) => {
    const captureTarget = document
      .querySelector("#transactionsTable")
      .outerHTML.replaceAll("text-white", "text-black")
      .replaceAll("background: rgba(0, 0, 0, 0.7);", "");

    console.log(captureTarget);

    const capture = document.createElement("div");
    capture.style.minWidth = "1000px";
    capture.style.maxWidth = "1000px";
    capture.innerHTML = captureTarget;

    document.body.appendChild(capture);

    [
      capture.querySelector("thead > tr"),
      ...capture.querySelectorAll("tbody > tr"),
    ].map((e) => e.removeChild(e.lastChild));

    html2canvas(capture, { useCORS: true, allowTaint: true, scale: 2 }).then(
      (canvas) => {
        if (isPDF) {
          const pdf = new jsPDF("p", "px", [
            capture.clientHeight < 1100 ? 1100 : capture.clientHeight,
            1100,
          ]);
          pdf.addImage(canvas.toDataURL({ format: "png" }), "PNG", 0, 0);
          pdf.save("transactions.pdf");
        }
        //
        else {
          let a = document.createElement("a");
          a.href = canvas.toDataURL({ format: "png" });
          a.download = "transactions.png";
          a.click();
        }
      }
    );

    document.body.removeChild(capture);
  };

  const [isCardOpen, setIsCardOpen] = useState(true);
  const [isCardFullyOpen, setIsCardFullyOpen] = useState(true);

  if (!transactions) return null;
  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div style={{ display: "flex", padding: "12px" }}>
          <div
            className="card h-100"
            style={{
              minWidth: isCardOpen ? "280px" : "58px",
              maxWidth: isCardOpen ? "280px" : "58px",
              margin: "35px 12px 0 12px",
              transition: "min-width 0.3s ease",
            }}
          >
            <div
              className="card-header bg-black text-white"
              style={{
                borderRadius: isCardFullyOpen ? "5px 5px 0 0" : "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: "bold" }}>
                {isCardFullyOpen && "Transaction Details:"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="white"
                viewBox="0 0 16 16"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const value = !isCardOpen;
                  setIsCardOpen(value);
                  if (value) setTimeout(() => setIsCardFullyOpen(value), 300);
                  else setIsCardFullyOpen(value);
                }}
              >
                <path
                  fill-rule="evenodd"
                  d={
                    isCardOpen
                      ? "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
                      : "M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zM5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
                  }
                />
              </svg>
            </div>
            {isCardFullyOpen && (
              <div className="card-body">
                <table className="transaction-details">
                  <tr>
                    <th>Start Date:</th>
                    <th>
                      {frequency === "custom"
                        ? startDate
                          ? startDate.toLocaleDateString("en-PK")
                          : "Choose Start Date"
                        : new Date(
                            Date.now() - frequency * 86400000
                          ).toLocaleDateString("en-PK")}
                    </th>
                  </tr>
                  <tr>
                    <th>End Date:</th>
                    <th>
                      {frequency === "custom"
                        ? endDate
                          ? endDate.toLocaleDateString("en-PK")
                          : "Choose End Date"
                        : new Date().toLocaleDateString("en-PK")}
                    </th>
                  </tr>
                  <tr>
                    <th>Total TurnOver:</th>
                    <th>{totalTurnOver}</th>
                  </tr>
                  <tr>
                    <th>Discription:</th>
                    <th>
                      {frequency === "custom"
                        ? "Transactions of days between start and end date"
                        : "Transactions of last " + frequency + " days"}
                    </th>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <th>Open</th>
                  </tr>
                </table>
              </div>
            )}
          </div>
          <Container
            style={{
              position: "relative",
              zIndex: "2 !important",
              minWidth: "0",
              flexGrow: "1",
            }}
            className="mt-2"
          >
            {/* <h1 className="text-white text-center">Welcome {cUser?.name}</h1> */}
            <div className="filterRow">
              <div className="text-white">
                <Form.Group controlId="formSelectFrequency">
                  <Form.Label>Select Frequency</Form.Label>
                  <Form.Select
                    name="frequency"
                    value={frequency}
                    onChange={handleChangeFrequency}
                  >
                    <option value="7">Last Week</option>
                    <option value="30">Last Month</option>
                    <option value="365">Last Year</option>
                    <option value="custom">Custom</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {transactions?.length > 0 && view === "table" && (
                <>
                  <Button
                    variant="primary"
                    style={{ marginTop: "32px" }}
                    onClick={() => downloadTransactions(false)}
                  >
                    Save Transactions as Image
                  </Button>
                  <Button
                    variant="primary"
                    style={{ marginTop: "32px" }}
                    onClick={() => downloadTransactions(true)}
                  >
                    Save Transactions as PDF
                  </Button>
                </>
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
              </div>
            </div>

            {frequency === "custom" ? (
              <>
                <div className="date ">
                  <div className="form-group">
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="End Date"
                      />
                    </div>
                  </div>
                  <Button variant="primary" onClick={handleReset}>
                    Reset Filter
                  </Button>
                </div>
              </>
            ) : (
              <></>
            )}

            {view === "table" ? (
              <TableData data={transactions} user={cUser} />
            ) : (
              <Analytics transactions={transactions} user={cUser} />
            )}
          </Container>
        </div>
      )}
    </>
  );
};

export default AdminHome;
