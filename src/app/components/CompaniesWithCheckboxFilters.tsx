'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Checkbox, Row, Col, Button, Avatar, Input } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';  // Import Ant Design styles by default
import styles from '../../styles/filters.module.css';
import { fetchLogo } from '@/services/fetchLogo';
import { fetchSheetData } from '@/services/googleSheets';
import { Company } from '@/types';

const { Search } = Input;

const Home: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFundingStages, setSelectedFundingStages] = useState<string[]>([]);
  const [selectedPrimarySectors, setSelectedPrimarySectors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await fetchSheetData(process.env.NEXT_PUBLIC_COMPANIES_SHEET_URL as string);
        const formattedData = await Promise.all(companiesData.map(async (company: any) => {
          let logo = company['Logo'];
          if (!logo && company['Website']) {
            try {
              const domain = new URL(company['Website']).hostname;
              logo = await fetchLogo(domain);
            } catch (e) {
              console.error('Invalid URL:', company['Website']);
              logo = '';
            }
          } else if (!logo) {
            logo = ''; // Set empty string if no logo is found
          }
          return {
            key: company['Company Name'],
            name: company['Company Name'],
            description: company['Description'],
            fundingStage: company['Funding Stage'],
            employees: company['Employees'],
            primarySector: company['Primary Sector'],
            website: company['Website'],
            linkedin: company['Linkedin'],
            logo,
          };
        }));
        setCompanies(formattedData);
        setFilteredCompanies(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUniqueValues = (data: Company[], key: keyof Company) => {
    return [...new Set(data.map(item => item[key]).filter(Boolean))];
  };

  const handleFilterChange = () => {
    let filteredData = companies;

    if (selectedFundingStages.length > 0) {
      filteredData = filteredData.filter(company => selectedFundingStages.includes(company.fundingStage));
    }

    if (selectedPrimarySectors.length > 0) {
      filteredData = filteredData.filter(company => selectedPrimarySectors.some(sector => company.primarySector.includes(sector)));
    }

    if (searchTerm) {
      filteredData = filteredData.filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredCompanies(filteredData);
  };

  const columns = [
    {
      title: '',
      dataIndex: 'logo',
      key: 'logo',
      render: (text: string) => text ? <Avatar src={text} size={50} /> : <Avatar size={50}>N/A</Avatar>,
    },
    {
      title: 'Company Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Company, b: Company) => a.name.localeCompare(b.name),
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Funding Stage',
      dataIndex: 'fundingStage',
      key: 'fundingStage',
      sorter: (a: Company, b: Company) => a.fundingStage.localeCompare(b.fundingStage),
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      key: 'employees',
      sorter: (a: Company, b: Company) => parseInt(a.employees) - parseInt(b.employees),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (text: string) => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>,
    },
    {
      title: 'Linkedin',
      dataIndex: 'linkedin',
      key: 'linkedin',
      render: (text: string) => <a href={text} target="_blank" rel="noopener noreferrer"><LinkedinOutlined style={{ fontSize: '20px' }} /></a>,
    },
    {
      title: 'Primary Sector',
      dataIndex: 'primarySector',
      key: 'primarySector',
      sorter: (a: Company, b: Company) => a.primarySector.localeCompare(b.primarySector),
      render: (text: string) => text.split(',').map((tag: string) => <Tag key={tag}>{tag}</Tag>),
    },
  ];

  return (
    <div className={styles.container}>
      <Row gutter={16}>
        <Col span={6}>
          <div className={styles.filters}>
            <h3>Filters</h3>
            <Search
              placeholder="Search by company name"
              enterButton
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleFilterChange}
              style={{ marginBottom: 20 }}
            />
            <div className={styles.filterGroup}>
              <h4>Funding Stage</h4>
              <Checkbox.Group
                options={getUniqueValues(companies, 'fundingStage')}
                onChange={(values: any) => setSelectedFundingStages(values)}
                className={styles.checkboxGroup}
              />
            </div>
            <div className={styles.filterGroup}>
              <h4>Primary Sector</h4>
              <Checkbox.Group
                options={getUniqueValues(companies, 'primarySector')}
                onChange={(values: any) => setSelectedPrimarySectors(values)}
                className={styles.checkboxGroup}
              />
            </div>
            <Button type="primary" onClick={handleFilterChange}>Apply Filters</Button>
          </div>
        </Col>
        <Col span={18}>
          <Table
            columns={columns}
            dataSource={filteredCompanies}
            loading={loading}
            rowKey="name"
            pagination={{ pageSize: 10 }}
            footer={() => <div>Showing {filteredCompanies.length} companies</div>}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Home;