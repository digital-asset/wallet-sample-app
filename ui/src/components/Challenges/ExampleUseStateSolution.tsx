import React from "react";

const Counter: React.FC = () => {
  const [value, setValue] = React.useState<number>(0);
  const onInc = () => {
    setValue(value + 1);
  };
  const onDec = () => {
    setValue(value-1);
  }
  const onReset = () => {
    setValue(0)
  }
  return (
    <div>
      <div>
        <h3>counter</h3>
      </div>
      <div>{value}</div>
      <div>
        <button onClick={onInc}>increment</button>
        <button onClick={onDec}>Decrement</button>
        <button onClick={onReset}>Reset</button>
      </div>
    </div>
  );
};

const Checkbox: React.FC = () => {
  const [value, setCheckbox] = React.useState<boolean>(false);
  const onClick = () => {
    setCheckbox(!value);
  };
  return (
    <div>
      <div>
        <h3>checkbox</h3>
      </div>
      <div>
        <input onClick={onClick} checked={value} type="checkbox" />
      </div>
      <div>
        <button onClick={onClick}>check</button>
      </div>
    </div>
  );
};

const Form = () => {
  const [value, setValue] = React.useState<string>('');
  
  const onChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div>
      <h3>Form Value</h3>
      <p>{value}</p>
      <input onChange={onChange} value={value}/>
    </div>
  )
}

const List = () => {
  const [list, setList] = React.useState<number[]>([])
  const onClick = () => {
    setList([...list, list.length+1])
  }
  return (
    <div>
      <h3>list</h3>
      <button onClick={onClick}>Add</button>
      {list.map((item) => <div>{item}</div>)}
      </div>
  )
}

export const ExampleUseStateSolution: React.FC = () => {
  return (
    <div style={{ border: "1px solid white" }}>
      <div>
        <h1>React.useState Example: Solutions</h1>
      </div>
      <div>
        <Counter />
        <Checkbox />
        <Form/>
        <List/>
      </div>
    </div>
  );
};
