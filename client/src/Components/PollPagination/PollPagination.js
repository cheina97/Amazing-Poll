import { Pagination } from "react-bootstrap";
import "./PollPagination.css";

const setItem = (num, max, pos) => {
  if (num <= 1) return pos + 1;
  if (num >= max - 2) return max - ((max > 5 ? 5 : max) - pos) + 1;
  return num + (pos - 2) + 1;
};

const PollPagination = (props) => {
  const { currentUserNum, setCurrentUserNum, maxUserNum } = props;

  return (
    <>
      {!!maxUserNum && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First onClick={() => setCurrentUserNum(0)} />
          <Pagination.Prev
            disabled={currentUserNum === 0}
            onClick={() => setCurrentUserNum((x) => x - 1)}
          />
          {maxUserNum > 0 && (
            <Pagination.Item
              onClick={(event) =>
                event.target.text &&
                setCurrentUserNum(parseInt(event.target.text) - 1)
              }
              active={currentUserNum === 0}
            >
              {setItem(currentUserNum, maxUserNum, 0)}
            </Pagination.Item>
          )}
          {maxUserNum > 1 && (
            <Pagination.Item
              onClick={(event) =>
                event.target.text &&
                setCurrentUserNum(parseInt(event.target.text) - 1)
              }
              active={currentUserNum === 1}
            >
              {setItem(currentUserNum, maxUserNum, 1)}
            </Pagination.Item>
          )}
          {maxUserNum > 2 && (
            <Pagination.Item
              onClick={(event) =>
                event.target.text &&
                setCurrentUserNum(parseInt(event.target.text) - 1)
              }
              active={
                (maxUserNum >= 5 &&
                  currentUserNum > 1 &&
                  currentUserNum <= maxUserNum - 3) ||
                (currentUserNum === 2 && (maxUserNum === 3 || maxUserNum === 4))
              }
            >
              {setItem(currentUserNum, maxUserNum, 2)}
            </Pagination.Item>
          )}
          {maxUserNum > 3 && (
            <Pagination.Item
              onClick={(event) =>
                event.target.text &&
                setCurrentUserNum(parseInt(event.target.text) - 1)
              }
              active={
                (maxUserNum >= 5 && currentUserNum === maxUserNum - 2) ||
                (currentUserNum === 3 && maxUserNum === 4)
              }
            >
              {setItem(currentUserNum, maxUserNum, 3)}
            </Pagination.Item>
          )}
          {maxUserNum > 4 && (
            <Pagination.Item
              onClick={(event) =>
                event.target.text &&
                setCurrentUserNum(parseInt(event.target.text) - 1)
              }
              active={currentUserNum === maxUserNum - 1}
            >
              {setItem(currentUserNum, maxUserNum, 4)}
            </Pagination.Item>
          )}
          <Pagination.Next
            disabled={currentUserNum === maxUserNum - 1}
            onClick={() => setCurrentUserNum((x) => x + 1)}
          />
          <Pagination.Last onClick={() => setCurrentUserNum(maxUserNum - 1)} />
        </Pagination>
      )}
    </>
  );
};

export default PollPagination;
