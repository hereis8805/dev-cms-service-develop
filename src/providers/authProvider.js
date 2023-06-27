const authProvider = {
  // called when the user attempts to log in
  login: ({ email, password }) => {
    const request = new Request(`${process.env.REACT_APP_API_PATH}/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: new Headers({ "Content-Type": "application/json" })
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((auth) => {
        console.log("auth : ", auth);
        localStorage.setItem("userInfo", JSON.stringify(auth));
        // localStorage.setItem("username", email);
      })
      .catch(() => {
        console.log("catch");
        throw new Error("Network error");
      });

    // // accept all username/password combinations
    // return Promise.resolve();
  },
  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem("userInfo");
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("userInfo");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("userInfo") ? Promise.resolve() : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve()
};

export default authProvider;
