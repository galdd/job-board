import axios from 'axios';

const clearbitLogoURL = 'https://logo.clearbit.com/';

export const fetchLogo = async (domain: string) => {
  try {
    const response = await axios.get(`${clearbitLogoURL}${domain}`, {
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
    // console.error('Error fetching logo:', error);
    return '';
  }
};