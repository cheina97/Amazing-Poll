const logoutUser = () => {
    return new Promise((resolve, reject) => {
        fetch(`/api/sessions/current`, {
                method: "DELETE",
            })
            .then((res) => {
                if (!res.ok) {
                    const error = new Error(`${res.status}: ${res.statusText}`);
                    error.response = res;
                    throw error;
                }
                resolve(res.status);
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
};


export { logoutUser };