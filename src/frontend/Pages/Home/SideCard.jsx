import { useState } from "react";

export default function SideCard({
  transactions,
  frequency,
  startDate,
  endDate,
}) {
  const [isCardOpen, setIsCardOpen] = useState(true);
  const [isCardFullyOpen, setIsCardFullyOpen] = useState(true);

  const totalTurnOver =
    transactions?.reduce((acc, transaction) => acc + transaction.amount, 0) ||
    0;

  return (
    <div
      className={"card h-100" + (isCardOpen ? " card-open" : "")}
      style={{
        minWidth: isCardOpen ? "280px" : "58px",
        maxWidth: isCardOpen ? "280px" : "58px",
        margin: "35px 10px 10px 10px",
        transition: "min-width 0.3s ease",
        overflow: "hidden",
      }}
    >
      <div
        className="card-header text-black"
        style={{
          borderRadius: isCardFullyOpen ? "5px 5px 0 0" : "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#9e9eff",
          borderBottom: isCardFullyOpen
            ? "var(--bs-card-border-width) solid var(--bs-card-border-color)"
            : "none",
        }}
      >
        <span style={{ fontWeight: "bold" }}>{isCardFullyOpen && "Info:"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          fill="black"
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
              <th>Total Amount:</th>
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
  );
}
