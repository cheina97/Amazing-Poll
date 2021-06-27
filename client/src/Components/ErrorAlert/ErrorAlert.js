import { Alert, Collapse } from "react-bootstrap";
import { useState } from "react";

function ErrorAlert(props) {
  const { message, details, hideReloadMessage } = props.errors;
  const [collapse, setcollapse] = useState(false);
  return (
    <div>
      <Alert variant="danger">
        <Alert.Heading>
          {message}
        </Alert.Heading>
        {!hideReloadMessage && <p>Please, reload or try again later.</p>}
        {details ? (
          <div>
            <hr />
            <div onClick={() => setcollapse((x) => !x)}>
              <Alert.Link href="#">
                {`Expand info ${collapse ? "\u25bc" : "\u25c4"}`}{" "}
              </Alert.Link>
            </div>
            <Collapse in={collapse}>
              <p className="mb-0">{details}</p>
            </Collapse>
          </div>
        ) : null}
      </Alert>
    </div>
  );
}

export default ErrorAlert;
