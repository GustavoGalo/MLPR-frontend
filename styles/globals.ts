import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #FEFEFE;
    opacity: 1;

    font: 1rem Roboto, sans-serif;
    color: #707070;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }
`;

export default GlobalStyle;