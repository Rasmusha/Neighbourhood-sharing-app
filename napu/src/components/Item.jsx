const Item = ({ item , toggleImportance}) => {
  const label = item.important
    ? 'make not important' : 'make important'
    return (
      <li>
      {item.content}
      <button onClick={toggleImportance}>{label}</button>
      </li>
      
    )
  }
  
  export default Item