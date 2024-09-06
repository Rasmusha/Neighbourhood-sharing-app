const Item = ({ item , toggleImportance, deleteItem}) => {
  const label = item.important
    ? 'make not important' : 'make important'
    return (
      <li>
      {item.content}
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={deleteItem}>Delete</button>
      </li>
      
    )
  }
  
  export default Item