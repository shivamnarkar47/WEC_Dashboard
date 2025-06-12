import * as React from "react";

interface AboutProps {
  propName: string;
}

const About: React.FC<AboutProps> = ({ propName }: AboutProps) => {
  return <div>Hello {propName}</div>;
};

export default About;
