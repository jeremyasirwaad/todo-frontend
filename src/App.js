import { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  

  useEffect(() => {
    GetTodos();
  }, [])

  const GetTodos = () => {
    fetch('https://api-todo-jeremy.herokuapp.com/todos')
        .then(response => response.json())
        .then((data) => {
          setTodos(data);
        })
        .catch(err => console.log(err));
  }

  const completetodo = async id => {
      const data = await fetch('https://api-todo-jeremy.herokuapp.com/todo/complete/' + id)
        .then(res => res.json())      

      setTodos(todos => todos.map(todo => {
        if (todo._id === data._id) {
          todo.complete = data.complete 
        }

        return todo;
      }))
      
  }


  const deletetodo = async id => {
    await fetch('https://api-todo-jeremy.herokuapp.com/todo/delete/' + id, {method: "DELETE"})
    .then(res => res.json());

    GetTodos();
  }


  const additem = async() => {
    const additemtodb = await fetch("https://api-todo-jeremy.herokuapp.com/todo/new",{method : "POST", headers: { "content-Type" : "Application/json" }, body: JSON.stringify({text: newTodo}) })
    .then(res => res.json())

    setTodos((previoustodo) => [...previoustodo,additemtodb]);
  }


  return (
    <div className="App">
      <div className="appcontainer">
          <h1>These Are Your Tasks</h1>
          <h3>Tasks</h3>
          {popupActive ? (
                <div className={"addtodo" + (popupActive ? " addtodo-active" : "")}>
                    <h3>Add Task</h3>
                    <input type="text" value = {newTodo} onChange = {(e)=>{setNewTodo(e.target.value); console.log(newTodo);}} />
                    <button onClick = {() => {additem()}} placeholder = "Enter Task">submit</button>
                 </div>
              ) : ""}
          <div className = {"todocontainer" + (popupActive ? " todocontainer-active" : "")}>
            {todos.map((items)=>(
              <div className="todo" key = {items._id} onClick = {() => {completetodo(items._id)}} >
                <div className={"checkbox" + (items.complete ? " dotcol" : "")}></div>
                <div className={"text" + (items.complete ? " completedtext" : "")}>{items.text}</div>
                <div className="deletetodo" onClick = {()=> {deletetodo(items._id)}}>x</div>
              </div>
            ))}
              </div>
              <div className="addbutton" onClick = {()=>{setPopupActive(!popupActive)}}>+</div>
          </div>
      </div>
  );
}

export default App;
