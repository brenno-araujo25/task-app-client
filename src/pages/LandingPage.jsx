import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const LandingPage = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-800 p-4'>
            <h1 className='font-extrabold text-5xl mb-4 text-white drop-shadow-lg'>Bem vindo(a) ao Task Manager</h1>
            <p className='text-lg mb-8 text-gray-100'>Gerencie suas tarefas de forma simples e eficiente</p>
            <div className='flex flex-row space-x-4'>
                <Link to='/login'>
                    <Button
                        type='primary'
                        size='large'
                        className='shadow-sm hover:shadow-md transition duration-300'
                    >
                        Login
                    </Button>
                </Link>
                <Link to='/register'>
                    <Button 
                        size='large' 
                        className='border-2 border-white text-blue-700 hover:bg-blue-100 hover:text-blue-700 transition shadow-sm hover:shadow-md duration-300'
                    >
                        Registrar
                    </Button>
                </Link>
            </div>
            <footer className='absolute bottom-0 right-0 left-0 p-4 text-center text-gray-200'>
            <p>© {new Date().getFullYear()} Task Manager. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default LandingPage;