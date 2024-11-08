import "./MainPage.scss";
import Header from "../../components/sections/Header/Header";
import Button from "../../components/base/Button/Button";
import Dropdown from "../../components/base/Dropdown/Dropdown";
import InputText from "../../components/base/InputText/InputText";

export const MainPage = () => {
  const clickHandler = () => {
    console.log("clicked");
  };
  const selectHandler = (option) => {
    console.log("Selected:", option);
  };

  const sortOptions = ["Sort by date", "Sort alphabetically"];

  return (
    <>
      <Header />
      <h1>Hyg-go</h1>
      <p>Testing text</p>
      <Button classProp="test" btnText="Start" clickHandler={clickHandler} />
      <Dropdown options={sortOptions} selectHandler={selectHandler} />
      <InputText
        isAutocomplete={true}
        options={["Option1", "Option2", "Option3"]}
        placeholder="Search..."
      />
      <InputText isAutocomplete={false} placeholder="Search..." />
    </>
  );
};
