import { Form } from "react-bootstrap";
import DeleteButton from "../DeleteButton";
import MoveButton from "../MoveButton";

const PollOpenQuest = (props) => {
  const {
    title,
    setTitle,
    optional,
    setMinQuest,
    position,
    deleteQuest,
    moveQuest,
    index,
  } = props;
  return (
    <div className="mt-5">
      <Form.Group controlId={"pollOpenQuestTitleCreate" + position}>
        <Form.Label>Open Question</Form.Label>
        <div className="d-flex">
          <Form.Control
            type="text"
            required
            placeholder="Insert question title"
            value={title}
            onChange={(event) => setTitle(index, event.target.value)}
          />
          <MoveButton
            moveFunction={moveQuest}
            position={position}
            index={index}
            direction="down"
          />
          <MoveButton
            moveFunction={moveQuest}
            position={position}
            index={index}
            direction="up"
          />
          <DeleteButton deleteFunction={() => deleteQuest(index)} />
        </div>
      </Form.Group>
      <Form.Group controlId={"pollOpenQuestAnswerCreate" + position}>
        <Form.Control
          as="textarea"
          rows={2}
          required={false}
          readOnly={true}
          placeholder={"Text field preview"}
        />
      </Form.Group>
      <Form.Group controlId={"pollOpenQuestOptionalCreate" + position}>
        <Form.Check
          custom
          checked={optional}
          onChange={() => setMinQuest(index, optional ? 1 : 0, false)}
          type="checkbox"
          id={"optionalCreate" + position}
          label="Optional"
        />
      </Form.Group>
    </div>
  );
};

export default PollOpenQuest;
