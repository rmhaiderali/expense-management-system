import React from "react";
import CircularProgressBar from "../../Components/CircularProgressBar";

const Analytics = ({ transactions }) => {
  if (!transactions) return null;
  const TotalTransactions = transactions.length;
  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div className="card">
        <div
          className="card-header text-black"
          style={{ background: "#9e9eff" }}
        >
          <span style={{ fontWeight: "bold" }}>Total Transactions:</span>{" "}
          {TotalTransactions}
        </div>
        <div className="card-body">
          <h5 className="card-title">All Transactions:</h5>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>
                {transaction.amount} ({transaction.title})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div
          className="card-header text-black"
          style={{ background: "#9e9eff" }}
        >
          <span style={{ fontWeight: "bold" }}>Total TurnOver:</span>{" "}
          {totalTurnOver}
        </div>
        <div className="card-body">
          <h5 className="card-title">TurnOver:</h5>
          <CircularProgressBar
            percentage={(totalTurnOver / totalTurnOver) * 100 || 0}
            color="green"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
