'use client';

import { useEffect, useState } from 'react';

import styles from '../styles/page.module.css';
import { fetchSheetData } from '@/services/googleSheets';
import { Job, Company } from '@/types';

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await fetchSheetData(process.env.NEXT_PUBLIC_COMPANIES_SHEET_URL as string);
        const jobsData = await fetchSheetData(process.env.NEXT_PUBLIC_JOBS_SHEET_URL as string);

        const companiesMap: { [key: string]: Company } = companiesData.reduce((map: any, company: any) => {
          map[company['Company Name']] = {
            name: company['Company Name'],
            description: company['Company Description'],
            logo: company['Company Logo URL'],
            website: company['Company Website URL'],
          };
          return map;
        }, {});

        const jobsWithCompanyData: Job[] = jobsData.map((job: any) => ({
          company: companiesMap[job['Company Name']],
          type: job['Job Type'],
          description: job['Job Description'],
          url: job['Job URL'],
        }));

        setJobs(jobsWithCompanyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Job Listings</h1>
      {jobs.map((job, index) => (
        <div key={index} className={styles.jobCard}>
          <h2>{job.type} at {job.company.name}</h2>
          <p>{job.description}</p>
          <a href={job.url} target="_blank" rel="noopener noreferrer">Apply Here</a>
          <div className={styles.companyInfo}>
            <h3>Company Info</h3>
            <p>{job.company.description}</p>
            <img src={job.company.logo} alt={`${job.company.name} Logo`} className={styles.logo} />
            <br />
            <a href={job.company.website} target="_blank" rel="noopener noreferrer">Visit Company Website</a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
