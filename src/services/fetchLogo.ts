import axios from 'axios';

const clearbitLogoURL = 'https://logo.clearbit.com/';


const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {

    return Promise.reject(error);
  }
);

export const fetchLogo = async (domain: string) => {
  try {
    const response = await axiosInstance.get(`${clearbitLogoURL}${domain}`, {
      validateStatus: (status) => {
        return status < 500; 
      }
    });

    if (response.status === 200) {
      return `${clearbitLogoURL}${domain}`;
    } else {
      return ''; 
    }
  } catch (error) {
    // Silent handling of error
    return '';
  }
};