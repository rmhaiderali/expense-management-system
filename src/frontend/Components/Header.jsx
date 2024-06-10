// NavbarComponent.js
import React, { useEffect, useState } from "react";
import { Navbar, Button } from "react-bootstrap";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { host } from "../Utils/ApiRequest";

const Header = () => {
  const navigate = useNavigate();

  const handleShowLogin = () => {
    navigate("/login");
  };

  const [user, setUser] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));

      setUser(user);
    }
  }, []);

  const handleShowLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div id="bgimg">
          <img src="/bg2.jpg" />
        </div>
        <Navbar
          className="navbarCSS"
          collapseOnSelect
          expand="lg"
          style={{
            position: "relative",
            zIndex: "2 !important",
            flexWrap: "nowrap",
            padding: "15px 20px 0",
          }}
        >
          <Navbar.Brand href="/" className="text-white navTitle">
            <img
              src="/logo_for_dark_background.png"
              style={{ width: "150px" }}
            ></img>
          </Navbar.Brand>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "white", padding: "4px 20px 0 0" }}>
              {user?.name}
            </span>
            <img
              src={
                user?.isAvatarImageSet
                  ? `${host}/${user?.avatarImage}`
                  : "/default_profile.jpg"
              }
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: "pointer",
                objectFit: "cover",
                marginRight: "10px",
              }}
              onClick={() => setIsModalVisible(true)}
              onError={(e) => (e.target.src = "/default_profile.jpg")}
            />
          </div>
        </Navbar>
      </div>
      {
        <div
          style={{
            position: "fixed",
            display: "flex",
            width: "100%",
            height: "100%",
            zIndex: "1056",
            transition: "opacity 0.5s",
            transform: "translate(0, -82px)",
            background: "rgba(0, 0, 0, 0.5)",
            alignItems: "center",
            justifyContent: "center",
            opacity: isModalVisible ? "1" : "0",
            pointerEvents: isModalVisible ? "auto" : "none",
          }}
          onClick={() => setIsModalVisible(false)}
        >
          <div
            style={{
              display: "flex",
              width: "320px",
              padding: "20px 0",
              background: "black",
              borderRadius: "10px",
              justifyContent: "center",
              border: "1px solid gray",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <img
                src={
                  user?.isAvatarImageSet
                    ? `${host}/${user?.avatarImage}`
                    : "/default_profile.jpg"
                }
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onError={(e) => (e.target.src = "/default_profile.jpg")}
              />
              <p
                style={{
                  color: "white",
                  textAlign: "center",
                  margin: "15px 0 20px",
                }}
              >
                {user?.name + (user?.UserType === "admin" ? " (Admin)" : "")}
              </p>
              <div>
                <Button
                  variant="primary"
                  style={{ marginRight: "15px" }}
                  onClick={() => navigate("/setAvatar")}
                >
                  Change Profile
                </Button>
                <Button
                  variant="danger"
                  style={{ width: "100px" }}
                  onClick={handleShowLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
            <div style={{ position: "relative", width: "0", height: "0" }}>
              <div
                style={{
                  position: "absolute",
                  left: "0px",
                  top: "-10px",
                }}
                onClick={() => setIsModalVisible(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="lightgray"
                  viewBox="0 0 16 16"
                  style={{ cursor: "pointer" }}
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Header;
