import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  updateUserLocation,
} from "../api";

function Profile({ navigate }) {
  // =========================================================================
  // STATE
  // =========================================================================

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    profilePicture: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editMode, setEditMode] = useState(false);

  // =========================================================================
  // LOAD PROFILE
  // =========================================================================

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await getUserProfile();

      setProfile(data);

      setForm({
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
        profilePicture: data.profilePicture || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
      });
    } catch (err) {
      setError(
        err.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================================
  // FORM CHANGE
  // =========================================================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =========================================================================
  // UPDATE PROFILE
  // =========================================================================

  async function handleSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedProfile =
        await updateUserProfile(form);

      setProfile(updatedProfile);

      setForm({
        name: updatedProfile.name || "",
        phoneNumber:
          updatedProfile.phoneNumber || "",
        profilePicture:
          updatedProfile.profilePicture || "",
        address:
          updatedProfile.address || "",
        city:
          updatedProfile.city || "",
        state:
          updatedProfile.state || "",
        pincode:
          updatedProfile.pincode || "",
      });

      setEditMode(false);

      setSuccess(
        "Profile updated successfully"
      );
    } catch (err) {
      setError(
        err.message ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================================
  // CANCEL EDIT
  // =========================================================================

  function handleCancel() {
    if (!profile) {
      return;
    }

    setForm({
      name: profile.name || "",
      phoneNumber:
        profile.phoneNumber || "",
      profilePicture:
        profile.profilePicture || "",
      address:
        profile.address || "",
      city:
        profile.city || "",
      state:
        profile.state || "",
      pincode:
        profile.pincode || "",
    });

    setEditMode(false);
    setError("");
    setSuccess("");
  }

  // =========================================================================
  // GET CURRENT LOCATION
  // =========================================================================

  function handleGetLocation() {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser"
      );

      return;
    }

    setLocationLoading(true);
    setError("");
    setSuccess("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const updatedProfile =
            await updateUserLocation(
              latitude,
              longitude
            );

          setProfile(updatedProfile);

          setSuccess(
            "Current location updated successfully"
          );
        } catch (err) {
          setError(
            err.message ||
            "Failed to update current location"
          );
        } finally {
          setLocationLoading(false);
        }
      },

      (geoError) => {
        let message =
          "Unable to get your current location";

        if (geoError.code === 1) {
          message =
            "Location permission was denied";
        } else if (geoError.code === 2) {
          message =
            "Current location is unavailable";
        } else if (geoError.code === 3) {
          message =
            "Location request timed out";
        }

        setError(message);
        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  // =========================================================================
  // LOADING
  // =========================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="flex items-center gap-3 text-gray-500">

            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600" />

            <span className="text-sm font-medium">
              Loading profile...
            </span>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // ERROR WITHOUT PROFILE
  // =========================================================================

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">

        <div className="mx-auto max-w-4xl">

          <button
            type="button"
            className="mb-8 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-purple-600"
            onClick={() =>
              navigate("/products")
            }
          >
            ← Back
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error || "Unable to load profile"}
          </div>

          <button
            type="button"
            className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white transition hover:bg-purple-700"
            onClick={loadProfile}
          >
            Retry
          </button>

        </div>

      </div>
    );
  }

  // =========================================================================
  // PROFILE PICTURE
  // =========================================================================

  const profileImage =
    profile.profilePicture &&
    profile.profilePicture.trim() !== ""
      ? profile.profilePicture
      : null;

  // =========================================================================
  // LOCATION AVAILABLE
  // =========================================================================

  const hasLocation =
    profile.latitude !== null &&
    profile.latitude !== undefined &&
    profile.longitude !== null &&
    profile.longitude !== undefined;

  // =========================================================================
  // REUSABLE INPUT CLASS
  // =========================================================================

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100 disabled:text-gray-500";

  // =========================================================================
  // UI
  // =========================================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-5xl">

        {/* ================================================================
            BACK BUTTON
        ================================================================ */}

        <button
          type="button"
          className="mb-8 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-purple-600"
          onClick={() =>
            navigate("/products")
          }
        >
          ← Back
        </button>


        {/* ================================================================
            HEADER
        ================================================================ */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              My Profile
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your personal information
            </p>

          </div>


          {!editMode && (
            <button
              type="button"
              className="w-fit rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
              onClick={() => {
                setEditMode(true);
                setError("");
                setSuccess("");
              }}
            >
              Edit Profile
            </button>
          )}

        </div>


        {/* ================================================================
            MESSAGES
        ================================================================ */}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-600">
            {success}
          </div>
        )}


        {/* ================================================================
            PROFILE CARD
        ================================================================ */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* ==============================================================
              PROFILE PICTURE
          ============================================================== */}

          <div className="border-b border-gray-200 px-6 py-8 sm:px-8">

            <div className="flex flex-col items-center gap-5 sm:flex-row">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg ring-1 ring-gray-200"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 text-4xl font-bold text-purple-600 shadow-sm">
                  {profile.name
                    ? profile.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>
              )}


              {editMode && (
                <div className="w-full max-w-md">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Profile Picture URL
                  </label>

                  <input
                    type="url"
                    name="profilePicture"
                    value={form.profilePicture}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className={inputClass}
                  />

                </div>
              )}

            </div>

          </div>


          {/* ==============================================================
              PROFILE INFORMATION
          ============================================================== */}

          {editMode ? (

            <form
              className="space-y-6 p-6 sm:p-8"
              onSubmit={handleSave}
            >

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className={inputClass}
                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email || ""}
                  disabled
                  className={inputClass}
                />

                <small className="mt-1 block text-xs text-gray-500">
                  Email cannot be changed.
                </small>

              </div>


              {/* PHONE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="Enter phone number"
                  className={inputClass}
                />

              </div>


              {/* ADDRESS */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="Enter your address"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />

              </div>


              {/* CITY / STATE */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Enter city"
                    className={inputClass}
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Enter state"
                    className={inputClass}
                  />

                </div>

              </div>


              {/* PINCODE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="Enter pincode"
                  className={inputClass}
                />

              </div>


              {/* FORM ACTIONS */}

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

              </div>

            </form>

          ) : (

            <div className="divide-y divide-gray-100">

              {/* NAME */}

              <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <span className="text-sm font-medium text-gray-500">
                  Name
                </span>

                <span className="font-semibold text-gray-900">
                  {profile.name || "Not added"}
                </span>

              </div>


              {/* EMAIL */}

              <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <span className="text-sm font-medium text-gray-500">
                  Email
                </span>

                <span className="break-all font-semibold text-gray-900">
                  {profile.email || "Not available"}
                </span>

              </div>


              {/* PHONE */}

              <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <span className="text-sm font-medium text-gray-500">
                  Phone Number
                </span>

                <span className="font-semibold text-gray-900">
                  {profile.phoneNumber ||
                    "Not added"}
                </span>

              </div>


              {/* ADDRESS */}

              <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <span className="text-sm font-medium text-gray-500">
                  Address
                </span>

                <span className="max-w-xl text-right font-semibold text-gray-900">
                  {profile.address ||
                    "Not added"}
                </span>

              </div>


              {/* CITY */}

              <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <span className="text-sm font-medium text-gray-500">
                  City
                </span>

                <span className="font-semibold text-gray-900">
                  {profile.city ||
                    "Not added"}
                </span>

              </div>


              {/* STATE */}

              <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <span className="text-sm font-medium text-gray-500">
                  State
                </span>

                <span className="font-semibold text-gray-900">
                  {profile.state ||
                    "Not added"}
                </span>

              </div>


              {/* PINCODE */}

              <div className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <span className="text-sm font-medium text-gray-500">
                  Pincode
                </span>

                <span className="font-semibold text-gray-900">
                  {profile.pincode ||
                    "Not added"}
                </span>

              </div>

            </div>

          )}

        </div>


        {/* ================================================================
            CURRENT LOCATION
        ================================================================ */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-5 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Current Location
              </h2>

              <p className="mt-1 max-w-xl text-sm text-gray-500">
                Use your device location to update
                your current position.
              </p>

            </div>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {locationLoading
                ? "Getting Location..."
                : "Get Current Location"}
            </button>

          </div>


          {hasLocation ? (

            <div className="space-y-5 p-6 sm:p-8">

              {/* LATITUDE */}

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                <span className="text-sm font-medium text-gray-500">
                  Latitude
                </span>

                <span className="font-mono font-semibold text-gray-900">
                  {profile.latitude}
                </span>

              </div>


              {/* LONGITUDE */}

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                <span className="text-sm font-medium text-gray-500">
                  Longitude
                </span>

                <span className="font-mono font-semibold text-gray-900">
                  {profile.longitude}
                </span>

              </div>


              {/* GOOGLE MAPS */}

              <a
                href={`https://www.google.com/maps?q=${profile.latitude},${profile.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                📍 View on Google Maps
              </a>

            </div>

          ) : (

            <div className="p-8 text-center text-sm text-gray-500">
              Current location has not been added yet.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Profile;