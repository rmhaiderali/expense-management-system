// SignupPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerAPI } from "../../Utils/ApiRequest";
import axios from "axios";
import { Eye, EyeSlash, Envelope, Key } from "react-bootstrap-icons";
import InputGroup from "react-bootstrap/InputGroup";
import "./Auth.css";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    UserType: "user",
    secret_key: "",
    city: "",
    site_id: "",
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
    if (values.UserType === "admin" && values.secret_key !== "Sahil") {
      e.preventDefault();
      toast.error("Invalid Secret Key", toastOptions);
    } else {
      e.preventDefault();
      const { name, email, password, UserType, city, site_id } = values;

      setLoading(true);

      const { data } = await axios.post(registerAPI, {
        name,
        email,
        password,
        UserType,
        city,
        site_id,
      });

      if (data.success === true) {
        // localStorage.setItem("user", JSON.stringify(data.user));
        // localStorage.setItem("token", JSON.stringify(data.token));
        toast.success(data.message, { ...toastOptions, autoClose: 15000 });
        navigate("/login");
      } else {
        toast.error(data.message, toastOptions);
        setLoading(false);
      }
    }

    return;
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div id="bgimg">
          <img src="/bg2.jpg" />
        </div>
        <Container
          className="mt-5"
          style={{
            position: "relative",
            zIndex: "2 !important",
            color: "white !important",
          }}
        >
          <Row>
            <h1 className="text-center">
              <img
                src="/logo_for_dark_background.png"
                style={{ height: 60, color: "white", marginBottom: 15 }}
              />
            </h1>
            {/* <h1 className="text-center text-white">
              Welcome to Expense Management System
            </h1> */}
            <Col md={{ span: 6, offset: 3 }}>
              <h2
                className="text-white text-center"
                style={{ marginBottom: "20px" }}
              >
                Registration
              </h2>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <div className="text-white ">
                    Register As
                    <input
                      type="radio"
                      name="UserType"
                      value="user"
                      id="radioUser"
                      onChange={handleChange}
                      required
                      checked={values.UserType === "user"}
                      style={{
                        userSelect: "none",
                        cursor: "pointer",
                        marginLeft: "8px",
                      }}
                    />
                    <label
                      htmlFor="radioUser"
                      style={{
                        userSelect: "none",
                        cursor: "pointer",
                        padding: "0 8px",
                      }}
                    >
                      User
                    </label>
                    <input
                      type="radio"
                      name="UserType"
                      value="admin"
                      id="radioAdmin"
                      onChange={handleChange}
                      required
                      checked={values.UserType === "admin"}
                      style={{ userSelect: "none", cursor: "pointer" }}
                    />
                    <label
                      htmlFor="radioAdmin"
                      style={{
                        userSelect: "none",
                        cursor: "pointer",
                        padding: "0 8px",
                      }}
                    >
                      Admin
                    </label>
                  </div>
                </Form.Group>

                {values.UserType === "admin" && (
                  <Form.Group controlId="formBasicName" className="mt-3">
                    <Form.Label className="text-white">Secret Key</Form.Label>
                    <Form.Control
                      type="text"
                      name="secret_key"
                      placeholder="Secret Key"
                      value={values.secret_key}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}

                <Form.Group controlId="formBasicName" className="mt-3">
                  <Form.Label className="text-white">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={values.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="mt-3" style={{ display: "flex", gap: "1rem" }}>
                  <Form.Group
                    controlId="formBasicEmail"
                    style={{ flex: "1", minWidth: "0" }}
                  >
                    <Form.Label className="text-white">
                      Email address
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ userSelect: "none" }}>
                        <Envelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group
                    controlId="formBasicPassword"
                    style={{ flex: "1", minWidth: "0" }}
                  >
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
                </div>

                {values.UserType === "user" && (
                  <div
                    className="mt-3"
                    style={{ display: "flex", gap: "1rem" }}
                  >
                    <Form.Group
                      controlId="formBasicName"
                      style={{ flexGrow: "1" }}
                    >
                      <Form.Label className="text-white">City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        placeholder="City"
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
                      controlId="formBasicName"
                      style={{ flexGrow: "1" }}
                    >
                      <Form.Label className="text-white">Site Id</Form.Label>
                      <Form.Control
                        type="text"
                        name="site_id"
                        placeholder="Site Id"
                        value={values.site_id}
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
                  </div>
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
                  <Link to="/forgotPassword" className="text-white lnk">
                    Forgot Password?
                  </Link>

                  <Button
                    type="submit"
                    className=" text-center mt-3 btnStyle"
                    onClick={!loading ? handleSubmit : null}
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Signup"}
                  </Button>

                  <p className="mt-3" style={{ color: "white" }}>
                    Already have an account?{" "}
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
    </>
  );
};

export default Register;
