import React from 'react';
import { LinkedinOutlined } from '@ant-design/icons';
import { Company } from '../types';
import styles from '../styles/companies.module.css';

interface CompanyCardProps {
  companies: Company[];
}

const CompanyCard: React.FC<CompanyCardProps> = ({ companies }) => {
  console.log('Rendering CompanyCard with companies:', companies);

  return (
    <div className={styles.cardContainer}>
      {companies.map((company) => (
        <div key={company.key} className={styles.card}>
          <img src={company.logo} alt={`${company.name} Logo`} width={50} height={50} />
          <div className={styles.cardContent}>
            <h3>{company.name}</h3>
            <p>{company.description}</p>
            <p><strong>Funding Stage:</strong> {company.fundingStage}</p>
            <p><strong>Employees:</strong> {company.employees}</p>
            <p><strong>Primary Sector:</strong> {company.primarySector}</p>
            <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a><br></br><br></br>
            <p><a href={company.linkedin} target="_blank" rel="noopener noreferrer">
           <LinkedinOutlined style={{ fontSize: '20px' }} />
            </a></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyCard;