import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const ContactForm = ({ contact, onSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(contact);
  }, [contact, form]);

  const handleSubmit = async (values) => {
    try {
      if (contact._id) {
        const response = await axios.put(`/api/contacts/${contact._id}`, values);
        message.success('Contact updated successfully.');
        onSuccess(response.data);
      } else {
        const response = await axios.post('/api/contacts', values);
        message.success('Contact added successfully.');
        form.resetFields()
        onSuccess(response.data);
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls outside the range of 2xx
        message.error(error.response.data.message);
      } else {
        // Something happened in setting up the request that triggered an Error
        message.error('Error processing the request. Please try again.');
      }
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input the contact name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: 'Please input the contact phone!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {contact._id ? 'Update' : 'Add'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ContactForm;
