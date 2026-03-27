import axios from "axios"
import cookie from "react-cookies"

export const BASE_URL = 'http://localhost:8080/'

export const endpoints = {
    // Auth
    'register':         '/auth/register',
    'login':            '/auth/login',
    'current-user':     '/user/profile',
    'current-user1': '/user/current-user',

    // Courts
    'courts-search':    '/courts/search',
    'categories':       '/courts/categories',
    'available-slots':  (courtId) => `/courts/${courtId}/available-slots`,

    // Booking
    'create-booking':   '/bookings',
    'booking-history':  '/bookings/history',
    'cancel-booking':   (id) => `/bookings/${id}/cancel`,

    // VNPay
    'vnpay-create':     '/payments/vnpay/create',

    // OWNER - COURT CRUD APIs
    'owner-courts': '/owner/courts',
    'owner-court-detail': (id) => `/owner/courts/${id}`,

    // OWNER - SCHEDULE
    'owner-schedules': '/owner/schedules',
    // 'owner-schedules': (courtId = "") => `/owner/schedules${courtId ? `/${courtId}` : ""}`,

    // OWNER - BOOKINGS
    'owner-bookings': '/owner/bookings',
}

export const authAPIs = () => {
    const token = cookie.load("jwtToken");
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});