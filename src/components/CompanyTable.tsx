import React from 'react';
import { Table, Tag, Button } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';
import { Company } from '../types';
import styles from '../styles/companies.module.css';

interface CompanyTableProps {
  companies: Company[];
  expandedDescriptions: { [key: string]: boolean };
  toggleDescription: (key: string) => void;
  loading: boolean;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ companies, expandedDescriptions, toggleDescription, loading }) => {
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
    <Table
      columns={columns}
      dataSource={companies}
      loading={loading}
      pagination={{ pageSize: 8, position: ['bottomLeft'] }}
      rowKey="name"
    />
  );
};

export default CompanyTable;