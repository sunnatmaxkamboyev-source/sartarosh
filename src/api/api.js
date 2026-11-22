import { request } from "./client.js";
import { toDateKey } from "../utils/date.js";

/* ---------- Profil ---------- */
export const getProfile = () => request("/profile");

export const saveProfile = (profile) =>
  request("/profile", {
    method: "PUT",
    body: { name: profile.name, title: profile.title, photo: profile.photo },
  });

/* ---------- Xizmatlar ---------- */
export const getServices = () => request("/services");

export const addService = (data) =>
  request("/services", { method: "POST", body: data });

export const updateService = (id, data) =>
  request(`/services/${id}`, { method: "PUT", body: data });

export const deleteService = (id) =>
  request(`/services/${id}`, { method: "DELETE" });

/* ---------- Bronlar ---------- */
export const getBookedSlots = (date) =>
  request(`/bookings/booked?date=${toDateKey(date)}`);

export const createBooking = (data) =>
  request("/bookings", { method: "POST", body: data });

export const getBookings = () => request("/bookings");

export const setBookingStatus = (id, status) =>
  request(`/bookings/${id}/status`, { method: "PATCH", body: { status } });

/* ---------- Admin kirishi ---------- */
export const adminLogin = (phone, password) =>
  request("/auth/login", {
    method: "POST",
    body: { phone, password },
    auth: false,
  });