import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";

const DeleteButton = (props) => {
  const { deleteFunction, enableTooltip, messageTooltip, index, indexOption } =
    props;
  return (
    <>
      {enableTooltip ? (
        <OverlayTrigger
          overlay={
            <Tooltip id={`tooltip-delete-${index}-${indexOption}`}>
              {messageTooltip}
            </Tooltip>
          }
        >
          <Button
            className="ml-2"
            variant="outline-danger"
            size="sm"
            onClick={() => deleteFunction()}
          >
            <TrashFill size="20px" />
          </Button>
        </OverlayTrigger>
      ) : (
        <Button
          className="ml-2"
          variant="outline-danger"
          size="sm"
          onClick={() => deleteFunction()}
        >
          <TrashFill size="20px" />
        </Button>
      )}
    </>
  );
};
export default DeleteButton;
