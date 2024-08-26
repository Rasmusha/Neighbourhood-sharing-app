import { useState, useEffect } from 'react'
import Item from './components/Item'
import itemService from './services/items'
import NavBar from './components/NavBar'

const App = () => {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState(    'a new item'  )
  const [showAll, setShowAll] = useState(true)
  

  useEffect(() => {
    itemService
      .getAll()
      .then(initialItems  => {
        setItems(initialItems)
      })
  }, [])

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

  const itemsToShow = showAll
    ? items
    : items.filter(item => item.important)

 
  const handleItemChange = (event) => {
    console.log(event.target.value)
    setNewItem(event.target.value)
  }

  const toggleImportanceOf = id => {
    const item = items.find(n => n.id === id)
    const changedItem = { ...item, important: !item.important }
  
    itemService
    .update(id, changedItem)
    .then(returnedItem => {
      setItems(items.map(item => item.id !== id ? item : returnedItem))
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
      <ul>
        {itemsToShow.map(item => 
          <Item key={item.id} item={item} toggleImportance={() => toggleImportanceOf(item.id)}/>
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