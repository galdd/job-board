'use client';

import { Layout } from 'antd';
import 'antd/dist/reset.css';  // Import Ant Design styles by default
import styles from '../styles/page.module.css';
import Sidebar from './components/Sidebar';
import Companies from './components/Companies';
import CompaniesWithCheckboxFilters from './components/CompaniesWithCheckboxFilters';
import { useState } from 'react';

const { Header, Content, Footer } = Layout;

const Home: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('home');

  const renderContent = () => {
    switch (selectedComponent) {
      case 'companies':
        return <Companies />;
      case 'companies-checkbox':
        return <CompaniesWithCheckboxFilters />;
      case 'home':
      default:
        return <h1>Welcome to the Modi'in Job Board</h1>;
    }
  };

  return (
    <Layout className={styles.layout}>
      <Sidebar setSelectedComponent={setSelectedComponent} />
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerContent}>Modi'in Job Board</div>
        </Header>
        <Content className={styles.content}>
          {renderContent()}
        </Content>
        <Footer className={styles.footer}>©2024 Created by <a href='https://www.linkedin.com/in/gal-dagan/'>Gal Dagan </a> </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;