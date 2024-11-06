import "./App.scss";
import Button from "./components/base/Button/Button";

function App() {
  const clickHandler = () => {
    console.log("clicked");
  };
  return (
    <>
      <h1>Hyg-go</h1>
      <p>Testing text</p>
      <Button classProp="test" btnText="Start" clickHandler={clickHandler} />
    </>
  );
}

export default App;
