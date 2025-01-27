import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('Work');
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const todoString = localStorage.getItem('todos');
    if (todoString) {
      const savedTodos = JSON.parse(todoString);
      setTodos(savedTodos);
    }
  }, []);

  const saveToLS = (updatedTodos) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleDelete = (id) => {
    if (confirm('Do you want to delete this?')) {
      const updatedTodos = todos.filter((item) => item.id !== id);
      setTodos(updatedTodos);
      saveToLS(updatedTodos);
    }
  };

  const handleEdit = (id) => {
    const t = todos.find((i) => i.id === id);
    setTodo(t.todo);
    setDescription(t.description);
    setDueDate(t.dueDate);
    setPriority(t.priority);
    setCategory(t.category);
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
    saveToLS(updatedTodos);
  };

  const handleAdd = () => {
    const updatedTodos = [
      ...todos,
      {
        id: uuidv4(),
        todo,
        description,
        dueDate,
        priority,
        category,
        isCompleted: false,
      },
    ];
    setTodos(updatedTodos);
    setTodo('');
    setDescription('');
    setDueDate('');
    setPriority('Low');
    setCategory('Work');
    saveToLS(updatedTodos);
  };

  const handleCheckbox = (id) => {
    const index = todos.findIndex((item) => item.id === id);
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS(newTodos);
  };

  const filteredTodos = todos.filter((item) => {
    if (filter === 'Completed') return item.isCompleted;
    if (filter === 'Pending') return !item.isCompleted;
    if (filter === 'Overdue') {
      const now = new Date();
      const due = new Date(item.dueDate);
      return !item.isCompleted && due < now;
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">TaskManager</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add new Todo</h2>
          <div className="flex flex-col gap-3">
            <input
              onChange={(e) => setTodo(e.target.value)}
              type="text"
              value={todo}
              placeholder="Task title..."
              className="w-full rounded-full px-5 py-1"
            />
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder="Task description..."
              className="w-full rounded-xl px-5 py-2"
            />
            <input
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              value={dueDate}
              className="w-full rounded-full px-5 py-1"
            />
            <select
              onChange={(e) => setPriority(e.target.value)}
              value={priority}
              className="w-full rounded-full px-5 py-1"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full rounded-full px-5 py-1"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
            </select>
            <button
              onClick={handleAdd}
              disabled={todo.length < 1}
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </div>

        <input
          className="my-4"
          id="show"
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />
        <label className="mx-2" htmlFor="show">
          Show Finished
        </label>

        <div className="filters my-4">
          <label className="font-bold mx-2">Filter:</label>
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full px-5 py-1"
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="progress my-5">
          <h3 className="font-bold text-lg">Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-violet-800 h-2.5 rounded-full"
              style={{
                width: `${
    (todos.filter((item) => item.isCompleted).length /
      todos.length) *
    100 || 0
  }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="todos">
          {filteredTodos.length === 0 && <div className="m-5">No Todos to display</div>}

          {filteredTodos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div
                  key={item.id}
                  className={`todo flex my-3 justify-between items-center p-3 rounded-lg shadow-md ${
                    item.isCompleted ? 'bg-green-100' : 'bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-1 text-left">
                    <h4 className="font-bold">{item.todo}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-sm text-gray-500">Due: {item.dueDate}</p>
                    <p className="text-sm text-gray-500">Priority: {item.priority}</p>
                    <p className="text-sm text-gray-500">Category: {item.category}</p>
                  </div>
                  <div className="buttons flex gap-2 items-center">
                    <input
                      name={item.id}
                      onChange={() => handleCheckbox(item.id)}
                      type="checkbox"
                      checked={item.isCompleted}
                      className="h-5 w-5"
                    />
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
