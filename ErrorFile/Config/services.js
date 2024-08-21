import { LOGIN, REGISTER  , FORGOT_PASS , VERIFICATION_STATUS_URL , LOGOUT} from "./api";
import axios from "axios";

export const loginService = async (email, password) => {
  try {
    console.log("LOGIN:",LOGIN,email, password)
    const response = await axios.post(LOGIN, {
      email: email,
      password: password,
    });
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error)
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerService = async (payload) => {
    try {
        const response = await axios.post(REGISTER, payload);
        console.log(response)
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {        
            return { error: true, message: error.response.data.message || error.message };
        } else {
            return { error: true, message: error.message };
        }
    }
};


export const forgotPassword = async (email) => {
  try {
      const response = await axios.post(FORGOT_PASS, { email });
      return response.data;
  } catch (error) {
      console.error('Error sending forgot password request:', error);
      throw error;
  }
};



export const checkVerificationStatus = async (token) => {
  const response = await axios.get(VERIFICATION_STATUS_URL, {
      headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};




export const logout = async () => {
  try {
    const response = await axios.post(LOGOUT);
    return response.data;
  } catch (error) {
    throw new Error('Logout failed');
  }
};
