import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";
import { getQuestions } from "../../Api/GetApi";
import ErrorAlert from "../ErrorAlert";
import PollPagination from "../PollPagination";
import PollHeader from "../PollHeader";
import PollForm from "../PollForm";
import PollAddQuest from "../PollAddQuest";
import PollOpenQuest from "../PollOpenQuest";
import PollClosedQuest from "../PollClosedQuest";
import PollOpenQuestCreate from "../PollOpenQuestCreate";
import PollClosedQuestCreate from "../PollClosedQuestCreate";
import Loading from "../Loading";

const PollModal = (props) => {
  const {
    idPoll,
    title,
    mode,
    showModal,
    setShowModal,
    answers,
    setAnswers,
    setReloadAnswers,
    loadPoll,
    setLoadPoll,
    externalErrorApi,
    setReloadPollList,
    setLoading,
    loading,
  } = props;

  const [poll, setPoll] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentUserNum, setCurrentUserNum] = useState(0);
  const [errorApi, setErrorApi] = useState("");

  useEffect(() => {
    if (mode !== "create" && !poll && loadPoll) {
      setLoading(true);
      getQuestions(idPoll)
        .then((x) => {
          setPoll({ name: title, questions: [...x] });
          if (mode === "vote") {
            setAnswers(
              x.map((q) => {
                return { id_quest: q.id, values: [] };
              })
            );
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setErrorApi(err);
        });
      setLoadPoll(false);
    }
  }, [
    loadPoll,
    idPoll,
    title,
    mode,
    poll,
    setLoadPoll,
    setAnswers,
    setLoading,
  ]);

  const addQuest = (closed) => {
    setPoll((old) => {
      return {
        ...old,
        questions: old.questions
          ? [
              ...old.questions,
              {
                name: "",
                closed: closed,
                min: closed ? 0 : 1,
                max: 1,
                position:
                  old.questions && old.questions.length
                    ? Math.max(...old.questions.map((q) => q.position)) + 1
                    : 0,
                options: closed ? [""] : [],
              },
            ]
          : [
              {
                name: "",
                closed: closed,
                min: closed ? 0 : 1,
                max: 1,
                position:
                  old.questions && old.questions.length
                    ? Math.max(...old.questions.map((q) => q.position)) + 1
                    : 0,
                options: closed ? [""] : [],
              },
            ],
      };
    });
  };

  const addQuestOption = (index) => {
    setPoll((old) => {
      if (old.questions[index].options.length < 10) {
        return {
          ...old,
          questions: old.questions.map((q, i) => {
            return index === i ? { ...q, options: [...q.options, ""] } : q;
          }),
        };
      } else {
        return old;
      }
    });
  };

  const deleteQuestOption = (index, indexOption) => {
    setPoll((old) => {
      if (
        old.questions[index].options.length > 1 &&
        old.questions[index].max < old.questions[index].options.length &&
        old.questions[index].min + 1 < old.questions[index].options.length
      ) {
        return {
          ...old,
          questions: old.questions.map((q, i) => {
            return i === index
              ? { ...q, options: q.options.filter((o, i) => i !== indexOption) }
              : q;
          }),
        };
      } else {
        return old;
      }
    });
  };

  const setQuestOption = (index, indexOption, value) => {
    setPoll((old) => {
      return {
        ...old,
        questions: old.questions.map((q, iq) => {
          return index === iq
            ? {
                ...q,
                options: q.options.map((o, i) =>
                  i === indexOption ? value : o
                ),
              }
            : q;
        }),
      };
    });
  };

  const deleteQuest = (index) => {
    setPoll((old) => {
      return {
        ...old,
        questions: [...old.questions.filter((q, i) => i !== index)],
      };
    });
  };

  const moveQuest = (position, direction, index) => {
    setPoll((old) => {
      if (
        (direction === "up" && index > 0) ||
        (direction === "down" && index < old.questions.length - 1)
      ) {
        return {
          ...old,
          questions: [
            ...old.questions.map((q, i) => {
              if (i === index) {
                return {
                  ...q,
                  position:
                    direction === "up"
                      ? old.questions[index - 1].position
                      : old.questions[index + 1].position,
                };
              } else if (i === index - 1 && direction === "up") {
                return {
                  ...q,
                  position: position,
                };
              } else if (i === index + 1 && direction === "down") {
                return {
                  ...q,
                  position: position,
                };
              } else {
                return q;
              }
            }),
          ].sort((a, b) => a.position - b.position),
        };
      } else {
        return old;
      }
    });
  };

  const setTitle = (title) => {
    setPoll((p) => {
      return { name: title, questions: p.questions };
    });
  };

  const setAnswer = (id, value, closed) => {
    if (answers.map((a) => a.id_quest).includes(id)) {
      setAnswers((old) =>
        old.map((a) =>
          a.id_quest === id
            ? {
                id_quest: id,
                values: closed
                  ? a.values.includes(value)
                    ? a.values.filter((v) => v !== value)
                    : [...a.values, value]
                  : value === ""
                  ? []
                  : [value],
              }
            : a
        )
      );
    } else {
      setAnswers((old) => [...old, { id_quest: id, values: [value] }]);
    }
  };

  const setTitleQuest = (index, title) => {
    setPoll((old) => {
      return {
        ...old,
        questions: [
          ...old.questions.map((q, i) =>
            index === i ? { ...q, name: title } : q
          ),
        ],
      };
    });
  };

  const setMinQuest = (index, minString, closed) => {
    const min = parseInt(minString);
    setPoll((old) => {
      if (
        (min >= 0 &&
          min < old.questions[index].options.length &&
          min <= old.questions[index].max) ||
        !closed
      ) {
        return {
          ...old,
          questions: [
            ...old.questions.map((q, i) =>
              i === index ? { ...q, min: min } : q
            ),
          ],
        };
      } else {
        return old;
      }
    });
  };

  const setMaxQuest = (index, maxString) => {
    const max = parseInt(maxString);
    setPoll((old) => {
      if (
        max > 0 &&
        max <= old.questions[index].options.length &&
        max >= old.questions[index].min
      ) {
        return {
          ...old,
          questions: [
            ...old.questions.map((q, i) =>
              index === i ? { ...q, max: max } : q
            ),
          ],
        };
      } else {
        return old;
      }
    });
  };
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="xl"
      centered
      contentClassName="px-4 py-1"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "create" ? "Create a new Poll" : title}
          {mode === "results" && (
            <Button
              onClick={() => setReloadAnswers(true)}
              className="ml-3"
              variant="success"
              size="sm"
            >
              Reload results <ArrowRepeat className="ml-1" size="16px" />
            </Button>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!errorApi && !externalErrorApi && !loading ? (
          (mode !== "results" || answers.length !== 0) && (
            <PollForm
              idPoll={idPoll}
              mode={mode}
              setPoll={setPoll}
              poll={poll}
              answers={answers}
              setShowModal={setShowModal}
              setReloadPollList={setReloadPollList}
              setAnswers={setAnswers}
              setNewUsername={setNewUsername}
              newUsername={newUsername}
            >
              <PollHeader
                mode={mode}
                title={poll.name || ""}
                setTitle={setTitle}
                username={
                  (answers &&
                    answers[currentUserNum] &&
                    answers[currentUserNum].user) ||
                  newUsername
                }
                setUsername={setNewUsername}
              />

              {poll &&
                poll.questions &&
                poll.questions.map((q, index) =>
                  mode === "create" ? (
                    q.closed ? (
                      <PollClosedQuestCreate
                        position={q.position}
                        key={`closed_${index}`}
                        title={q.name}
                        setTitle={setTitleQuest}
                        moveQuest={moveQuest}
                        deleteQuest={deleteQuest}
                        options={q.options}
                        addQuestOption={addQuestOption}
                        deleteQuestOption={deleteQuestOption}
                        setQuestOption={setQuestOption}
                        max={q.max}
                        min={q.min}
                        setMaxQuest={setMaxQuest}
                        setMinQuest={setMinQuest}
                        index={index}
                      />
                    ) : (
                      <PollOpenQuestCreate
                        key={`open_${index}`}
                        title={q.name}
                        setTitle={setTitleQuest}
                        optional={q.min === 0}
                        setMinQuest={setMinQuest}
                        position={q.position}
                        deleteQuest={deleteQuest}
                        moveQuest={moveQuest}
                        index={index}
                      />
                    )
                  ) : mode === "vote" || mode === "results" ? (
                    q.closed ? (
                      <PollClosedQuest
                        key={`closed_${index}`}
                        id_quest={q.id}
                        mode={mode}
                        title={q.name}
                        index={index}
                        options={q.options}
                        max={q.max}
                        min={q.min}
                        setAnswer={setAnswer}
                        answers={
                          mode === "results"
                            ? answers &&
                              answers.length &&
                              answers[currentUserNum] &&
                              answers[currentUserNum].questions &&
                              answers[currentUserNum].questions.find(
                                (a) => a.id_quest === q.id
                              )
                              ? answers[currentUserNum].questions.find(
                                  (a) => a.id_quest === q.id
                                ).values
                              : []
                            : answers &&
                              answers.length &&
                              answers.find((a) => a.id_quest === q.id)
                            ? answers.find((a) => a.id_quest === q.id).values
                            : []
                        }
                      />
                    ) : (
                      <PollOpenQuest
                        key={`open_${index}`}
                        mode={mode}
                        title={q.name}
                        id_quest={q.id}
                        optional={q.min === 0}
                        position={q.position}
                        setAnswer={setAnswer}
                        answer={
                          mode === "results"
                            ? answers &&
                              answers.length &&
                              answers[currentUserNum] &&
                              answers[currentUserNum].questions &&
                              answers[currentUserNum].questions.find(
                                (a) => a.id_quest === q.id
                              )
                              ? answers[currentUserNum].questions.find(
                                  (a) => a.id_quest === q.id
                                ).values[0]
                              : ""
                            : answers &&
                              answers.length &&
                              answers.find((a) => a.id_quest === q.id)
                            ? answers.find((a) => a.id_quest === q.id).values[0]
                            : ""
                        }
                      />
                    )
                  ) : null
                )}

              {mode === "create" && <PollAddQuest addQuest={addQuest} />}

              {mode === "results" && (
                <PollPagination
                  currentUserNum={currentUserNum}
                  setCurrentUserNum={setCurrentUserNum}
                  maxUserNum={answers.length}
                />
              )}
            </PollForm>
          )
        ) : !loading ? (
          <div className="mt-3">
            <ErrorAlert errors={errorApi || externalErrorApi} />
          </div>
        ) : (
          <Loading />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PollModal;
