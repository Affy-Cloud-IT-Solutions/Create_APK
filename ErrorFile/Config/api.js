const BASE_URL = "http://eleganzaestatesolutions.com:8715/api/";


// ALL
export const LOGIN = BASE_URL + "user/login";
export const REGISTER = BASE_URL + "user/register";
export const VERIFICATION_STATUS_URL = BASE_URL + "user/register";
export const OTP = BASE_URL + "user/verify-otp";
export const RESEND_OTP = BASE_URL + "user/resend-otp";
export const FORGOT_PASS = BASE_URL + "user/forgot-password";
export const RESET_PASS = BASE_URL + "user/reset-password";
export const CHANGE_PASSWORD = BASE_URL + "user/change-password";
export const USER_DETAILS = BASE_URL + "user/getUser";
export const EDIT_USER_DETAILS = BASE_URL + "user/update-user";
export const LOGOUT = BASE_URL + "user/logout";


export const LEAD_FIELD = BASE_URL + "admin/get-fields";
export const ADD_VALUE = BASE_URL + "admin/add-values";


export const ALL_PROPERTIES = BASE_URL + "user/public-listing";
export const USER_ONE_PROPERTY = BASE_URL + "user/getProperty/";
export const PROPERTY_ID = BASE_URL + "admin/property";
export const SEARCH_PROPERTY = BASE_URL + "admin/search";
export const WISH_LIST = BASE_URL + "admin/wishlist/";
export const GET_WISH_LIST = BASE_URL + "admin/properties/wishlist";


//employee
export const CREATE_EMPLOYEE = BASE_URL + "admin/create-employee";
export const GET_ALL_EMPLOYEE = BASE_URL + "admin/employees";
export const UPDATE_EMPLOYEE = BASE_URL + "admin/update-employee/";
export const ALL_EMPLOYEE_PROPERTY = BASE_URL + "admin/agentProperty";



//admin api
export const PROPERTY_GET = BASE_URL + "admin/properties";
export const CREATE_PROPERTY = BASE_URL + "admin/create-properties";
export const DELETE_PROPERTY = BASE_URL + "admin/delete-property/";
export const APPROVAL_PROPERTY = BASE_URL + "admin/updateAdminApproval";
export const GET_ALL_QUERIES = BASE_URL + "admin/getQueries";
export const ASSIGN_QUERIE = BASE_URL + "admin/assignQuery";
export const GET_EMPLOYEE_QUERIES = BASE_URL + "admin/assignedQueries";
