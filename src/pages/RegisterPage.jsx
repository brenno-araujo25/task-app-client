import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { UserOutlined, LockOutlined, MessageOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

const RegisterPage = () => {
  const [error, setError] = useState(null);
  const [sucess, setSucess] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setError(null);
    const { name, email, password } = values;
    try {
      const data = await register(name, email, password);

      if (data.user) {
        setSucess('Cadastro realizado com sucesso. Redirecionando para o login.');
        navigate('/login');
      } else {
        setError('Erro ao realizar o cadastro. Email já cadastrado.');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-800 p-6'>
      <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Registrar</h2>
        {error && <Alert message={error} type='error' showIcon className='mb-4' />}
        {sucess && <Alert message={sucess} type='success' showIcon className='mb-4' />}
        <Form layout='vertical' onFinish={onFinish}>
          <FormItem
            label='Nome'
            name='name'
            rules={[
              {
                required: true,
                message: 'Por favor, insira seu nome' 
              }
            ]}
          >
            <Input prefix={<UserOutlined className='text-gray-400'/>} placeholder='Seu nome'/>
          </FormItem>
          <FormItem
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
            <Input prefix={<MessageOutlined className='text-gray-400'/>} placeholder='Seu email'/>
          </FormItem>
          <FormItem
            label='Senha'
            name='password'
            rules={[
              { 
                required: true, message: 'Por favor, insira sua senha'
              },
              {
                min: 6, message: 'A senha deve ter no mínimo 6 caracteres'
              }
            ]}
          >
            <Input.Password prefix={<LockOutlined className='text-gray-400'/>} placeholder='Sua senha'/>
          </FormItem>
          <FormItem>
            <Button 
              type='primary'
              htmlType='submit' 
              block
              className='bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300'
            >
              Registrar
            </Button>
          </FormItem>
          <FormItem className='text-center mb-0'>
            <span className='text-gray-600'>Já tem uma conta? </span>
            <Link to='/login' className='text-blue-600 hover:underline'>Faça Login</Link>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage