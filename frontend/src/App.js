import React, { useState } from 'react';
import './App.css';
import { Layout } from 'antd';
import ContactList from './ContactList';
import ContactForm from './ContactForm';

const { Header, Content } = Layout;

function App() {
  const [selectedContact, setSelectedContact] = useState({});
  const [refresh, setRefresh] = useState(false);

  const handleFormSuccess = () => {
    setSelectedContact({});
    setRefresh(!refresh);
  };

  return (
    <Layout>
      <Header>
        <h1 style={{ color: 'white' }}>Address Book</h1>
      </Header>
      <Content style={{ padding: '50px' }}>
        <ContactForm contact={selectedContact} onSuccess={handleFormSuccess} />
        <ContactList
          onSelectContact={setSelectedContact}
          key={refresh}
        />
      </Content>
    </Layout>
  );
}

export default App;
