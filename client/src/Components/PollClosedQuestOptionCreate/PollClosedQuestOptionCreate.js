import { Form } from "react-bootstrap";
import DeleteButton from "../DeleteButton";

const PollClosedQuestOption = (props) => {
  const {
    indexOption,
    index,
    value,
    deleteQuestOption,
    setQuestOption,
    enableTooltip,
  } = props;
  return (
    <Form.Group
      controlId={`pollOpenQuestOptionalCreate ${index}_${indexOption}`}
    >
      <div
        className={
          indexOption % 3 === 0
            ? "d-flex mr-lg-3"
            : indexOption % 3 === 1
            ? "d-flex ml-lg-2 mr-lg-2"
            : "d-flex ml-lg-3"
        }
      >
        <Form.Control
          type="text"
          required
          placeholder="Insert option text"
          value={value}
          onChange={(event) =>
            setQuestOption(index, indexOption, event.target.value)
          }
        />

        <DeleteButton
          deleteFunction={() => deleteQuestOption(index, indexOption)}
          enableTooltip={enableTooltip}
          messageTooltip="Cannot delete an option when Max value or Min value + 1 are equal to the total number of options"
          index={index}
          indexOption={indexOption}
        />
      </div>
    </Form.Group>
  );
};

export default PollClosedQuestOption;
