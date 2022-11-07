import React from "react";

// Refactor code, extract the below component into 2 components
// Bonus challenge: pass in isComplete state, if true render text "complete" next to title
// Bonus challenge: extract into 3 components

export const Challenge1: React.FC = () => {
  // api call
  const todos = [
    { title: "Understand components", isComplete: true },
    { title: "Pass in props", isComplete: true },
    { title: "three", isComplete: true },
    { title: "four", isComplete: true },
  ];

  return (
    <div style={{ border: "1px solid white" }}>
      <h2>Challenge 1</h2>
      <h1>To do list</h1>
      {todos.map((todo) => (
        <div>{todo.title}</div>
      ))}
    </div>
  );
};
