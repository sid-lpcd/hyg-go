import "./App.scss";
import Button from "./components/base/Button/Button";
import Dropdown from "./components/base/Dropdown/Dropdown";

function App() {
  const clickHandler = () => {
    console.log("clicked");
  };
  const selectHandler = (option) => {
    console.log("Selected:", option);
  };

  const sortOptions = ["Sort by date", "Sort alphabetically"];
  return (
    <>
      <h1>Hyg-go</h1>
      <p>Testing text</p>
      <Button classProp="test" btnText="Start" clickHandler={clickHandler} />
      <Dropdown options={sortOptions} selectHandler={selectHandler} />
    </>
  );
}

export default App;
