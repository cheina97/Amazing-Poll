import { Form, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import { createPoll, createSubscription, sendAnswer } from "../../Api/PostApi";
import ErrorAlert from "../ErrorAlert";

const PollForm = (props) => {
  const {
    idPoll,
    mode,
    setPoll,
    poll,
    answers,
    setShowModal,
    setReloadPollList,
    setAnswers,
    setNewUsername,
    newUsername,
  } = props;
  const [validated, setValidated] = useState(false);
  const [errorApi, setErrorApi] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      setErrorApi({
        message: "All fields have to be filled",
        details: "Please fill the fields surrounded by a red border",
        hideReloadMessage: true,
      });
    } else {
      if (mode === "create") {
        if (!poll.questions || !poll.questions.length) {
          setErrorApi({
            message: "Cannot send a poll without questions",
            details: "Please add some questions with the buttons above",
            hideReloadMessage: true,
          });
        } else {
          const wrongQuestions = [];
          for (const q of poll.questions) {
            if (
              q.closed &&
              q.options.length !==
                q.options.filter((v, i) => q.options.indexOf(v) === i).length
            )
              wrongQuestions.push(`${q.name} (position:${q.position}) `);
          }
          if (wrongQuestions.length !== 0) {
            setErrorApi({
              message: `Cannot insert repeated options in closed questions`,
              details: `Errors in questions ${wrongQuestions.toString()}. Please remove duplicated options`,
              hideReloadMessage: true,
            });
          } else {
            setLoading(true);
            createPoll(poll)
              .then(() => {
                setPoll("");
                setReloadPollList(true);
                setShowModal(false);
                setErrorApi("");
                setNewUsername("");
                setLoading(false);
              })
              .catch((err) => {
                setLoading(false);
                setErrorApi(err);
              });
          }
        }
      } else if (mode === "vote") {
        const wrongQuestions = [];
        for (const answer of answers) {
          const question = poll.questions.find((q) => q.id === answer.id_quest);
          if (
            question.max < answer.values.length ||
            question.min > answer.values.length
          ) {
            wrongQuestions.push(
              `${question.name} (position:${question.position}) `
            );
          }
        }
        if (wrongQuestions.length !== 0) {
          setErrorApi({
            message: `Closed answers must respect the maximum and minimum value`,
            details: `Errors in questions ${wrongQuestions.toString()}. Please select the correct number of answers`,
            hideReloadMessage: true,
          });
        } else {
          setLoading(true);
          createSubscription(idPoll, newUsername)
            .then((s) => {
              sendAnswer(parseInt(s.submissionId), answers)
                .then((x) => {
                  setAnswers(
                    poll.questions.map((q) => {
                      return { id_quest: q.id, values: [] };
                    })
                  );
                  setNewUsername("");
                  setShowModal(false);
                  setErrorApi("");
                  setReloadPollList(true);
                  setLoading(false);
                })
                .catch((err) => {
                  setLoading(false);
                  setErrorApi(err);
                });
            })
            .catch((err) => {
              setLoading(false);
              setErrorApi(err);
            });
        }
      }
    }
  };
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      {props.children}

      {!!errorApi && (
        <div className="mt-3">
          <ErrorAlert errors={errorApi} />
        </div>
      )}
      {mode !== "results" && (
        <div className="d-flex justify-content-center">
          <Button
            disabled={loading}
            className="m-2"
            variant="success"
            type="submit"
          >
            {mode === "create" ? "Create Poll" : "Send Answers"}
            {loading && (
              <Spinner
                className="ml-2"
                size="sm"
                animation="border"
                as="span"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default PollForm;
