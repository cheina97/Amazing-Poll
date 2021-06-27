import "./LoginForm.css";
import icon from "./icon.png";
import { Button, Form, Spinner } from "react-bootstrap";
import { useState } from "react";
import { loginUser } from "../../Api/PostApi.js";
import { logoutUser } from "../../Api/DeleteApi";
import ErrorAlert from "../ErrorAlert";
import { Redirect } from "react-router-dom";

const LoginForm = (props) => {
  const [validated, setValidated] = useState(false);
  const [mail, setmail] = useState("");
  const [password, setpassword] = useState("");
  const [errorDetected, setErrorDetected] = useState(false);
  const [goToMain, setGoToMain] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("");

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    setLoading(true);
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      loginUser(mail, password)
        .then((user) => {
          props.setUserName(user.name);
          setGoToMain(true);
        })
        .catch((err) => {
          setErrorDetected(err);
          setLoading(false);
        });
    }
    setValidated(true);
  };

  const goToVote = () =>
    logoutUser()
      .then(() => {
        setLoading(false);
        setGoToMain(true);
      })
      .catch((err) => {
        setLoading(false);
        setErrorDetected(err);
      });

  return (
    <>
      {goToMain && <Redirect exact to="/main" />}
      <div className="text-center main">
        <Form
          noValidate
          className="form-signin"
          validated={validated}
          onSubmit={handleSubmit}
        >
          <img className="mb-4" src={icon} alt="" width="100" height="100" />
          <h1 className="h3 mb-3 font-weight-normal">
            {mode ? "Please sign in" : "I'm here for"}
          </h1>

          {mode ? (
            <>
              <Form.Group>
                <Form.Control
                  onChange={(x) => setmail(x.target.value)}
                  value={mail}
                  required
                  type="email"
                  placeholder="Email address"
                  id="email"
                />
                <Form.Control
                  onChange={(x) => setpassword(x.target.value)}
                  value={password}
                  required
                  type="password"
                  placeholder="Password"
                  id="password"
                />
                <Form.Control.Feedback type="invalid">
                  Insert your account mail address and the password
                </Form.Control.Feedback>
              </Form.Group>
              {errorDetected ? <ErrorAlert errors={errorDetected} /> : null}
              <Button
                size="lg"
                variant="success"
                block={true}
                type="submit"
                disabled={loading}
              >
                Sign in
                {loading && (
                  <Spinner
                    className="ml-2 mb-1"
                    size="sm"
                    animation="border"
                    as="span"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Button>
              <div
                className="mt-4"
                style={{ cursor: "pointer" }}
                onClick={() => setMode("")}
              >
                Go back
              </div>
            </>
          ) : (
            <>
              <Button
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  goToVote();
                }}
                size="lg"
                variant="success"
                className="mb-2"
                block={true}
              >
                Vote a poll
                {loading && (
                  <Spinner
                    className="ml-2 mb-1"
                    size="sm"
                    animation="border"
                    as="span"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Button>
              <Button
                onClick={() => setMode("create")}
                size="lg"
                variant="success"
                block={true}
                type="submit"
              >
                Create a poll
              </Button>
            </>
          )}

          <p className="mt-4 mb-3 text-muted">
            &copy; Francesco Cheinasso 2021
          </p>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;
