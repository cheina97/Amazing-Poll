import { Navbar, Dropdown, Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import * as Icons from "react-bootstrap-icons";
import { logoutUser } from "../../Api/DeleteApi";
import { useState } from "react";
import LoadingOverlay from "../LoadingOverlay";
import "./MyNav.css";

export default function MyNav(props) {
  const [loggedOut, setLoggedOut] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <>
      {loggedOut && <Redirect exact to="/login" />}
      {loggingOut && <LoadingOverlay title="You are logging out" />}
      <Navbar className="pr-2 " bg="success" variant="dark" fixed="top">
        <Navbar.Toggle
          onClick={() => props.setmenucollapse((x) => !x)}
          aria-controls="menuCollapseId"
          aria-expanded={props.menuCollapse}
        />
        <Navbar.Brand href="" className="mr-auto">
          <Icons.Stack size="1.2em" className="mr-2" />
          Amazing Poll
        </Navbar.Brand>

        {props.userName ? (
          <Dropdown alignRight={true}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <div className="mr-2 d-inline" style={{ color: "#ffffff" }}>
                <span>
                  Welcome <b>{props.userName}</b>{" "}
                </span>
              </div>
              <Icons.PersonCircle className="text-light mr-2" size="1.45em" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-1">
              <Dropdown.Item
                onClick={() => {
                  setLoggingOut(true);
                  logoutUser().then(() => {
                    props.setUserName("");
                    setLoggingOut(false);
                    setLoggedOut(true);
                  });
                }}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Link style={{ textDecoration: "none" }} className="mr-2" to="/login">
            <Button variant="outline-light">Go back</Button>
          </Link>
        )}
      </Navbar>
    </>
  );
}
