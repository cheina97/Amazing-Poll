import { Spinner, Alert } from "react-bootstrap";

const LoadingOverlay = (props) => {
  return (
    <Alert  variant="success">
      <div >
          <div className="d-flex justify-content-center">
            <Alert.Heading>{props.title || "We are loading data"}</Alert.Heading>
          </div>
          <div className="d-flex justify-content-center">
            <p>Please wait!</p>
          </div>
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="success" />
          </div>
      </div>
    </Alert>
  );
};

export default LoadingOverlay;
