import { Button } from "react-bootstrap";
import "./RefreshButton.css";
import { ArrowRepeat } from "react-bootstrap-icons";


function RefreshButton(props) {
  return (
    <Button
      className="btn-refresh-position btn btn-success rounded-circle"
      style={{ width: "50px", height: "50px", font: "2em sans-serif" }}
      onClick={() => {
        props.setReloadPollList(true)
      }}
    >
      <ArrowRepeat size="25px" className="iconrefresh" />
    </Button>
  );
}

export default RefreshButton;