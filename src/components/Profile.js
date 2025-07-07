import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../App.css"; 
import SwiftLogo from "../assests/SWIFTLOGO.svg";
function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="header">
       <img src={SwiftLogo} alt="SWIFT" fill="white" className="logo-img" />
        <div className="user-circle">{getInitials(user.name)}</div>
      </div>

      <div className="container">
        <div onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#2f2e41", marginBottom: "1rem" }}>
          ← Welcome, {user.name}
        </div>

        <div className="profile-card">
          <div className="profile-info-left">
            <div className="profile-avatar">{getInitials(user.name)}</div>
            <div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
            </div>
          </div>

          <div className="profile-grid">
            <div>
              <label>User ID</label>
              <div className="readonly-box">12345687</div>
            </div>
            <div>
              <label>Name</label>
              <div className="readonly-box">{user.name}</div>
            </div>
            <div>
              <label>Email ID</label>
              <div className="readonly-box">{user.email}</div>
            </div>
            <div>
              <label>Address</label>
              <div className="readonly-box">
                {user.address.street}, {user.address.city}
              </div>
            </div>
            <div>
              <label>Phone</label>
              <div className="readonly-box">{user.phone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

export default Profile;
