import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, FileOutlined, InfoCircleOutlined, ContactsOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';  // Import Ant Design styles by default
import styles from '../../styles/layout.module.css';

const { Sider } = Layout;

const Sidebar: React.FC<{ setSelectedComponent: (component: string) => void }> = ({ setSelectedComponent }) => {
  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case '1':
        setSelectedComponent('home');
        break;
      case '2':
        setSelectedComponent('companies');
        break;
      case '3':
        setSelectedComponent('companies-checkbox');
        break;
      case '4':
        setSelectedComponent('jobs');
        break;
      case '5':
        setSelectedComponent('articles');
        break;
      case '6':
        setSelectedComponent('about');
        break;
      case '7':
        setSelectedComponent('contact-us');
        break;
      default:
        break;
    }
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0" className={styles.sider}>
      <div className={styles.logoContainer}>
        <img src="/logo.jpg" alt="Logo" className={styles.logo} />
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={handleMenuClick}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          Companies
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
          Companies 2
        </Menu.Item>
        <Menu.Item key="4" icon={<FileOutlined />}>
          Jobs
        </Menu.Item>
        <Menu.Item key="5" icon={<InfoCircleOutlined />}>
          Articles
        </Menu.Item>
        <Menu.Item key="6" icon={<ContactsOutlined />}>
          About
        </Menu.Item>
        <Menu.Item key="7" icon={<ContactsOutlined />}>
          Contact Us
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;