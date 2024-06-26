import { useEffect, useState } from 'react';
import { Table, Tag, Select, Input, Layout, Button } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import styles from './styles/companies.module.css';
import { fetchLogo } from './services/fetchLogo';
import { fetchSheetData } from './services/googleSheets';
import { Company } from './types';

const { Search } = Input;
const { Option } = Select;
const { Content } = Layout;

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFundingStages, setSelectedFundingStages] = useState<string[]>([]);
  const [selectedPrimarySectors, setSelectedPrimarySectors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await fetchSheetData(process.env.REACT_APP_COMPANIES_SHEET_URL as string);
        const formattedData = await Promise.all(companiesData.map(async (company: any) => {
          let logo = company['Logo'];
          if (!logo && company['Website']) {
            try {
              const domain = new URL(company['Website']).hostname;
              logo = await fetchLogo(domain);
            } catch (e) {
              logo = '';
            }
          } else if (!logo) {
            logo = '';
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
    return Array.from(new Set(data.map(item => item[key]).filter(Boolean)));
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    handleFilterChange();
  };

  const handleFundingStageChange = (value: string[]) => {
    setSelectedFundingStages(value);
    handleFilterChange();
  };

  const handlePrimarySectorChange = (value: string[]) => {
    setSelectedPrimarySectors(value);
    handleFilterChange();
  };

  const toggleDescription = (key: string) => {
    setExpandedDescriptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const columns = [
    {
      title: '',
      dataIndex: 'logo',
      key: 'logo',
      render: (text: string) => text ? <img src={text} alt="Company Logo" width={50} height={50} /> : <div style={{ width: 50, height: 50, backgroundColor: '#ccc' }}>N/A</div>,
    },
    {
      title: 'Company Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Company, b: Company) => a.name.localeCompare(b.name),
      render: (text: string) => <span className={styles.boldText}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: Company) => {
        const isExpanded = expandedDescriptions[record.key];
        const displayText = isExpanded || text.length <= 100 ? text : `${text.substring(0, 100)}...`;
        return (
          <>
            <span>{displayText}</span>
            {text.length > 100 && (
              <Button type="link" onClick={() => toggleDescription(record.key)}>
                {isExpanded ? 'Show Less' : 'Load More'}
              </Button>
            )}
          </>
        );
      },
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
      render: (text: string) => text?.split(',').map((tag: string) => <Tag key={tag}>{tag}</Tag>),
    },
  ];

  return (
    <Layout>
      <Content className={styles.content}>
        <div className={styles.toolbar}>
          <Search
            placeholder="Search companies"
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
            style={{ width: 200, marginRight: 20 }}
          />
          <Select
            mode="multiple"
            placeholder="Filter by Funding Stage"
            value={selectedFundingStages}
            onChange={handleFundingStageChange}
            style={{ width: 200, marginRight: 20 }}
          >
            {getUniqueValues(companies, 'fundingStage').map(stage => (
              <Option key={stage} value={stage}>{stage}</Option>
            ))}
          </Select>
          <Select
            mode="multiple"
            placeholder="Filter by Primary Sector"
            value={selectedPrimarySectors}
            onChange={handlePrimarySectorChange}
            style={{ width: 200 }}
          >
            {getUniqueValues(companies, 'primarySector').map(sector => (
              <Option key={sector} value={sector}>{sector}</Option>
            ))}
          </Select>
        </div>
        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            dataSource={filteredCompanies}
            loading={loading}
            pagination={{ pageSize: 8, position: ['bottomLeft'] }}
            rowKey="name"
          />
        </div>
        <div className={styles.cardContainer}>
          {filteredCompanies.map(company => (
            <div className={styles.card} key={company.key}>
              <img src={company.logo || ''} alt={company.name} width={50} height={50} />
              <div className={styles.cardContent}>
                <h3>{company.name}</h3>
                <p>{company.description}</p>
                <p><strong>Funding Stage:</strong> {company.fundingStage}</p>
                <p><strong>Employees:</strong> {company.employees}</p>
                <p><strong>Primary Sector:</strong> {company.primarySector}</p>
                <p><a href={company.website} target="_blank" rel="noopener noreferrer">Website</a></p>
                <p><a href={company.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinOutlined style={{ fontSize: '20px' }} /></a></p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.companyCount}>
          Total Companies: {filteredCompanies.length}
        </div>
      </Content>
    </Layout>
  );
};

export default Companies;