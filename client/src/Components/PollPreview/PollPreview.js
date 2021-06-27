import { Card, Button, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import PollModal from "../PollModal";
import { getAnswers } from "../../Api/GetApi";
import ErrorAlert from "../ErrorAlert";

const PollPreview = (props) => {
  const { id, mode, title, setReloadPollList } = props;

  const [showModal, setShowModal] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [errorApi, setErrorApi] = useState("");
  const [reloadAnswers, setReloadAnswers] = useState(true);
  const [loadPoll, setLoadPoll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "results" && reloadAnswers) {
      setLoading(true);
      getAnswers(id)
        .then((a) => {
          setAnswers(a);
          setErrorApi("");
          setLoading(false);
        })
        .catch((err) => {
          setErrorApi(err);
          setLoading(false);
        });
    }
    setReloadAnswers(false);
  }, [mode, id, reloadAnswers]);

  return (
    <>
      <Card className="text-center m-3 ">
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          {mode === "results" && (
            <Card.Text className={"mb-2 " + (mode === "results" && "ml-2")}>
              {!errorApi
                ? `Answers: ${answers.length}`
                : errorApi && <ErrorAlert errors={errorApi} />}
            </Card.Text>
          )}
          <div className="d-flex justify-content-center">
            <Button
              className="mt-2 w-50"
              block
              disabled={!answers.length && mode === "results"}
              variant="success"
              onClick={() => {
                setLoadPoll(true);
                if (mode === "results") setReloadAnswers(true);
                setShowModal(true);
              }}
            >
              {mode === "results" ? "Show results" : "Vote"}
            </Button>
          </div>

          {mode === "results" && (
            <div className="d-flex justify-content-center">
              <Button
                onClick={() => setReloadAnswers(true)}
                className="mt-2 w-50"
                variant="success"
                disabled={loading}
                block
              >
                Reload results
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
        </Card.Body>
      </Card>
      <PollModal
        idPoll={id}
        title={title}
        mode={mode}
        showModal={showModal}
        setShowModal={setShowModal}
        answers={answers}
        setAnswers={setAnswers}
        setReloadAnswers={setReloadAnswers}
        loadPoll={loadPoll}
        setLoadPoll={setLoadPoll}
        externalErrorApi={errorApi}
        setReloadPollList={setReloadPollList}
        setLoading={setLoading}
        loading={loading}
      />
    </>
  );
};

export default PollPreview;
