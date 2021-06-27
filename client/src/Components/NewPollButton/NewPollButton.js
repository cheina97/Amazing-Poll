import { Button } from "react-bootstrap";
import "./NewPollButton.css";
import { Plus } from "react-bootstrap-icons";


function NewPollButton(props) {
  return (
    <Button
      className="btn-newpoll-position btn btn-success rounded-circle"
      style={{ width: "50px", height: "50px", font: "2em sans-serif" }}
      onClick={() => {
        props.setShowModal(true)
      }}
    >
      <Plus size="25px" className="iconnewpoll" />
    </Button>
  );
}

export default NewPollButton;