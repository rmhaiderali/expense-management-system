// LoginPage.js
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  requestResetPasswordAPI,
  resetPasswordAPI,
} from "../../Utils/ApiRequest";
import { Eye, EyeSlash, Envelope, Key } from "react-bootstrap-icons";
import InputGroup from "react-bootstrap/InputGroup";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const urlParams = new URLSearchParams(window.location.search);
  const emailToken = urlParams.get("token");

  const [values, setValues] = useState({
    email: "",
    password: "",
    cpassword: "",
  });

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

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailToken && values.password !== values.cpassword)
      return toast.error("Passwords do not match", toastOptions);

    if (emailToken && !values.password)
      return toast.error("Password is required", toastOptions);

    setLoading(true);

    const { data } = await axios.post(
      emailToken ? resetPasswordAPI : requestResetPasswordAPI,
      emailToken
        ? {
            emailToken,
            newPassword: values.password,
          }
        : {
            email: values.email,
          }
    );

    if (data.success === true) {
      navigate("/login");
      toast.success(data.message, toastOptions);
      setLoading(false);
    } else {
      toast.error(data.message, toastOptions);
      setLoading(false);
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [iscPasswordVisible, setIscPasswordVisible] = useState(false);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div id="bgimg">
        <img src="/bg2.jpg" />
      </div>
      <Container
        className="mt-5"
        style={{ position: "relative", zIndex: "2 !important" }}
      >
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h1 className="text-center mt-5">
              <img
                src="/logo_for_dark_background.png"
                style={{ height: 60, color: "white", marginBottom: 20 }}
              />
            </h1>
            <h2 className="text-white text-center">Reset Password</h2>
            <Form>
              {!emailToken ? (
                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label className="text-white">Email address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={{ userSelect: "none" }}>
                      <Envelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      onChange={handleChange}
                      value={values.email}
                    />
                  </InputGroup>
                </Form.Group>
              ) : (
                <>
                  <Form.Group controlId="formBasicPassword" className="mt-3">
                    <Form.Label className="text-white">Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ userSelect: "none" }}>
                        <Key />
                      </InputGroup.Text>
                      <Form.Control
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleChange}
                      />
                      <InputGroup.Text
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={{ userSelect: "none", cursor: "pointer" }}
                      >
                        {isPasswordVisible ? <EyeSlash /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword" className="mt-3">
                    <Form.Label className="text-white">
                      Confirm Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ userSelect: "none" }}>
                        <Key />
                      </InputGroup.Text>
                      <Form.Control
                        type={iscPasswordVisible ? "text" : "password"}
                        name="cpassword"
                        placeholder="Confirm Password"
                        value={values.cpassword}
                        onChange={handleChange}
                      />
                      <InputGroup.Text
                        onClick={() =>
                          setIscPasswordVisible(!iscPasswordVisible)
                        }
                        style={{ userSelect: "none", cursor: "pointer" }}
                      >
                        {iscPasswordVisible ? <EyeSlash /> : <Eye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </>
              )}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
                className="mt-4"
              >
                <Button
                  type="submit"
                  className=" text-center mt-3 btnStyle"
                  onClick={!loading ? handleSubmit : null}
                  disabled={loading}
                >
                  {emailToken ? "Reset Password" : "Send Email"}
                </Button>

                <p className="mt-3" style={{ color: "white" }}>
                  Remember account password?{" "}
                  <Link
                    to="/login"
                    className="lnk"
                    style={{ color: "#0d6efd" }}
                  >
                    Login
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPassword;
