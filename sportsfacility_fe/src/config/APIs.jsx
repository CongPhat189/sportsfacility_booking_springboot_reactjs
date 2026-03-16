import axios from "axios"
import cookie from "react-cookies"

export const BASE_URL = 'http://localhost:8080/'

export const endpoints = {
    // APIs for auth
    'register_student': '/auth/register',

    'login': '/auth/login',


    'current-user': '/user/current-user',
    // 'update-user': '/secure/update-profile',


    // APIs for user



    // APIs for Owner





    // APIs for VNPay




    // APIs for admin









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