import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./Home.css";
import {
  host,
  deleteTransactions,
  editTransactions,
} from "../../Utils/ApiRequest";
import axios from "axios";
import { Image } from "antd";

const TableData = (props) => {
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);

  const handleEditClick = (itemKey) => {
    console.log("Clicked button ID:", itemKey);
    if (transactions.length > 0) {
      const editTran = props.data.filter((item) => item._id === itemKey);
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      handleShow();
    }
  };

  const handleEditSubmit = async (e) => {
    // e.preventDefault();

    const token = JSON.parse(localStorage.getItem("token"));

    const { data } = await axios.put(
      `${editTransactions}/${currId}`,
      {
        ...values,
        userId: props.user._id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data.success === true) {
      handleClose();
      setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const handleDeleteClick = async (itemKey) => {
    console.log(user._id);
    console.log("Clicked button ID delete:", itemKey);
    setCurrId(itemKey);

    const token = JSON.parse(localStorage.getItem("token"));

    const { data } = await axios.post(
      `${deleteTransactions}/${itemKey}`,
      {
        userId: props.user._id,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data.success === true) {
      await setRefresh(!refresh);
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
    city: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleImageUpload = (e) => {
    setValues({ ...values, ImageUrl: e.target.files[0] });
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
  }, [props.data, props.user, refresh]);

  const totalTurnOver =
    transactions?.reduce((acc, transaction) => acc + transaction.amount, 0) ||
    0;

  return (
    <div style={{ overflow: "auto" }}>
      <Table
        responsive="md"
        id="transactionsTable"
        style={{ background: "white" }}
      >
        <thead style={{ background: "#9bd1ff" }}>
          <tr>
            {user?.UserType === "admin" && <th>User</th>}
            <th>Date</th>
            <th>Title</th>
            <th>Client</th>
            <th>Project</th>
            <th>Site-Id</th>
            <th>City</th>
            <th>Amount</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-black">
          {props?.data?.map((item, index) => (
            <tr key={index}>
              {user?.UserType === "admin" && <td>{item.user.name}</td>}
              <td>
                <div>{moment(item.date).format("DD-MM-YYYY")}</div>
              </td>
              <td>
                <div>{item.title}</div>
              </td>
              <td>
                <div>{item.category}</div>
              </td>
              <td>
                <div>{item.description}</div>
              </td>
              <td>
                <div>{item.transactionType}</div>
              </td>
              <td>
                <div>{item.city}</div>
              </td>
              <td>
                <div>{item.amount}</div>
              </td>
              <td>
                <div>
                  <Image
                    width={100}
                    height={60}
                    src={`${host}/${item.image}`}
                  />
                </div>
              </td>
              <td>
                <div>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      key={item._id}
                      id={item._id}
                      onClick={() => handleEditClick(item._id)}
                    />

                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      key={index}
                      id={item._id}
                      onClick={() => handleDeleteClick(item._id)}
                    />

                    {editingTransaction && (
                      <>
                        <div>
                          <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                              <Modal.Title>
                                Update Transaction Details
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form onSubmit={handleEditSubmit}>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formName"
                                >
                                  <Form.Label>Title</Form.Label>
                                  <Form.Control
                                    name="title"
                                    type="text"
                                    placeholder={editingTransaction[0].title}
                                    value={values.title}
                                    onChange={handleChange}
                                    list="expense"
                                  />
                                  <datalist id="expense">
                                    <option>Petrol</option>
                                    <option>Food</option>
                                    <option>Hotel/Accom.</option>
                                    <option>Rent A Car</option>
                                  </datalist>
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="formAmount"
                                >
                                  <Form.Label>Amount(SRA)</Form.Label>
                                  <Form.Control
                                    name="amount"
                                    type="number"
                                    placeholder={editingTransaction[0].amount}
                                    value={values.amount}
                                    onChange={handleChange}
                                  />
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="formSelect"
                                >
                                  <Form.Label>Client</Form.Label>
                                  <Form.Control
                                    name="category"
                                    value={values.category}
                                    onChange={handleChange}
                                    placeholder={editingTransaction[0].category}
                                    list="client"
                                  />
                                  <datalist id="client">
                                    <option>Ericsson</option>
                                    <option>Tawal</option>
                                    <option>STC</option>
                                    <option>Mobily</option>
                                  </datalist>
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="formDescription"
                                >
                                  <Form.Label>Project</Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="description"
                                    placeholder={
                                      editingTransaction[0].description
                                    }
                                    value={values.description}
                                    onChange={handleChange}
                                    list="project"
                                  />
                                  <datalist id="project">
                                    <option>NeXT 2024</option>
                                    <option>Next 2023</option>
                                    <option>Relocation</option>
                                  </datalist>
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="formSelect1"
                                >
                                  <Form.Label>Site-Id</Form.Label>
                                  <Form.Control
                                    name="transactionType"
                                    placeholder={
                                      editingTransaction[0].transactionType
                                    }
                                    value={values.transactionType}
                                    onChange={handleChange}
                                    list="siteId"
                                  />
                                  <datalist id="siteId">
                                    <option>ZRW981</option>
                                    <option>ZND783</option>
                                    <option>ZN778</option>
                                    <option>1045667</option>
                                  </datalist>
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="formSelect1"
                                >
                                  <Form.Label>City</Form.Label>
                                  <Form.Control
                                    name="city"
                                    placeholder={editingTransaction[0].city}
                                    value={values.city}
                                    onChange={handleChange}
                                    list="city"
                                  />
                                  <datalist id="city">
                                    <option>Riyadh</option>
                                    <option>Jeddah</option>
                                    <option>Dammam</option>
                                    <option>Jubail</option>
                                    <option>Al Khobar</option>
                                  </datalist>
                                </Form.Group>
                                <Form.Group
                                  className="mb-3"
                                  controlId="formSelect1"
                                >
                                  <Form.Label>Upload Image</Form.Label>
                                  <Form.Control
                                    name="ImageUrl"
                                    placeholder={editingTransaction[0].Image}
                                    type="file"
                                    onChange={handleImageUpload}
                                  ></Form.Control>
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="formDate"
                                >
                                  <Form.Label>Date</Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="date"
                                    value={values.date}
                                    onChange={handleChange}
                                  />
                                </Form.Group>
                              </Form>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Close
                              </Button>
                              <Button
                                variant="primary"
                                type="submit"
                                onClick={handleEditSubmit}
                              >
                                Submit
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {transactions && (
            <tr>
              <td></td>
              <td style={{ borderLeftColor: "transparent" }}></td>
              <td style={{ borderLeftColor: "transparent" }}></td>
              <td style={{ borderLeftColor: "transparent" }}></td>
              <td style={{ borderLeftColor: "transparent" }}></td>
              <td style={{ borderLeftColor: "transparent" }}></td>
              <td>
                <div>Total Amount</div>
              </td>
              <td>
                <div>{totalTurnOver}</div>
              </td>
              <td></td>
              <td style={{ borderLeftColor: "transparent" }}></td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TableData;
