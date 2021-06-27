import {
  Form,
  Row,
  Col,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import DeleteButton from "../DeleteButton";
import MoveButton from "../MoveButton";
import AddButton from "../AddButton";
import PollClosedQuestOptionCreate from "../PollClosedQuestOptionCreate";

const PollClosedQuest = (props) => {
  const {
    position,
    title,
    setTitle,
    moveQuest,
    deleteQuest,
    options,
    addQuestOption,
    deleteQuestOption,
    setQuestOption,
    max,
    min,
    setMaxQuest,
    setMinQuest,
    index,
  } = props;
  return (
    <div className="mt-5">
      <Form.Group controlId={"pollOpenQuestTitleCreate" + position}>
        <Form.Label>Closed Question</Form.Label>
        <div className="d-flex">
          <Form.Control
            type="text"
            required
            placeholder="Insert question title"
            value={title}
            onChange={(event) => setTitle(index, event.target.value)}
          />
          <AddButton
            disabled={options.length >= 10}
            alternativeMessage={
              options.length >= 10 && "Cannot add more than 10 options"
            }
            addFunction={() => addQuestOption(index)}
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
      <Container fluid>
        <Row xs={1} sm={1} lg={3}>
          {options &&
            options.map((value, indexOption) => (
              <Col className="p-0" key={`${index}_${indexOption}_colCreate`}>
                <PollClosedQuestOptionCreate
                  key={`${index}_${indexOption}_opt`}
                  indexOption={indexOption}
                  index={index}
                  value={value}
                  deleteQuestOption={deleteQuestOption}
                  setQuestOption={setQuestOption}
                  enableTooltip={
                    options.length <= max || options.length <= min + 1
                  }
                />
              </Col>
            ))}
        </Row>
        <Row>
          <Col xs={12} sm={6} lg={3} className="px-0 pl-sm-0 pr-sm-2">
            <Form.Label>Max. answers required</Form.Label>

            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id={`tooltip-max-${position}`}>
                  {
                    "max. must be greater than 0, greater/equal than min. and smaller/equal than options number"
                  }
                </Tooltip>
              }
            >
              <Form.Control
                type="number"
                required
                value={max}
                onChange={(event) => setMaxQuest(index, event.target.value)}
              />
            </OverlayTrigger>
          </Col>
          <Col xs={12} sm={6} lg={3} className="px-0 pr-sm-0 pl-sm-2">
            <Form.Label>Min. answers required</Form.Label>
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id={`tooltip-min-${position}`}>
                  {
                    "min. must be greater/equal than 0, smaller/equal than max. and smaller than options number"
                  }
                </Tooltip>
              }
            >
              <Form.Control
                type="number"
                required
                value={min}
                onChange={(event) =>
                  setMinQuest(index, event.target.value, true)
                }
              />
            </OverlayTrigger>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PollClosedQuest;
