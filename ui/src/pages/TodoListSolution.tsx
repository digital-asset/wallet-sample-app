import React from "react";

interface TodoItemProps {
  title: string;
}

const TodoItem: React.FC<TodoItemProps> = (props) => {
  const { title } = props;
  return <div>{title}</div>;
};

export const TodoListSolution: React.FC = () => {
  const [todoTitle, setTitle] = React.useState("");
  const [list, setList] = React.useState<string[]>([]);

  const onChange = (e) => {
    setTitle(e.target.value);
  };
  const onAdd = () => {
    setList([...list, todoTitle]);
    setTitle("");
  };
  return (
    <div>
      <h3>Todo List</h3>
      <div>
        <input onChange={onChange} value={todoTitle} />
        <button onClick={onAdd}>Add</button>
      </div>
      <div>
        {list.map((item) => (
          <TodoItem title={item} />
        ))}
      </div>
    </div>
  );
};
