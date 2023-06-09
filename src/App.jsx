import React, { useState, useEffect } from "react";

// Firebase & databases
import { app, database } from "./firebaseConfig";
import { ref, onValue, remove } from "firebase/database";

// Components
import {
  FoodList,
  List,
  Popup,
  ToDoList,
  ToDoListForm,
  UpcomingTrips,
} from "./components";

//Functions
import hooks from "./hooks";

// Assests - images
import { images } from "./constants";

// stylesheets
import "./App.scss";

function App() {
  const [listItems, setListItems] = useState([]);
  const [foodList, setFoodList] = useState([]);
  const [destination, setDestination] = useState([]);

  const [toDoListFormData, setToDoListFormData] = useState({
    thingsToDo: "",
  });
  const [foodListFormData, setFoodListFormData] = useState({
    foodList: "",
  });
  const [destinationFormData, setDestinationFormData] = useState({
    place: ""
  });
  const [toDoListMsg, setToDoListMsg] = useState("");
  const [foodListMsg, setFoodListMsg] = useState("");

  const toDoListInDB = ref(database, "thingsToDo");
  const foodListInDB = ref(database, "foodList");

  const { clearListItems, destinationForm, removeItem } = hooks();

  useEffect(() => {
    onValue(toDoListInDB, function (snapshot) {
      if (snapshot.exists()) {
        let listArray = Object.entries(snapshot.val());
        clearListItems(setListItems);
        setToDoListMsg("");
        setListItems(listArray);
      } else {
        clearListItems(setListItems);
        setToDoListMsg("Nothing here yet...!");
      }
    });
  }, []);

  return (
    <div className="App">
      <h1 className="app__header">{destination} Trip Planner</h1>
      <img src={images.logo} />
      <Popup
        destinationFormData={destinationFormData}
        setDestinationFormData={setDestinationFormData}
        setDestination={setDestination}
        destinationForm={destinationForm}
      />
      <div className="app_list-wrapper">
        {/* <UpcomingTrips /> */}
        <div className="app_list-container">
          <ToDoList
            listItems={listItems}
            setListItems={setListItems}
            toDoListFormData={toDoListFormData}
            setToDoListFormData={setToDoListFormData}
            db={database}
            dbName={"thingsToDo"}
            dbRef={toDoListInDB}
            removeItem={removeItem}
            toDoListMsg={toDoListMsg}
            setToDoListMsg={setToDoListMsg}
          />
        </div>
        <div className="app_list-container">
          <FoodList
            clearListItems={clearListItems}
            listItems={foodList}
            setListItems={setFoodList}
            foodListFormData={foodListFormData}
            setFoodListFormData={setFoodListFormData}
            db={database}
            dbName={"foodList"}
            dbRef={foodListInDB}
            removeItem={removeItem}
            foodListMsg={foodListMsg}
            setFoodListMsg={setFoodListMsg}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
