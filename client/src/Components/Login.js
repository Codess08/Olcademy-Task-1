import React, { useState, useEffect } from "react";
import { NavLink, Redirect } from "react-router-dom";
import axios from "axios";

const Login = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  if (props.isAuthenticated) {
    return <Redirect to="/" />;
  }
  const { name, email, password, dob, gender } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ email, password, dob, gender });
    try {
      const res = await axios.post("/api/users/login", body, config);
      props.handleChange({
        isAuthenticated: true,
        alerts: [],
        token: res.data.token,
        name: res.data.user.name,
      });

      props.handleChange({
        alerts: [
          {
            type: "success",
            text: "Login Succesfull!!",
          },
        ],
      });
      setTimeout(() => {
        props.handleChange({ alerts: [] });
      }, 3000);
      return <Redirect to="/" />;
    } catch (err) {
      const errors = err.response.data.errors;
      let errs = [];
      if (errors) {
        errors.forEach((error) => {
          errs.unshift({ type: "error", text: error.msg });
        });
      }
      props.handleChange({ alerts: errs });
      setTimeout(() => {
        props.handleChange({ alerts: [] });
      }, 3000);
    }

    return false;
  };

  return (
    <div>
      <div className="containere">
        <form onSubmit={onSubmit} className="form login">
          <h1>Log In</h1>
          <label for="email">Email Address</label>
          <input
            onChange={onChange}
            value={email}
            placeholder="your@email.com"
            name="email"
          />
          <label for="password">Password</label>
          <input
            onChange={onChange}
            value={password}
            placeholder=" ************* "
            name="password"
            type="password"
          />
          <button className="btn btn-success" type="submit">
            LOG IN
          </button>
          <hr></hr>
          <p id="or">OR</p>
          <div className="extra">
            <span>
              <span className="text">Don't have an account?</span>
              <NavLink to="/signup">Sign Up</NavLink>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
