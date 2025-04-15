import React, { useEffect, useState } from "react";
import Navigation from "../Common/Navigation";
import Slider from "../Common/Slider";
import Footer from "../Common/Footer";
import checkSession from "../auth/authService";

const Profile = () => {
  return (
    <>
      <Slider />
      <Navigation />
      <Main />
      <Footer />
    </>
  );
};

function Main() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    bio: "",
    profilePic: "",
  });

  // Fetch session data on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const session = await checkSession();

      if (session.isAuth) {
        setProfile({
          firstName: session.sessionData.first_name,
          lastName: session.sessionData.last_name,
          email: session.sessionData.email,
          // bio: "I am a Software Engineer",
          profilePic:
            session.sessionData.profilePic || "/assets/images/nodp.webp",
        });
      } else {
        window.location.reload();
      }
    };

    fetchSession();
    // eslint-disable-next-line
  }, [isEditing]);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setProfile({ ...profile });
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile(profile);
    setIsEditing(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePic", file);

      try {
        const response = await fetch(
          "http://localhost:8000/updateProfileAdmin",
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        window.location.reload();
        const data = await response.json();

        if (response.ok) {
          setProfile({ ...profile, profilePic: URL.createObjectURL(file) });
          setSelectedFile(URL.createObjectURL(file));
          alert("Profile picture updated!");
        } else {
          alert(data.message || "Failed to update profile picture.");
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        alert("Error updating profile picture");
      }
    }
  };

  return (
    <div className="right_col" role="main" style={{ minHeight: "100vh" }}>
      <div className="mb-5">
        <div className="page-title">
          <div className="title_left">
            <h3>Admin Profile</h3>
          </div>
        </div>
      </div>
      <div className="clearfix" />
      <div className="row">
        <div className="col-md-12 col-sm-12 ">
          <div className="x_panel">
            <div className="x_content">
              <div className="profile_left">
                <div className="col-md-3 col-sm-3  text-center">
                  <div className="profile_img">
                    <img
                      className="img-responsive avatar-view rounded-circle"
                      src={`http://localhost:8000/images/profilePic/${profile.profilePic}`}
                      alt="profile pic"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    {isEditing && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control mt-2"
                      />
                    )}
                  </div>
                  <>
                    <h3>{profile.firstName}</h3>
                    <p>{profile.email}</p>
                    <ul className="list-unstyled user_data">
                      <li>
                        <i className="fa fa-briefcase user-profile-icon" />{" "}
                        {profile.bio}
                      </li>
                    </ul>
                    <button
                      className="btn btn-success"
                      onClick={handleEditToggle}
                    >
                      <i className="fa fa-edit m-right-xs" /> Edit Profile
                    </button>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
