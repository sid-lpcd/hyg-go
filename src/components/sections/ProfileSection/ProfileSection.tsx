import { useEffect, useState, ChangeEvent } from "react";
import ProfileIcon from "../../../assets/icons/full-profile-icon.svg?react";
import "./ProfileSection.scss";
import { useAuth } from "../../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { getUserProfile } from "../../../utils/apiHelper";
import { getCode } from "country-list";
import { InfinitySpin } from "react-loader-spinner";
import { User } from "@/types";

const ProfileSection: React.FC = () => {
  const { update, logout, authState } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [editData, setEditData] = useState<User | null>(null);

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!editData) return;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    if (!editData) return;
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
    if (!authState?.token) return;
    const response = await getUserProfile(authState.token);
    setUserData(response);
    setEditData(response);
  };

  const countryNameToCode = (countryName: string) => {
    const code = getCode(countryName);
    return code || null;
  };

  useEffect(() => {
    if (authState?.token) {
      getUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);

  if (!userData || !editData) {
    return (
      <div className="loader-overlay">
        <InfinitySpin width="200" color="#ffffff" />
      </div>
    );
  }

  return (
    <section className="profile">
      <ToastContainer />
      <div className="profile__card">
        <h2 className="profile__title">Profile</h2>
        <div className="profile__stats">
          {userData?.profilePicture ? (
            <img
              src={userData.profilePicture}
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
                {userData.totalTrips}
              </span>
              <span className="profile__stat-label">Trips</span>
            </div>
            <div className="profile__stat">
              <span className="profile__stat-number">{userData.country ? 1 : 0}</span>
              <span className="profile__stat-label">Countries</span>
            </div>
          </div>
        </div>
        <div className="profile__flags">
          {userData.country && (
            (() => {
              console.log("Country:", userData.country);
              const code = countryNameToCode(userData.country.trim());
              if (code) {
                return (
                  <img
                    key={code}
                    src={`https://catamphetamine.gitlab.io/country-flag-icons/3x2/${code}.svg`}
                    alt={userData.country}
                    className="profile__flag"
                  />
                );
              }
              return (
                <span className="profile__flag--notfound">
                  {userData.country}
                </span>
              );
            })()
          )}
        </div>
        {isEditing && (
          <input
            type="url"
            name="profilePicture"
            value={editData.profilePicture || ""}
            onChange={handleEditChange}
            className="profile__input profile__input--image"
            placeholder="Profile Picture URL"
          />
        )}

        <h2 className="profile__name">
          {isEditing ? (
            <>
              <div className="profile__input-group">
                <label htmlFor="firstName" className="profile__input-label">
                  First Name(s) <span className="profile__input-required">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleEditChange}
                  className="profile__input profile__input--name"
                  placeholder="First Name"
                />
              </div>
              <div className="profile__input-group">
                <label htmlFor="lastName" className="profile__input-label">
                  Last Name <span className="profile__input-required">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleEditChange}
                  className="profile__input profile__input--name"
                  placeholder="Last Name"
                />
              </div>
            </>
          ) : (
            `${userData.firstName} ${userData.lastName}`
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
                value={editData.bio || ""}
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
