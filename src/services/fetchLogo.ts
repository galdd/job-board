import axios from 'axios';

const clearbitLogoURL = 'https://logo.clearbit.com/';

export const fetchLogo = async (domain: string) => {
  try {
    const response = await axios.get(`${clearbitLogoURL}${domain}`, {
      validateStatus: (status) => {
        return status < 500; // Resolve only if the status code is less than 500
      }
    });

    if (response.status === 200) {
      return `${clearbitLogoURL}${domain}`;
    } else {
      return ''; // Return empty string if logo is not found or blocked by CORS
    }
  } catch (error) {
    console.error('Error fetching logo:', error);
    return '';
  }
};