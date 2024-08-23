import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const ModelForm = ({ transaction, onClose, isShow }) => {
  const [show, setShow] = useState(false);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
    city: "",
    ImageUrl: "",
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

  // const handleShow = (index) => {
  //   setShow(true)
  // };

  return (
    <div>
      <Modal show={isShow} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Expense</Form.Label>
              <Form.Control
                name="title"
                type="text"
                placeholder={transaction.title}
                value={values.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount(SRA)</Form.Label>
              <Form.Control
                name="amount"
                type="number"
                placeholder={transaction.amount}
                value={values.amount}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSelect">
              <Form.Label>Client</Form.Label>
              <Form.Control
                name="category"
                value={values.category}
                onChange={handleChange}
                placeholder="Enter Client"
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Project</Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder={transaction.description}
                value={values.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSelect1">
              <Form.Label>Site-Id</Form.Label>
              <Form.Control
                name="transactionType"
                placeholder="Enter Site-Id"
                value={values.transactionType}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSelect1">
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                placeholder="Enter city"
                value={values.city}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSelect1">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                name="ImageUrl"
                placeholder="Enter city"
                type="file"
                // value={values.city}

                onChange={handleImageUpload}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Add more form inputs as needed */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModelForm;
