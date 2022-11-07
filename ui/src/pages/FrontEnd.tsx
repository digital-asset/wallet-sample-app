import React from "react";
import { Challenge1 } from "../components/Challenges/Challenge1";
import { Challenge1Solution } from "../components/Challenges/Challenge1Solution";
import { ComponentExample } from "../components/Challenges/ComponentExample";
import { ExampleUseState } from "../components/Challenges/ExampleUseState";

export const FrontEnd: React.FC = () => {
  return (
    <div style={{ margin: 8 }}>
      <div>
        <h1>Front end Syllabus</h1>
      </div>
      <div>
        This is a primer to help you get started with React and the Daml/React
        library. We will go over some key concepts of React so that you can
        build upon that knowledge and create more complex applications later on.
        Performance and more complex React patterns are for self study.
      </div>
      <div>
        <ComponentExample/>
        <Challenge1/>
        <Challenge1Solution/>
        <ExampleUseState/>
      </div>
    </div>
  );
};
