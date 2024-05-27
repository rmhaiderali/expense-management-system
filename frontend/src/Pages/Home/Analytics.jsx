import React from "react";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../Components/CircularProgressBar";

const Analytics = ({ transactions }) => {
  if (!transactions) return null;
  const TotalTransactions = transactions.length;
  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  return (
    <>
      <Container className="mt-5 ">
        <Row>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-black text-white">
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
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-black text-white ">
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
        </Row>
      </Container>
    </>
  );
};

export default Analytics;
