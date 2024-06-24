import Sidebar from '../components/Sidebar';
import { Layout } from 'antd';
import 'antd/dist/reset.css';  // Import Ant Design styles by default
import styles from '../styles/page.module.css';

const { Header, Content, Footer } = Layout;

export default function HomePage() {
  return (
    <Layout className={styles.layout}>
      <Sidebar />
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerContent}>Modi'in Job Board</div>
        </Header>
        <Content className={styles.content}>
          <h1>Welcome to the Modi'in Job Board</h1>
        </Content>
        <Footer className={styles.footer}>©2024 Created by My Company</Footer>
      </Layout>
    </Layout>
  );
}