import { useEffect, useState } from "react";
import ProfileIcon from "../../../assets/icons/full-profile-icon.svg?react";
import "./ProfileSection.scss";
import { useAuth } from "../../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { getUserProfile } from "../../../utils/apiHelper";

const ProfileSection = () => {
  const { update, authState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    profilePicture: "",
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
    setUserData(response.data);
    setEditData(response.data);
  };

  useEffect(() => {
    if (authState?.token) {
      getUserInfo();
    }
  }, [authState]);

  return (
    <div className="profile">
      <ToastContainer />
      <div className="profile__card">
        {userData?.profilePicture ? (
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="profile__image"
          />
        ) : (
          <ProfileIcon className="profile__image" />
        )}
        {isEditing && (
          <input
            type="url"
            name="profilePicture"
            value={editData.profilePicture}
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
          <button
            className="profile__btn profile__btn--edit"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
