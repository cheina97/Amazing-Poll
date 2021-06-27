import { Form, Row, Col, Container, Badge } from "react-bootstrap";
import PollClosedQuestOption from "../PollClosedQuestOption";

const PollClosedQuest = (props) => {
  const {
    id_quest,
    mode,
    title,
    index,
    options,
    max,
    min,
    setAnswer,
    answers,
  } = props;
  return (
    <div className="mt-5 mb-5">
      <Form.Label>
        {
          <h4 className="p-0">
            {title}
            {min === 0 && (
              <Badge className="ml-3" variant="success">
                Optional
              </Badge>
            )}
          </h4>
        }
      </Form.Label>
      <Container fluid>
        <Row xs={1} sm={1} md={2} lg={3}>
          {options &&
            options.map((value, indexOption) => (
              <Col className="p-0" key={`${index}_${indexOption}_col`}>
                <PollClosedQuestOption
                  id_quest={id_quest}
                  key={`${index}_${indexOption}_opt`}
                  mode={mode}
                  indexOption={indexOption}
                  index={index}
                  value={value}
                  checked={answers.includes(value)}
                  setAnswer={setAnswer}
                />
              </Col>
            ))}
        </Row>
      </Container>
      {mode==='vote' && <i>
        You must check a <b> minimum of {min}</b> answers and a{" "}
        <b>maximum of {max}</b> answers
      </i>}
    </div>
  );
};

export default PollClosedQuest;
