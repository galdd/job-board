'use client';

import { useEffect, useState } from 'react';
import { fetchSheetData } from '../services/googleSheets';
import { Company, Job } from '../types';
import { Input, Select, Card } from 'antd';
import styles from '../styles/page.module.css';
import 'antd/dist/reset.css';  

const { Search } = Input;
const { Option } = Select;

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await fetchSheetData(process.env.NEXT_PUBLIC_COMPANIES_SHEET_URL as string);
        const jobsData = await fetchSheetData(process.env.NEXT_PUBLIC_JOBS_SHEET_URL as string);
        
        const companiesMap: { [key: string]: Company } = companiesData.reduce((map: any, company: any) => {
          if (company['Company Name']) {
            map[company['Company Name']] = {
              name: company['Company Name'],
              description: company['Company Description'],
              logo: company['Company Logo URL'],
              website: company['Company Website URL'],
            };
          }
          return map;
        }, {});

        const jobsWithCompanyData: Job[] = jobsData.map((job: any) => {
          const company = companiesMap[job['Company Name']];
          if (!company) return null;
          return {
            company,
            type: job['Job Type'],
            description: job['Job Description'],
            url: job['Job URL'],
          };
        }).filter(job => job !== null);

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
      <div className={styles.header}>
        <h1>Modi'in Job Board</h1>
      </div>
      <div className={styles.toolbar}>
        <Search placeholder="Search jobs" style={{ width: 200, marginRight: 20 }} />
        <Select placeholder="Filter by company" style={{ width: 200 }}>
          {Array.from(new Set(jobs.map(job => job.company.name))).map(companyName => (
            <Option key={companyName} value={companyName}>{companyName}</Option>
          ))}
        </Select>
      </div>
      <div className={styles.feed}>
        {jobs.map((job, index) => (
          <Card
            key={index}
            hoverable
            className={styles.jobCard}
          >
            <div className={styles.cardContent}>
              <div className={styles.companyLogo}>
                <img alt={`${job.company.name} Logo`} src={job.company.logo} className={styles.logo} />
              </div>
              <div className={styles.jobInfo}>
                <Card.Meta title={job.type} description={
                  <div className={styles.jobDescription}>
                    {job.description}
                  </div>
                } />
                <div className={styles.companyInfo}>
                  <h3>{job.company.name}</h3>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">Apply Here</a>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;
