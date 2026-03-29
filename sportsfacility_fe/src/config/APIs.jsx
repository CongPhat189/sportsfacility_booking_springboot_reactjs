import axios from "axios"
import cookie from "react-cookies"

export const BASE_URL = 'http://localhost:8080/'

export const endpoints = {
    // Auth
    'register': '/auth/register',
    'login': '/auth/login',
    'current-user': '/user/profile',


    // Courts
    'courts-search': '/courts/search',
    'categories': '/courts/categories',
    'available-slots': (courtId) => `/courts/${courtId}/available-slots`,

    // Booking
    'create-booking': '/bookings',
    'booking-history': '/bookings/history',
    'cancel-booking': (id) => `/bookings/${id}/cancel`,

    // VNPay
    'vnpay-create':     '/payments/vnpay/create',

    // Reviews
    'create-review':  '/reviews',
    'booking-review': (id) => `/bookings/${id}/review`,


    // OWNER - COURT CRUD APIs
    'owner-courts': '/owner/courts',
    'owner-court-detail': (id) => `/owner/courts/${id}`,

    // OWNER - SCHEDULE
    'owner-schedules': '/owner/schedules',
    // 'owner-schedules': (courtId = "") => `/owner/schedules${courtId ? `/${courtId}` : ""}`,

    // OWNER - BOOKINGS
    "owner-bookings": "/owner/bookings",

    "owner-booking-detail": (id) => `/owner/bookings/${id}`,

    "update-booking": (id) => `/owner/bookings/${id}`,

    "delete-booking": (id) => `/owner/bookings/${id}`,

    "confirm-booking": (id) => `/owner/bookings/${id}/confirm`,

    "reject-booking": (id) => `/owner/bookings/${id}/reject`,

    "checkin-booking": (id) => `/owner/bookings/${id}/checkin`,

    "complete-booking": (id) => `/owner/bookings/${id}/complete`,

    //OWNER - REVENUE
    "owner-revenue": "/owner/revenue",



    // API for Admin
    getCategories: '/admin/categories',
    createCategory: '/admin/categories',
    updateCategory: (id) => `/admin/categories/${id}`,
    deleteCategory: (id) => `/admin/categories/${id}`,
    enableCategory: (id) => `/admin/categories/${id}/enable`,
    disableCategory: (id) => `/admin/categories/${id}/disable`,


    pendingCourts: '/admin/courts/pending',
    activeCourts: '/admin/courts/active',
    approveCourt: (id) => `/admin/courts/${id}/approve`,
    rejectCourt: (id) => `/admin/courts/${id}/reject`,
    detailsCourt: (id) => `/admin/courts/${id}`,
    updateCommission: (id) => `/admin/courts/${id}/commission`,

    getListUsers: '/admin/users',
    lockUser: (id) => `/admin/users/${id}/lock`,
    unlockUser: (id) => `/admin/users/${id}/unlock`,
    deleteUser: (id) => `/admin/users/${id}`,

    adminBookingReport: (month, year) => `/admin/reports/booking-pie?month=${month}&year=${year}`,
    adminrevenueReport: (month, year) => `/admin/reports/revenue-3months?month=${month}&year=${year}`,


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