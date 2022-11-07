import React from "react";

export const ComponentExample: React.FC = () => {
  // additional logic
  return (
    <div>
      <h1>Heading 1</h1>
      <p>Body goes here</p>
    </div>
  );
};

export const WrapperExample: React.FC = (props) => {
  return (
    <div style={{borderRadius: '8px', border: '1px solid white', margin: '4px'}}>
      {props.children}
    </div>
  )
}

// Below is extracted version

// interface TitleProps {
//   title: string;
// }

// const Title: React.FC<TitleProps> = (props) => {
//   return (
//     <div>
//       <h1>{props.title}</h1>
//     </div>
//   );
// };

// const Body: React.FC = () => {
//   return (
//     <div>body text</div>
//   )
// }

// const ExtractedExample: React.FC = () => {
//   return (
//     <div>
//       <Title title='Head 1'/>
//       <Body/>
//     </div>
//   )
// }