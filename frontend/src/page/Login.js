/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { SERVER_URL } from

function Login({ setIsLogin, setUser }) {
  const navigate = useNavigate();
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [response, setResponse] = useState({
    isAuthenticated: null,
  });

  const postLogin = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_DOMAIN}/login`, {
      method: "POST",
      body: JSON.stringify({ email: enteredEmail, password: enteredPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log("Login response: ", data);
    if (!res.ok) {
      throw new Error("Could not login!");
    }
    setResponse(data);
    return null;
  };

  const postLoginHandler = (e) => {
    e.preventDefault();
    if (enteredEmail && enteredPassword) {
      postLogin();
    } else {
      alert("Please enter all fields!");
    }
  };

  useEffect(() => {
    if (response.isAuthenticated) {
      setIsLogin(true);
      setUser(response.user);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ isLogin: true, user: response.user })
      );
      navigate("/");
    } else {
      setEnteredPassword("");
    }
  }, [response]);

  return (
    <div className="container d-flex flex-column align-items-center text-center my-5">
      <h2 className="fw-bold mb-4">Log In</h2>
      <form className="" onSubmit={postLoginHandler}>
        <input
          required
          type="email"
          value={enteredEmail}
          placeholder="Enter email"
          style={{ minWidth: "20rem" }}
          className="form-control p-3 mb-3"
          onChange={(e) => setEnteredEmail(e.target.value)}
        />

        <input
          required
          type="password"
          value={enteredPassword}
          placeholder="Enter password"
          style={{ minWidth: "20rem" }}
          className="form-control p-3 mb-3"
          onChange={(e) => setEnteredPassword(e.target.value)}
        />

        {response.isAuthenticated === false && (
          <p className="fs-7 text-danger">Email or password is incorrect!</p>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100 fw-bold"
          disabled={enteredEmail === "" || enteredPassword === ""}
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default Login;
