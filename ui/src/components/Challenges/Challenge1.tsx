import React from 'react';

// Extract the below component into 2 components
// Bonus challenge: extract into 3 components

export const Challenge1: React.FC = () => {
  // api call
  const todos = [{title:'one', isComplete: true}, {title:'two', isComplete: true},{title:'three', isComplete: true},{title:'four', isComplete: true}]
  
  return (
    <div style={{border: '1px solid white'}}>
      <h1>To do list</h1>
      {todos.map((todo) => <div>{todo.title}</div>)}
    </div>
  )
}