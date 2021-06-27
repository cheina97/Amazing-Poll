import "bootstrap/dist/css/bootstrap.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { useState } from "react";
import LoginForm from "./Components/LoginForm";
import "./App.css";
import Main from "./Components/Main";

function App() {
  const [userName, setUserName] = useState("");

  return (
    <Router>
      {/* {userName?<Redirect to="/All" />:<Redirect to="/login" />} */}
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route
          exact
          path="/login"
          render={() => <LoginForm setUserName={setUserName} />}
        />
        <Route
          exact
          path="/main"
          render={() => <Main userName={userName} setUserName={setUserName}/>}
        />
      </Switch>
    </Router>
  );
}

export default App;
