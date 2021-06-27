const getPolls = () => {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3000/api/polls', {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            const error = new Error(`${res.status}: ${res.statusText}`);
            error.response = res;
            throw error;
          }
          resolve(res.json());
        })
        .catch((err) => {
          if (err.response && err.response.headers) {
            if (err.response.headers.get("Content-Type") === "application/json") {
              err.response
                .json()
                .then((x) =>
                  reject({ message: err.message, details: JSON.stringify(x) })
                );
            } else {
              err.response
                .text()
                .then((x) => reject({ message: err.message, details: x }));
            }
          } else {
            reject({ message: err.message });
          }
        });
    });
  }

const getQuestions = (pollId) => {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3000/api/polls/${pollId}/questions`, {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            const error = new Error(`${res.status}: ${res.statusText}`);
            error.response = res;
            throw error;
          }
          resolve(res.json());
        })
        .catch((err) => {
          if (err.response && err.response.headers) {
            if (err.response.headers.get("Content-Type") === "application/json") {
              err.response
                .json()
                .then((x) =>
                  reject({ message: err.message, details: JSON.stringify(x) })
                );
            } else {
              err.response
                .text()
                .then((x) => reject({ message: err.message, details: x }));
            }
          } else {
            reject({ message: err.message });
          }
        });
    });
  }

const getAnswers = (pollId) => {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:3000/api/polls/${pollId}/answers`, {
        method: "GET",
      })
        .then((res) => {
          if (!res.ok) {
            const error = new Error(`${res.status}: ${res.statusText}`);
            error.response = res;
            throw error;
          }
          resolve(res.json());
        })
        .catch((err) => {
          if (err.response && err.response.headers) {
            if (err.response.headers.get("Content-Type") === "application/json") {
              err.response
                .json()
                .then((x) =>
                  reject({ message: err.message, details: JSON.stringify(x) })
                );
            } else {
              err.response
                .text()
                .then((x) => reject({ message: err.message, details: x }));
            }
          } else {
            reject({ message: err.message });
          }
        });
    });
  }

  export  {getPolls, getQuestions, getAnswers}