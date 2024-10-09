import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Avatar } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key='profile'>
        <Link to="/profile">Perfil</Link>
      </Menu.Item>
      <Menu.Item key='logout' onClick={handleLogout}>Sair</Menu.Item>
    </Menu>
  );

  return (
    <header className='bg-gradient-to-r from-blue-300 to-blue-800 shadow-lg'>
      <div className='container mx-auto px-6 py-4 flex justify-between items-center'>
        <Link to='/' className='text-2xl font-semibold text-white tracking-wide'>
          Task Manager
        </Link>
        <nav>
          {isAuthenticated ? (
            <div className='flex items-center space-x-6'>
              <Link to='/tasks' className='text-white hover:text-blue-200 transition duration-300'>
                Minhas Tarefas
              </Link>
              <Dropdown overlay={menu} placement='bottomRight'>
                <div className='flex items-center cursor-pointer text-white'>
                  <Avatar icon={<UserOutlined />} />
                  <span className='ml-2 text-gray-700'>{user?.name}</span>
                  <DownOutlined className='ml-1' />
                </div>
              </Dropdown>
            </div>
          ) : (
            <div className='flex items-center space-x-6'>
              <Link to='/login' className='text-white hover:text-blue-200 transition duration-300'>
                Login
              </Link>
              <Link to='/register' className='bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:text-gray-200 transition duration-300'>
                Registrar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar