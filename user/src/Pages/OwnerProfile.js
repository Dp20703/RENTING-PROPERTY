import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import checkSession from "../auth/authService";
import axios from "axios";
import { toast } from "react-toastify";

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
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  //eslint-disable-next-line
  const [selectedFile, setSelectedFile] = useState(null);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    bio: "",
    profilePic: "",
  });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePic: file });
      setSelectedFile(imageUrl);
    }
  };

  const handleProfileChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
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

      setIsEditingProfile(false);
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
          firstName: session.sessionData.firstName,
          lastName: session.sessionData.lastName,
          email: session.sessionData.email,
          phoneNo: session.sessionData.phoneNo,
          bio: session.sessionData.bio || "N/A",
          profilePic:
            session.sessionData.profilePic || "/assets/images/nodp.webp",
        });
      } else {
        window.location.reload();
      }
    };

    fetchSession();
    // eslint-disable-next-line
  }, [isEditingProfile]);

  // Handle Logout
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
    <div
      className="container-fluid bg-light vh-100 d-flex justify-content-center align-items-center"
      style={{ marginTop: "50px", marginBottom: "200px" }}
    >
      <div className="card shadow-lg p-4 text-center w-75">
        <div className="position-relative d-inline-block">
          <img
            src={
              selectedFile ||
              `http://localhost:8000/images/profilePic/${user.profilePic}` ||
              "/assets/images/nodp.webp"
            }
            alt="Profile"
            className="rounded-circle mb-3"
            width="120"
            height="120"
            style={{ objectFit: "cover", border: "4px solid black" }}
          />
          {isEditingProfile && (
            <label
              className="position-absolute translate-middle-x  p-1 m-1 rounded-circle"
              style={{ cursor: "pointer", bottom: "5%", right: "42%" }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                style={{ display: "none" }}
              />
              <i className="fa fa-edit" />
            </label>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSave}>
            <div className="row">
              <div className="col-6">
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleProfileChange}
                  className="form-control mb-2"
                  required
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleProfileChange}
                  className="form-control mb-2"
                  required
                />
              </div>
              <div className="col-6">
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleProfileChange}
                  className="form-control mb-2"
                  required
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  name="phoneNo"
                  value={user.phoneNo}
                  onChange={handleProfileChange}
                  className="form-control mb-2"
                  required
                />
              </div>
              <div className="col-12">
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleProfileChange}
                  className="form-control mb-2"
                  rows="3"
                />
              </div>
            </div>
            {/* <h4 className="mt-4">Identity Verification</h4>
            <div className="form-group">
              <label>Identity Type:</label>
              <select
                name="identityType"
                value={user.identityType}
                onChange={handleProfileChange}
                className="form-control"
                required
              >
                <option value="">Select ID Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group mt-3">
              <label>Identity ID Number:</label>
              <input
                type="text"
                name="identityId"
                value={user.identityId}
                placeholder="Enter ID number"
                onChange={handleProfileChange}
                className="form-control"
                required
              />
            </div> */}
            <button type="submit" className="btn btn-success me-2">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditingProfile(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h3 className="card-title">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-muted">
              {user.email} | {user.phoneNo}
            </p>
            <p className="card-text">{user.bio}</p>
            {/* {user.identityType && user.identityId && ( */}
            {/* <div className="mb-3 d-flex justify-content-center align-content-center gap-3">
              <p>
                <strong>Identity Type:</strong>{" "}
                {!user.identityType ? "No data" : user.identityType}
              </p>
              <p>
                <strong>Identity ID:</strong>{" "}
                {!user.identityId ? "No data" : user.identityId}
              </p>
            </div> */}
            {/* )} */}
            <div className="d-flex justify-content-center gap-2 align-items-center">
              <button
                className="btn btn-primary mb-4"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-danger mb-4 ms-2"
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
