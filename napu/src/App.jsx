import { useState, useEffect } from 'react'
import Item from './components/Item'
import itemService from './services/items'
import NavBar from './components/NavBar'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState(    'a new item'  )
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  

  useEffect(() => {
    itemService
      .getAll()
      .then(initialItems  => {
        setItems(initialItems)
      })
  }, [])

  useEffect(() => {    
    const loggedUserJSON = window.localStorage.getItem('loggedItemappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      itemService.setToken(user.token)    
    }  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {      
      const user = await loginService.login({        
        username, password,      
      })
      window.localStorage.setItem(        
        'loggedItemappUser', JSON.stringify(user)      
      ) 
      itemService.setToken(user.token)      
      setUser(user)      
      setUsername('')      
      setPassword('')   
     } catch (exception) {      
      setErrorMessage('wrong credentials')      
      setTimeout(() => {        
        setErrorMessage(null)      
      }, 5000)    
    }  
  }

  const addItem = (event) => {
    event.preventDefault()
    const itemObject = {
      content: newItem,
      important: Math.random() > 0.5,
      id: String(items.length + 1),
    }
  
    itemService    
    .create(itemObject)   
    .then(returnedItem => {
      setItems(items.concat(returnedItem))      
      setNewItem('')  
    })
  }

  const deleteItem = (id) => {
    itemService    
    .deleteItem(id)   
    .then(() => {
      setItems(items.filter(item => item.id != id )) 
    })
  }

  const itemsToShow = showAll
    ? items
    : items.filter(item => item.important)

 
  const handleItemChange = (event) => {
    console.log(event.target.value)
    setNewItem(event.target.value)
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const noteForm = () => (
    <form onSubmit={addItem}>
      <input
        value={newItem}
        onChange={handleItemChange}
      />
      <button type="submit">save</button>
    </form>  
  )
  

  const toggleImportanceOf = id => {
    const item = items.find(n => n.id === id)
    const changedItem = { ...item, important: !item.important }
  
    itemService
    .update(id, changedItem)
    .then(returnedItem => {
      setItems(items.map(item => item.id !== id ? item : returnedItem))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${item.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
  }

  

  return (
    <div>
      <NavBar />
      <div>        
        <button onClick={() => setShowAll(!showAll)}>          
          show {showAll ? 'important' : 'all' }        
        </button>    
      </div>  
      <h2>Login</h2>   
      <Notification message={errorMessage} />   
      {!user && loginForm()} 
      {user && <div>
       <p>{user.name} logged in</p>
         {noteForm()}
      </div>
    }
      <ul>
        {itemsToShow.map(item => 
          <Item key={item.id} item={item} toggleImportance={() => toggleImportanceOf(item.id)}
          deleteItem={() => deleteItem(item.id)}
          />
        )}
      </ul>
      <form onSubmit={addItem}>
        <input value={newItem} 
        onChange={handleItemChange}/>       
        <button type="submit">save</button>
      </form>   
    </div>
  )
}

export default App