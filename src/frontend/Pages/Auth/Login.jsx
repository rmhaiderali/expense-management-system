// LoginPage.js
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { loginAPI, approveAPI } from "../../Utils/ApiRequest";
import { Eye, EyeSlash, Envelope, Key } from "../../Utils/BootstrapIcons";
import InputGroup from "react-bootstrap/InputGroup";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const emailToken = urlParams.get("token");

      if (!emailToken) return;

      setLoading(true);

      const { data } = await axios.post(approveAPI, {
        emailToken,
      });

      if (data.success === true) {
        // localStorage.setItem("user", JSON.stringify(data.user));
        // localStorage.setItem("token", JSON.stringify(data.token));
        // navigate("/setAvatar");
        navigate("/login");
        toast.success(data.message, toastOptions);
        setLoading(false);
      } else {
        toast.error(data.message, toastOptions);
        setLoading(false);
      }
    })();
  }, []);

  const [values, setValues] = useState({
    email: "",
    password: "",
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

    const { email, password } = values;

    setLoading(true);

    const { data } = await axios.post(loginAPI, {
      email,
      password,
    });

    if (data.success === true) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", JSON.stringify(data.token));
      navigate("/");
      toast.success(data.message, toastOptions);
      setLoading(false);
    } else {
      toast.error(data.message, toastOptions);
      setLoading(false);
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
            <h2 className="text-white text-center">Login</h2>
            <Form>
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
                    style={
                      values.email.match(/[A-Z]/) && {
                        boxShadow: "0 0 0 0.25rem rgba(255, 0, 0, 0.4)",
                      }
                    }
                  />
                </InputGroup>
              </Form.Group>

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
                <Link to="/resetPassword" className="text-white lnk">
                  Forgot password?
                </Link>

                <Button
                  type="submit"
                  className=" text-center mt-3 btnStyle"
                  onClick={!loading ? handleSubmit : null}
                  disabled={loading}
                >
                  Login
                </Button>

                <p className="mt-3" style={{ color: "white" }}>
                  Don't Have an Account?{" "}
                  <Link
                    to="/register"
                    className="lnk"
                    style={{ color: "#0d6efd" }}
                  >
                    Signup
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

export default Login;
