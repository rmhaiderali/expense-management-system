import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import UserHome from "./UserHome";
import AdminHome from "./AdminHome";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [cUser, setcUser] = useState();

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        // console.log(user);

        // if (user.isAvatarImageSet === false || user.avatarImage === "") {
        //   navigate("/setAvatar");
        // }

        setcUser(user);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  return (
    <>
      <Header />
      {cUser?.UserType === "admin" ? <AdminHome /> : <UserHome />}
    </>
  );
};

export default Home;
