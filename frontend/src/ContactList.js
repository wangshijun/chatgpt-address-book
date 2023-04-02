import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal } from 'antd';
import axios from 'axios';

const ContactList = ({ onSelectContact }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await axios.get('/api/contacts');
    setContacts(response.data);
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this contact?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/contacts/${id}`);
    fetchContacts();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onSelectContact(record)}>Edit</Button>
          <Button onClick={() => showDeleteConfirm(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return <Table dataSource={contacts} columns={columns} rowKey="_id" />;
};

export default ContactList;
