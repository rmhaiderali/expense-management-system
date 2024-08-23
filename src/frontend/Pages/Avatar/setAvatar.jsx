import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "react-bootstrap";
import { setAvatarAPI } from "../../Utils/ApiRequest.jsx";
import { Form } from "react-bootstrap";
import "./Avatar.css";

const SetAvatar = () => {
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

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const input = useRef();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  const setProfilePicture = async () => {
    const file = input.current?.files?.[0];

    if (!file) return toast.error("Select Image First", toastOptions);

    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user);

    const formData = new FormData();
    formData.append("image", file);

    const token = JSON.parse(localStorage.getItem("token"));

    const { data } = await axios.post(setAvatarAPI, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.isSet) {
      user.isAvatarImageSet = true;
      user.avatarImage = data.image;
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Avatar selected successfully", toastOptions);
      navigate("/");
    } else {
      toast.error("Error while setting avatar", toastOptions);
    }
  };

  return (
    <>
      <div id="bgimg">
        <img src="/bg2.jpg" />
      </div>
      {loading === true ? (
        <>
          {/* <Container></Container> */}
          <div
            className="container containerBox"
            h={"100vh"}
            style={{ position: "relative", zIndex: "2 !important" }}
          >
            <div className="avatarBox">
              <image src="/loader.gif" alt="Loading"></image>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="container containerBox"
            style={{ position: "relative", zIndex: "2 !important" }}
          >
            <div className="avatarBox">
              <h1 className="text-center text-white mt-5 mb-5">
                Choose Your Avatar
              </h1>
              <Form.Group className="mb-3" controlId="formSelect1">
                <Form.Control
                  type="file"
                  ref={input}
                  accept="image/png, image/jpeg"
                ></Form.Control>
              </Form.Group>
              <div>
                <Button
                  onClick={setProfilePicture}
                  type="submit"
                  className="mt-5"
                >
                  Set as Profile Picture
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  type="submit"
                  className="mt-5"
                  variant="danger"
                  style={{ marginLeft: "20px" }}
                >
                  Skip for now
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SetAvatar;
