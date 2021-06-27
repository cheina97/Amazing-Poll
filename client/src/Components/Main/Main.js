import MyNav from "../MyNav";
import { useState, useEffect } from "react";
import { getPolls } from "../../Api/GetApi";
import PollPreview from "../PollPreview";
import { Col, Row, Container } from "react-bootstrap";
import RefreshButton from "../RefreshButton";
import NewPollButton from "../NewPollButton";
import PollModal from "../PollModal";
import ErrorAlert from "../ErrorAlert";
import LoadingOverlay from "../LoadingOverlay";

const Main = (props) => {
  const [reloadPollList, setReloadPollList] = useState(true);
  const [polls, setPolls] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorApi, setErrorApi] = useState("");
  const [loadingPolls, setLoadingPolls] = useState(true);

  useEffect(() => {
    if (reloadPollList === true) {
      setLoadingPolls(true);
      getPolls()
        .then((x) => {
          setPolls(x);
          setErrorApi("");
          setLoadingPolls(false);
        })
        .catch((err) => {
          setLoadingPolls(false);
          setErrorApi(err);
        });
      setReloadPollList(false);
    }
  }, [reloadPollList]);

  return (
    <>
      {loadingPolls && <LoadingOverlay />}
      <MyNav userName={props.userName} setUserName={props.setUserName} />
      <div className="mainpage">
        <Container
          fluid
          className="pb-5 "
          style={{ marginTop: "75px", marginLeft: "0px", marginRight: "0px" }}
        >
          <Row xs={1} sm={1} md={3}>
            {polls &&
              polls.map((poll) => (
                <Col key={poll.id}>
                  <PollPreview
                    key={poll.id}
                    title={poll.name}
                    id={poll.id}
                    mode={props.userName ? "results" : "vote"}
                    setReloadPollList={setReloadPollList}
                  />
                </Col>
              ))}
          </Row>
          {errorApi && <ErrorAlert errors={errorApi} />}
        </Container>
      </div>
      <RefreshButton setReloadPollList={setReloadPollList} />
      {props.userName && <NewPollButton setShowModal={setShowModal} />}
      {props.userName && (
        <PollModal
          mode={"create"}
          showModal={showModal}
          setShowModal={setShowModal}
          setReloadPollList={setReloadPollList}
        />
      )}
    </>
  );
};

export default Main;
