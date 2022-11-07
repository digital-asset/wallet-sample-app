import React from "react";

export const ComponentExample: React.FC = () => {
  return (
    <div>
      <h1>Heading 1</h1>
      <p>Body goes here</p>
    </div>
  );
};

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