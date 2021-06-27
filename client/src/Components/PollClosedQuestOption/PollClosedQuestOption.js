import { Form } from "react-bootstrap";

const PollClosedQuestOption = (props) => {
  const {
    id_quest,
    mode,
    indexOption,
    index,
    value,
    checked,
    setAnswer,
  } = props;
  return (
    <Form.Group controlId={`pollOpenQuestOptional ${index}_${indexOption}`}>
      <div>
        <Form.Check
          custom
          disabled={mode !== "vote"}
          checked={checked}
          onChange={() => setAnswer(id_quest, value, true)}
          type="checkbox"
          id={`optional ${index}_${indexOption}`}
          label={value}
        />
      </div>
    </Form.Group>
  );
};

export default PollClosedQuestOption;
