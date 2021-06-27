import { Spinner, Alert } from "react-bootstrap";
import "./LoadingOverlay.css";

const LoadingOverlay = (props) => {
  return (
    <div className="loading d-flex justify-content-center align-items-center ">
      <Alert className="shadow-lg rounded" variant="success">
        <Alert.Heading>{props.title||"We are loading data"}</Alert.Heading>
        <p>Please wait!</p>
        <Spinner animation="border" variant="success" />
      </Alert>
    </div>
  );
};

export default LoadingOverlay;
