const url = "http://ride-my-way-api.herokuapp.com/api/v1/";
const username = document.getElementById("username");
const login = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordVerification = document.getElementById("password-verification");
const notifyTitle = notify.querySelector("#notify-title");
const notifyBody = notify.querySelector("#notify-body");

const checkToken = () => {
  const token = window.sessionStorage.getItem("token");
  if (token) {
    window.sessionStorage.setItem("status", "already");
    window.location = "profile.html";
  }
};
const notifyX = () => {
  if (classie.hasClass(notify, "alert-error"))
    classie.remove(notify, "alert-error");
  if (classie.hasClass(notify, "alert-success"))
    classie.remove(notify, "alert-success");
  notifyTitle.innerHTML = "";
  notifyBody.innerHTML = "";
  classie.remove(notify, "visible");
};
const callError = (element, message) => {
  if (classie.hasClass(notify, "alert-error"))
    classie.remove(notify, "alert-error");
  if (classie.hasClass(notify, "alert-success"))
    classie.remove(notify, "alert-success");
  classie.add(notify, "alert-error");
  notifyTitle.innerHTML = `Error at ${element}`;
  notifyBody.innerHTML = message;
  classie.add(notify, "visible");
  setTimeout(() => {notifyX()}, 3000);
};

const callSuccess = message => {
  if (classie.hasClass(notify, "alert-error"))
    classie.remove(notify, "alert-error");
  if (classie.hasClass(notify, "alert-success"))
    classie.remove(notify, "alert-success");
  classie.add(notify, "alert-success");
  notifyTitle.innerHTML = "Message";
  notifyBody.innerHTML = message;
  classie.add(notify, "visible");
  setTimeout(() => {notifyX()}, 3000);
};
const signout = () => {
  window.sessionStorage.clear();
  window.location = "../../index.html";
};
const signin = () => {
  if (!login.checkValidity()) {
    callError("Username or Email", login.validationMessage);
  } else if (!password.checkValidity()) {
    callError("Password", password.validationMessage);
  } else {
    let data;
    if (login.value.includes("@")) {
      data = {
        email: login.value,
        password: password.value
      };
    } else {
      data = {
        username: login.value,
        password: password.value
      };
    }
    fetch(`${url}auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        if (result.status === "error") {
          callError("Sign In", result.data.message);
        }
        if (result.status === "fail") {
          callError("Sign In", result.data.message);
        }
        if (result.status === "success" && result.data.token) {
          window.sessionStorage.setItem("token", result.data.token);
          window.sessionStorage.setItem("status", "signin");
          window.location = "profile.html";
        }
      })
      .catch(err => console.error(err));
  }
};
const signup = () => {
  if (!username.checkValidity()) {
    callError("Username", username.validationMessage);
  } else if (!email.checkValidity()) {
    callError("Email", email.validationMessage);
  } else if (!password.checkValidity()) {
    callError("Password", password.validationMessage);
  } else if (!passwordVerification.checkValidity()) {
    callError("Password Verification", passwordVerification.validationMessage);
  } else {
    if (password.value !== passwordVerification.value) {
      callError("Password", "Password verification does not match");
    } else {
      fetch(`${url}auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.value,
          email: email.value,
          password: password.value
        })
      })
        .then(response => response.json())
        .then(result => {
          if (result.status === "error") {
            callError("Sign Up", result.data.message);
          }
          if (result.status === "fail") {
            callError("Sign Up", result.data.message);
          }
          if (
            result.status === "success" &&
            result.data.message === "user is signed up successfully" &&
            result.data.token
          ) {
            window.sessionStorage.setItem("token", result.data.token);
            window.sessionStorage.setItem("status", "signup");
            window.location = "profile.html";
          }
        })
        .catch(err => console.error(err));
    }
  }
};

const profile = () => {
  const signStat = window.sessionStorage.getItem("status");
  const token = window.sessionStorage.getItem("token");
  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");
  if (!token) {
    window.location = "signin.html";
  }
  if (signStat && signStat == "signup") {
    callSuccess("Welcome! you are signed up successfully.");
    window.sessionStorage.removeItem("status");
  }
  if (signStat && signStat == "signin") {
    callSuccess("Welcome! you are signed in successfully.");
    window.sessionStorage.removeItem("status");
  }
  if (signStat && signStat == "already") {
    callSuccess("you are already signed in !");
    window.sessionStorage.removeItem("status");
  }
  fetch(`${url}auth/profile`, {
    headers: {
      Accept: "application/json",
      "x-token-access": token
    }
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === "error") {
        callError("Verification", result.data.message);
      }
      if (result.status === "fail") {
        callError("Verification", result.data.message);
      }
      if (result.status === "success") {
        title.innerHTML = result.data.user.username;
        subtitle.innerHTML = result.data.user.email;
      }
    })
    .catch(err => console.error(err));
};
