import Papa from 'papaparse';

export const fetchSheetData = async (url: string): Promise<any[]> => {
  try {
    // console.log('Fetching data from URL:', url);
    const response = await fetch(url);
    const csvText = await response.text();
    // console.log('CSV Text:', csvText);
    const data = Papa.parse(csvText, { header: true }).data;
    // console.log('Parsed Data:', data);
    return data;
  } catch (error) {
    // console.error('Error fetching or parsing data:', error);
    return [];
  }
};

