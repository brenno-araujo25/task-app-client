import React, { useState, useEffect, useContext } from 'react';
import { Button, Input, Select, Card, Modal, message, Popconfirm, Menu, Dropdown } from 'antd';
import { PlusOutlined, DeleteOutlined, EllipsisOutlined, LoadingOutlined } from '@ant-design/icons';
import { getTasks, createTask, updateTask, deleteTask as deleteTaskService } from '../services/tasks';
import { AuthContext } from '../context/AuthContext';

const { Option } = Select;
const { TextArea } = Input;

// nova abordagem
const TaskBoard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState({
    pending: [],
    in_progress: [],
    completed: [],
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [loading, setLoading] = useState(false);



  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(organizeTasksByStatus(data));
    } catch (error) {
      message.error('Erro ao carregar tarefas');
      console.error('Erro ao carregar tarefas: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Organize tasks by status
  const organizeTasksByStatus = (tasks) => {
    const organized = {
      pending: [],
      in_progress: [],
      completed: [],
    };

    tasks.forEach((task) => {
      if (task.status === 'pending') {
        organized.pending.push(task);
      } else if (task.status === 'in progress') {
        organized.in_progress.push(task);
      } else if (task.status === 'completed') {
        organized.completed.push(task);
      }
    });

    return organized;
  };

  // Create new task
  const handleCreateTask = async () => {
    const { title, description, status } = newTask;
    console.log('newtask', newTask);
    if (!title) {
      message.error('Título é obrigatório');
      return;
    }
    let noDescription = null;
    if (!description) {
      noDescription = ' ';
    }

    try {
      const createdTask = await createTask(title, noDescription || description, status);
      console.log('createdTask', createdTask);
      let taskStatus;
      if (status === 'in progress') {
        taskStatus = 'in_progress';
        createdTask.status = 'in_progress';
      } else {
        taskStatus = status;
      }
      console.log('taskStatus', taskStatus);
      setTasks(prevTasks => ({
        ...prevTasks,
        [taskStatus]: [...prevTasks[taskStatus], createdTask],
      }));
      message.success('Tarefa criada com sucesso');
      setIsModalVisible(false);
      setNewTask({ title: '', description: '', status: 'pending' });
      fetchTasks();
    } catch (error) {
      message.error('Erro ao criar tarefa');
      console.error('Erro ao criar tarefa: ', error);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId, status) => {
    try {
      await deleteTaskService(taskId);

      if (status === 'in progress') {
        status = 'in_progress';
      }
      setTasks(prevTasks => ({
        ...prevTasks,
        [status]: prevTasks[status].filter(task => task.id !== taskId),
      }));
      message.success('Tarefa deletada com sucesso');
    } catch (error) { 
      message.error('Erro ao deletar tarefa');
      console.error('Erro ao deletar tarefa: ', error);
    }
  };

  const updateTaskStatus = async (task, newStatus) => {
    try {
      console.log('task', task);
      // Update task status on the server
      const updatedTask = await updateTask(task.id, undefined, undefined, newStatus);
      console.log('updatedTask', updatedTask);

      // Update tasks state locally
      setTasks((prevTasks) => {
        let taskStatus;
        if (task.status === 'in progress')
          taskStatus = 'in_progress';
        else
          taskStatus = task.status;

        let newTaskStatus;
        if (newStatus === 'in progress')
          newTaskStatus = 'in_progress';
        else
          newTaskStatus = newStatus;

        const updatedCurrent = prevTasks[taskStatus].filter((t) => t.id !== task.id);
        const updatedNew = [...prevTasks[newTaskStatus], { ...task, status: newTaskStatus }];
        return {
          ...prevTasks,
          [taskStatus]: updatedCurrent,
          [newTaskStatus]: updatedNew,
        }
      });

      message.success('Tarefa atualizada com sucesso');
    } catch (error) {
      message.error('Erro ao atualizar tarefa');
    }
  };

  const createMenu = (task) => {
    let { status } = task;
    if (status === 'in_progress') status = 'in progress';
    const statuses = ['pending', 'in progress', 'completed'].filter((s) => s !== status);
    
    const menu = (
      <Menu 
        onClick={({ key }) => updateTaskStatus(task, key)}
        items={statuses.map((s) => {
          let label = '';
          if (s === 'pending') label = 'Pendentes';
          else if (s === 'in progress') label = 'Em Progresso';
          else if (s === 'completed') label = 'Concluídas';
          return {
            key: s,
            label: `Mover para ${label}`,
          }
        })}
      />
    );
    return menu;
  };

  const renderTasks = (tasks, status) => {
    return tasks.map(task => (
      <Card key={task.id} className='mb-2 bg-blue-100 border-blue-300 shadow-sm'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold'>{task.title}</h3>
          <div className='flex justify-center items-center'>
            <Popconfirm
              title='Deseja realmente excluir esta tarefa?'
              onConfirm={() => handleDeleteTask(task.id, status)}
              okText='Sim'
              cancelText='Não'
            >
              <Button type='text' danger icon={<DeleteOutlined />} />
            </Popconfirm>
            <Dropdown overlay={createMenu(task)}>
              <Button type='text' icon={<EllipsisOutlined />} />
            </Dropdown>
          </div>
        </div>
        <p className='text-gray-500 text-balance'>{task.description}</p>
      </Card>
    ));
  };

  return (
    <div className='p-10 pt-5 bg-gradient-to-r from-blue-300 to-blue-800 min-h-screen md:p-10'>
      {/* Título e botão para criar nova tarefa */}
      <div className='flex justify-between items-center mb-8 md:flex-row md:mb-8'>
        <h2 className='text-3xl font-bold text-white'></h2>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          size='large'
          className='md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition duration-300 shadow-sm hover:shadow-md'
        >
          Nova tarefa
        </Button>
      </div>

      {/* Modal para criação de nova tarefa */}
      <Modal
        title='Nova tarefa'
        open={isModalVisible}
        onOk={handleCreateTask}
        onCancel={() => setIsModalVisible(false)}
        okText='Criar'
        cancelText='Cancelar'
        className='rounded-lg'
      >
        <Input 
          placeholder='Título'
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          className='mb-4 rounded-lg border-gray-300'
        />
        <TextArea
          placeholder='Descrição'
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          className='mb-4 rounded-lg border-gray-300'
          rows={4}
        />
        <Select
          value={newTask.status}
          onChange={value => setNewTask({ ...newTask, status: value })}
          className='w-full rounded-lg border-gray-300'
        >
          <Option value='pending'>Pendentes</Option>
          <Option value='in progress'>Em Progresso</Option>
          <Option value='completed'>Concluídas</Option>
        </Select>
      </Modal>

      {/* Exibir loading */}
      {loading ? (
        <div className='flex flex-col justify-center items-center h-64 text-2xl'>
          <p>Carregando suas tarefas...</p>
          <LoadingOutlined/> 
        </div>
      ) : (
        <div className='flex flex-wrap md:space-x-8 space-y-4 md:space-y-0 justify-center'>
          {/* Colunas de Pendentes */}
          <div className='w-full md:w-80 bg-white p-4 rounded-lg shadow-md'>
            <h3 className='text-xl font-semibold mb-4 text-blue-600'>Pendentes</h3>
            {tasks.pending.length > 0 ? (
              renderTasks(tasks.pending, 'pending')
            ) : (
              <p className='text-gray-500 text-center'>Nenhuma tarefa pendente</p>
            )}
          </div>
            
          {/* Colunas de Em Progresso */}
          <div className='w-full md:w-80 bg-white p-4 rounded-lg shadow-md'>
            <h3 className='text-xl font-semibold mb-4 text-blue-600'>Em Progresso</h3>
            {tasks.in_progress.length > 0 ? (
              renderTasks(tasks.in_progress, 'in progress')
            ) : (
              <p className='text-gray-500 text-center'>Nenhuma tarefa em progresso</p>
            )}
          </div>

          {/* Colunas de Concluídas */}
          <div className='w-full md:w-80 bg-white p-4 rounded-lg shadow-md'>
            <h3 className='text-xl font-semibold mb-4 text-blue-600'>Concluídas</h3>
            {tasks.completed.length > 0 ? (
              renderTasks(tasks.completed, 'completed')
            ) : (
              <p className='text-gray-500 text-center'>Nenhuma tarefa concluída</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;