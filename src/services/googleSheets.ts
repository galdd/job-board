import Papa from 'papaparse';

export const fetchSheetData = async (url: string) => {
  const response = await fetch(url);
  const csvText = await response.text();
  const data = Papa.parse(csvText, { header: true }).data;
  return data;
};
