import { Button } from "react-bootstrap";

const PollAddQuest = (props) => {
  const { addQuest } = props;
  return (
      <div className="mt-5 d-flex justify-content-center">
          <Button
            onClick={() => addQuest(false)}
            className="m-2 w-25"
            variant="success"
          >
            Add Open Question
          </Button>
          <Button
            onClick={() => addQuest(true)}
            className="m-2 w-25"
            variant="success"
          >
            Add Closed Question
          </Button>
      </div>
  );
};

export default PollAddQuest;
