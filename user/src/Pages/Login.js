import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BACKEND_URL } from "../constant";
const Login = () => {
  return (
    <div>
      <Main />
    </div>
  );
};

function Main() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const validate = () => {
    let newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = "Invalid email format";
    }
    if (data.password.trim() === "") {
      newErrors.password = "Password cannot be empty";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, data);
      localStorage.setItem("role", response.data.userDetails.session.role);

      toast.success("Login Successfully!!", {
        onClose: () => navigate("/")
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSuccess = async (response) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/google`, {
        credential: response.credential,
      }, {
        withCredentials: true
      });

      console.log("Backend response:", res.data);

      // Save the token and role to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.userDetails.role); // Save role

      toast.success("Login Successfully!!", {
        onClose: () => window.location.reload(),
      });
    } catch (error) {
      console.error("Google Login Failed:", error);
    }
  };

  return (
    <>
      {" "}
      <GoogleOAuthProvider clientId="656153424458-qvggjs381b2fo46n3e9hqfqm687glu0p.apps.googleusercontent.com">
        <section className="w3l-forms-23">
          <div id="forms23-block">
            <div className="wrapper">
              <div className="logo1">
                <Link id="link" className="brand-logo" to="/">
                  <span>Renting </span>Properties
                </Link>
              </div>
              <div className="d-grid forms23-grids">
                <div className="form23">
                  <h6>Login with your account</h6>
                  <form onSubmit={handleLogin}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required="required"
                      onChange={handleChange}
                      value={data.email}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      value={data.password}
                      required="required"
                    />
                    {errors.password && (
                      <p className="error">{errors.password}</p>
                    )}
                    <Link id="link" to="/forgot_password">
                      Forgot your password?
                    </Link>
                    <button type="submit">Login</button>
                  </form>
                  <p className="text-center pt-2">
                    Not have an account yet?{" "}
                    <Link id="link" to="/signup">
                      Register now
                    </Link>
                  </p>
                </div>

                <div className="frm-tp">
                  <div className="form23-text">
                    <h6>Connect with</h6>
                    <div className="form23-text-top">
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => console.log("Login Failed")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </GoogleOAuthProvider>
    </>
  );
}

export default Login;
