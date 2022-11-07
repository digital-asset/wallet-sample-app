import React from 'react';

// Extract the below component into 2 components
// Bonus challenge: extract into 3 components
interface TodoProps {
  title: string;
}
const Todo: React.FC<TodoProps> = (props) => {
  return (
    <div>
      {props.title}
    </div>
  )
}

export const Challenge1: React.FC = () => {
  // api call
  const todos = [{title:'Understand components', isComplete: true}, {title:'Pass in props', isComplete: true},{title:'three', isComplete: true},{title:'four', isComplete: true}]
  
  return (
    <div style={{border: '1px solid white'}}>
      <h2>Challenge 1: Components</h2>

      <h1>To do list</h1>
      {todos.map((todo) => <Todo title={todo.title}/>)}
    </div>
  )
}