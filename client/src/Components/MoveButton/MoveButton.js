import { Button } from "react-bootstrap";
import { ArrowUp, ArrowDown } from "react-bootstrap-icons";

const MoveButton = (props) => {
  const { moveFunction, direction, position, index } = props;
  return (
    <Button
      className="ml-2"
      variant="outline-secondary"
      size="sm"
      onClick={() => moveFunction(position, direction, index)}
    >
      {direction === "up" ? <ArrowUp size="20px" /> : <ArrowDown size="20px" />}
    </Button>
  );
};

export default MoveButton;
