import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

const AddButton = (props) => {
  const { addFunction, id, alternativeMessage } = props;
  return (
    <OverlayTrigger
      defaultShow={true}
      overlay={
        <Tooltip id={`tooltip-${id}`}>
          {alternativeMessage || "Click here to add a new option"}
        </Tooltip>
      }
    >
      <Button
        className="ml-2"
        variant="outline-success"
        size="sm"
        onClick={() => addFunction()}
      >
        <Plus size="20px" />
      </Button>
    </OverlayTrigger>
  );
};

export default AddButton;
