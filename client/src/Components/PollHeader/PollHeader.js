import { Form } from "react-bootstrap";
const PollHeader = (props) => {
  const { mode, username, setUsername, title, setTitle } = props;

  return (
    <Form.Group controlId="pollTitle">
      <Form.Label>{mode === "create" ? "Poll Title" : "Username"}</Form.Label>
      <Form.Control
        type="text"
        required
        readOnly={mode === "results"}
        placeholder={
          mode === "create"
            ? "Insert a title for this poll"
            : "Insert your Username for this poll"
        }
        value={mode === "create" ? title : username}
        onChange={
          mode === "create"
            ? (event) => setTitle(event.target.value)
            : (event) => setUsername(event.target.value)
        }
      />
    </Form.Group>
  );
};

export default PollHeader;
