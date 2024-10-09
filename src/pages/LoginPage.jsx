import React, { useState, useContext } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/auth';

const LoginPage = () => {
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setError(null);
    const { email, password } = values;
    console.log(email, password);
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        console.log(data);
        login(data.token);
        navigate('/tasks');
      }
      else {
        return setError(data.message);
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className='flex justify-center items-center bg-gradient-to-r from-blue-300 to-blue-800 min-h-screen p-6'>
      <div className='bg-white rounded-lg shadow-lg w-full p-8 max-w-md'>
        <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Login</h2>
        {error && <Alert message={error} type='error' showIcon className='mb-3'/>}
        <Form onFinish={onFinish} layout='vetical'>
          <Form.Item
            label='Email'
            name='email'
            rules={[{
              required: true,
              message: 'Por favor, insira seu email'
            },
            {
              type: 'email',
              message: 'Por favor, insira um email válido'
            }
            ]}
          >
            <Input prefix={<UserOutlined className='text-gray-400'/>} placeholder='Seu email'/>
          </Form.Item>
          <Form.Item
            label='Senha'
            name='password'
            rules={[{ required: true, message: 'Por favor, insira sua senha' }]}
          >
            <Input.Password prefix={<LockOutlined className='text-gray-400'/>} placeholder='Sua senha'/>
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300'
            >
              Entrar
            </Button>
            <div className='text-center mt-4'>
              <span>ou <Link to='/register' className='text-blue-600 hover:underline'>criar conta</Link></span>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;