import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [updatedItemText, setUpdatedItemText] = useState('');
  const [todos, setTodos] = useState([])
  const [isUpdating, setIsUpdating] = useState('')

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/item', { item: itemText })
      setTodos(prev => [...prev, res.data])
      setItemText('')

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items')
        setTodos(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getItemsList();

  }, [])

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`)
      const filteredTodos = todos.filter(todo => todo._id !== id)
      setTodos(filteredTodos)

    } catch (err) {
      console.log(err)
    }

  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, { item: updatedItemText })

      const updatedItemIndex = todos.findIndex(todo => todo._id === isUpdating)
      const updatedItem = todos[updatedItemIndex].item = updatedItemText
      setUpdatedItemText('');
      setIsUpdating('');

    } catch (err) {
      console.log(err)
    }
  }

  const renderUpdateForm = () => {
    return (
      <form className='update-form' onSubmit={handleUpdate}>
        <input className="update-new-input" type="text" placeholder='New Item' onChange={e => setUpdatedItemText(e.target.value)} value={updatedItemText} />
        <button className="update-new-btn" type='submit'>Update</button>
      </form>
    )

  }

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder='Add Todo Item' onChange={e => { setItemText(e.target.value) }} value={itemText} />
        <button type="submit">ADD</button>
      </form>
      <div className="todo-listItems">
        {
          todos.map(todo => {
            return (
              <div className="todo-item">
                {isUpdating === todo._id ? renderUpdateForm() :
                  <>
                    <p className="item-content">{todo.item}</p>
                    <button className="update-item" onClick={() => { setIsUpdating(todo._id) }}>Update</button>
                    <button className="delete-item" onClick={() => handleDelete(todo._id)}>Delete</button>
                  </>
                }

              </div>
            )

          })
        }
      </div>
    </div>
  );
}

export default App;
