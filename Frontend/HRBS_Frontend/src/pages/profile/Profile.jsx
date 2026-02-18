import { useEffect, useState } from "react";
import { profileAPI } from "../../api/profileAPI";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    profile_image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        setProfile(res.data.data);

        setFormData({
          first_name: res.data.data.first_name || "",
          last_name: res.data.data.last_name || "",
          phone_number: res.data.data.phone_number || "",
          profile_image: null,
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle text + image change
  const handleChange = (e) => {
    if (e.target.name === "profile_image") {
      const file = e.target.files[0];
      setFormData({ ...formData, profile_image: file });

      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Save profile
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("phone_number", formData.phone_number);

      if (formData.profile_image) {
        data.append("profile_image", formData.profile_image);
      }

      const res = await profileAPI.updateProfile(data);

      setProfile(res.data.data);
      setPreviewImage(null);

      alert("Profile updated successfully!");
    } catch (err) {
      setError("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {/* Profile Image Upload Circle */}
      <div className="flex justify-center mb-6">
        <label htmlFor="profileUpload" className="cursor-pointer relative">

          <img
            src={
              previewImage
                ? previewImage
                : profile?.profile_image
                ? profile.profile_image
                : "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md hover:opacity-80 transition"
          />

          <div className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Edit
          </div>
        </label>

        <input
          type="file"
          id="profileUpload"
          name="profile_image"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;