import { Form, Badge } from "react-bootstrap";

const PollOpenQuest = (props) => {
  const {
    mode,
    title,
    id_quest,
    optional,
    position,
    setAnswer,
    answer,
  } = props;
  return (
    <div className="mt-5">
      <Form.Group controlId={"pollOpenQuestAnswer" + position}>
        <Form.Label>
          <h4>
            {title}
            {optional && (
              <Badge className="ml-3" variant="success">
                Optional
              </Badge>
            )}
          </h4>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          required={!optional && mode === "vote"}
          readOnly={mode !== "vote"}
          maxLength={200}
          placeholder={mode==="results"?"":"Insert your answer (max 200 chars)"}
          value={!answer?"":answer}
          onChange={(event) => setAnswer(id_quest, event.target.value, false)}
        />
      </Form.Group>
    </div>
  );
};

export default PollOpenQuest;
