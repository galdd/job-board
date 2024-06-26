import { useEffect, useState } from 'react';
import { Layout, Input, Select, Button, Dropdown, Menu } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import styles from './styles/companies.module.css';
import { fetchLogo } from './services/fetchLogo';
import { fetchSheetData } from './services/googleSheets';
import { Company } from './types';
import CompanyTable from './components/CompanyTable';
import CompanyCard from './components/CompanyCard';

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
  const [isGridView, setIsGridView] = useState(() => {
    return window.innerWidth < 992 || localStorage.getItem('viewMode') === 'grid';
  });
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');
  const [sortField, setSortField] = useState<string>('name');

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

  const switchViewMode = () => {
    const newViewMode = !isGridView;
    setIsGridView(newViewMode);
    localStorage.setItem('viewMode', newViewMode ? 'grid' : 'table');
  };

  const handleSortChange = (field: string) => {
    const newOrder = sortOrder === 'ascend' ? 'descend' : 'ascend';
    setSortOrder(newOrder);
    setSortField(field);

    const sortedData = [...filteredCompanies].sort((a, b) => {
      const aValue = a[field as keyof Company];
      const bValue = b[field as keyof Company];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newOrder === 'ascend' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newOrder === 'ascend' ? aValue - bValue : bValue - aValue;
      } else {
        return 0;
      }
    });

    setFilteredCompanies(sortedData);
  };

  const sortMenu = (
    <Menu onClick={({ key }) => handleSortChange(key)}>
      <Menu.Item key="name">Company Name</Menu.Item>
      <Menu.Item key="fundingStage">Funding Stage</Menu.Item>
      <Menu.Item key="employees">Employees</Menu.Item>
      <Menu.Item key="primarySector">Primary Sector</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsGridView(true);
      } else {
        const storedViewMode = localStorage.getItem('viewMode');
        setIsGridView(storedViewMode === 'grid');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout>
      <Content className={`${styles.content} ${isGridView ? styles.gridView : ''}`}>
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
          {window.innerWidth >= 768 && (
            <>
              <Button
                className={styles.viewButton}
                onClick={switchViewMode}
                icon={isGridView ? <UnorderedListOutlined /> : <AppstoreOutlined />}
              />
              <Dropdown overlay={sortMenu}>
                <Button>
                  Sort By {sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                </Button>
              </Dropdown>
            </>
          )}
          {window.innerWidth < 768 && (
            <Dropdown overlay={sortMenu}>
              <Button>
                Sort By {sortOrder === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              </Button>
            </Dropdown>
          )}
        </div>
        {isGridView ? (
          <CompanyCard companies={filteredCompanies} />
        ) : (
          <CompanyTable
            companies={filteredCompanies}
            expandedDescriptions={expandedDescriptions}
            toggleDescription={toggleDescription}
            loading={loading}
          />
        )}
        <div className={styles.companyCount}>
          Total Companies: {filteredCompanies.length}
        </div>
      </Content>
    </Layout>
  );
};

export default Companies;