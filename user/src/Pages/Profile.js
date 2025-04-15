import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { toast } from "react-toastify";
import axios from "axios";
import checkSession from "../auth/authService";

const Profile = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

function Main() {
  const [isEditing, setIsEditing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    bio: "",
    profilePic: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePic: file });
      setSelectedFile(imageUrl);
    }
  };

  // Save changes
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("email", user.email);
      formData.append("phoneNo", user.phoneNo);
      formData.append("bio", user.bio);
      formData.append("profilePic", user.profilePic);

      user.profilePic !== "/assets/images/nodp.webp"
        ? await axios.post("http://localhost:8000/update_profile", formData)
        : await axios.post("http://localhost:8000/update_profile", {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNo: user.phoneNo,
            bio: user.bio,
          });

      setIsEditing(false);
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  // Fetch session data on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const session = await checkSession();

      if (session.isAuth) {
        setUser({
          firstName: session.sessionData?.firstName,
          lastName: session.sessionData?.lastName,
          email: session.sessionData?.email,
          password: session.sessionData?.password,
          phoneNo: session.sessionData?.phoneNo,
          bio: session.sessionData?.bio || "N/A",
          profilePic:
            session.sessionData?.profilePic || "/assets/images/nodp.webp",
        });
      } else {
        window.location.reload();
      }
    };

    fetchSession();
    // eslint-disable-next-line
  }, [isEditing]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/logout");
      toast.success("Logged out successfully!", {
        onClose: () => window.location.reload(),
      });
    } catch (error) {
      toast.error("Logout failed!", { position: "top-right" });
      console.error(error);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-5 text-center w-50"
        style={{ borderRadius: "15px" }}
      >
        {/* Profile Image Section */}
        <div className="position-relative d-flex justify-content-center">
          <Link
            to={`http://localhost:8000/images/profilePic/${user.profilePic}`}
          >
            <img
              src={
                selectedFile ||
                `http://localhost:8000/images/profilePic/${user.profilePic}` ||
                "/assets/images/nodp.webp"
              }
              alt="Profile"
              className="rounded-circle shadow-sm align-content-center"
              width="140"
              height="140"
              style={{ objectFit: "cover", border: "4px solid #007bff" }}
            />
          </Link>
          {isEditing && (
            <label
              className="position-absolute bottom-0 end-0 bg-white p-2 rounded-circle shadow-lg"
              style={{ cursor: "pointer" }}
            >
              <input
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleProfilePicChange}
              />
              <i className="fa fa-camera text-primary"></i>
            </label>
          )}
        </div>

        {isEditing ? (
          // Editable form
          <div className="mt-3">
            <div className="d-flex justify-content-center align-content-center gap-2">
              <input
                type="text"
                name="name"
                value={user.firstName || "N/A"}
                onChange={handleChange}
                className="form-control mb-3"
                placeholder="Enter name"
                required
              />
              <input
                type="text"
                name="lastName"
                value={user.lastName || "N/A"}
                onChange={handleChange}
                className="form-control mb-3"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              value={user.email || "N/A"}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Enter email"
              required
            />
            <div className="input-group mb-3">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter password"
                required
              />
              <span
                className="input-group-text bg-light"
                style={{ cursor: "pointer" }}
                onClick={togglePasswordVisibility}
              >
                <i
                  className={`fa ${
                    passwordVisible ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </span>
              {/* <Link id="link" to="/forgot_password">
                                Forgot your password?
                            </Link> */}
            </div>
            <input
              type="text"
              name="phoneNo"
              value={user.phoneNo}
              onChange={handleChange}
              className="form-control mb-3"
              required
            />
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className="form-control mb-3"
              placeholder="Enter bio"
              rows="3"
              required
            ></textarea>
            <button
              className="btn btn-success me-2 shadow-sm w-40"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="btn btn-secondary shadow-sm w-40"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          // Display profile details
          <>
            <h2 className="card-title mt-3">
              {user.firstName} {user.lastName}
            </h2>
            <p className="card-text text-muted">{user.email}</p>
            <p className="card-text">{user.bio}</p>
            <div className="d-flex justify-content-center text-center align-items-center">
              <button
                className="btn btn-primary me-3 shadow-sm w-40"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-danger shadow-sm w-40"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
