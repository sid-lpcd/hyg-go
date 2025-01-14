import { useEffect, useState } from "react";
import ProfileIcon from "../../../assets/icons/full-profile-icon.svg?react";
import "./ProfileSection.scss";
import { useAuth } from "../../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { getUserProfile } from "../../../utils/apiHelper";
import { getCode } from "country-list";

const ProfileSection = () => {
  const { update, logout, authState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    bio: "",
    total_trips: 0,
    followers: 0,
    following: 0,
    countries: [],
    profile_picture: "",
  });

  const [editData, setEditData] = useState(userData);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    const response = await update(editData);

    if (!response.error) {
      toast("Profile updated successfully!");
      setUserData(editData);
      setIsEditing(false);
    } else {
      toast(response.error);
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const getUserInfo = async () => {
    const response = await getUserProfile(authState.token);
    console.log(response);
    setUserData(response.data);
    setEditData(response.data);
  };

  const countryNameToCode = (countryName) => {
    const code = getCode(countryName);
    return code || null;
  };

  useEffect(() => {
    if (authState?.token) {
      getUserInfo();
    }
  }, [authState]);

  return (
    <section className="profile">
      <ToastContainer />
      <div className="profile__card">
        <h2 className="profile__title">Profile</h2>
        <div className="profile__stats">
          {userData?.profile_picture ? (
            <img
              src={userData.profile_picture}
              alt="Profile"
              className="profile__image"
            />
          ) : (
            <ProfileIcon className="profile__image" />
          )}
          <div className="profile__box">
            <div className="profile__stat">
              <span className="profile__stat-number">{userData.followers}</span>
              <span className="profile__stat-label">Followers</span>
            </div>
            <div className="profile__stat">
              <span className="profile__stat-number">{userData.following}</span>
              <span className="profile__stat-label">Following</span>
            </div>
            <div className="profile__stat">
              <span className="profile__stat-number">
                {userData.total_trips}
              </span>
              <span className="profile__stat-label">Trips</span>
            </div>
            <div className="profile__stat">
              <span className="profile__stat-number">
                {userData.countries.length}
              </span>
              <span className="profile__stat-label">Countries</span>
            </div>
          </div>
        </div>
        <div className="profilec">
          {userData.countries.map((country) => (
            <img
              key={country}
              src={`https://catamphetamine.gitlab.io/country-flag-icons/3x2/${countryNameToCode(
                country
              )}.svg`}
              alt={country}
              className="profile__flag"
            />
          ))}
        </div>
        {isEditing && (
          <input
            type="url"
            name="profile_picture"
            value={editData.profile_picture}
            onChange={handleEditChange}
            className="profile__input profile__input--image"
            placeholder="Profile Picture URL"
          />
        )}

        <h2 className="profile__name">
          {isEditing ? (
            <>
              <div className="profile__input-group">
                <label htmlFor="first_name" className="profile__input-label">
                  First Name(s){" "}
                  <span className="profile__input-required">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={editData.first_name}
                  onChange={handleEditChange}
                  className="profile__input profile__input--name"
                  placeholder="First Name"
                />
              </div>
              <div className="profile__input-group">
                <label htmlFor="last_name" className="profile__input-label">
                  Last Name <span className="profile__input-required">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={editData.last_name}
                  onChange={handleEditChange}
                  className="profile__input profile__input--name"
                  placeholder="Last Name"
                />
              </div>
            </>
          ) : (
            `${userData.first_name} ${userData.last_name}`
          )}
        </h2>

        <p className="profile__email">
          {isEditing ? (
            <div className="profile__input-group">
              <label htmlFor="email" className="profile__input-label">
                Email <span className="profile__input-required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                className="profile__input profile__input--email"
                placeholder="Email"
              />
            </div>
          ) : (
            userData.email
          )}
        </p>

        <div className="profile__bio">
          {isEditing ? (
            <div className="profile__input-group">
              <label htmlFor="bio" className="profile__input-label">
                Bio
              </label>
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleEditChange}
                className="profile__input profile__input--bio"
                placeholder="Tell something about yourself"
              />
            </div>
          ) : (
            <p>{userData.bio || "No bio available"}</p>
          )}
        </div>

        {isEditing ? (
          <div className="profile__actions">
            <button
              className="profile__btn profile__btn--save"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="profile__btn profile__btn--cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="profile__actions">
            <button
              className="profile__btn profile__btn--edit"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
            <button
              className="profile__btn profile__btn--logout"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileSection;
