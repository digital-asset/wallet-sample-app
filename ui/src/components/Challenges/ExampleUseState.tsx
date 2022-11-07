import React from "react";

const Counter: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const onClick = () => {
    setValue(value + 1);
  };
  return (
    <div>
      <div>
        <h3>counter</h3>
      </div>
      <div>{value}</div>
      <div>
        <button onClick={onClick}>increment</button>
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

export const ExampleUseState: React.FC = () => {
  return (
    <div style={{ border: "1px solid white" }}>
      <div>
        <h1>React.useState Example</h1>
      </div>
      <div>
        <Counter />
        <Checkbox />
      </div>
    </div>
  );
};
