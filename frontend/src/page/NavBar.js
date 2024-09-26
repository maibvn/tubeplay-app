import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

function NavBar({ isLogin, setIsLogin, user }) {
  const navigate = useNavigate();

  const fetchAllPlaylists = async () => {
    const token = JSON.parse(localStorage.getItem("tubeplay-token"));
    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}/api/playlist/playlists`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // All playlist
        // console.log(res.data);
      })
      .catch((err) => {
        console.error("Error verifying token:", err);
      });
  };
  return (
    <div>
      <div className="container-fluid text-white bg-dark">
        <div className="container px-0 pb-4 pt-2">
          <div className="d-flex justify-content-between align-items-center gap-5 mb-4">
            <NavLink to="/" className="navbar-brand fw-bold fs-4">
              TubePlay
            </NavLink>

            {isLogin ? (
              <div className="d-flex justify-content-end align-items-center gap-2 navbar--logged-in">
                <span>{user.email}</span>
                <button
                  className="btn btn-danger btn-s rounded-0 text-light"
                  onClick={fetchAllPlaylists}
                >
                  See all playlist
                </button>
                <div className="d-flex flex-wrap justify-content-end gap-2 ms-2">
                  <button
                    className="btn btn-danger btn-s rounded-0 text-light"
                    onClick={() => {
                      setIsLogin(false);
                      localStorage.removeItem("userInfo");
                      navigate("/");
                    }}
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-wrap justify-content-end gap-4 mt-2">
                <button
                  className="btn btn-danger btn-s rounded-0 text-light "
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>
                <button
                  className="btn btn-danger btn-s rounded-0 text-light "
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
