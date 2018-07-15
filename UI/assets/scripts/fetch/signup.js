const signup = () => {
  const url = "http://ride-my-way-api.herokuapp.com/";
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordVerification = document.getElementById("password-verification")
    .value;

  //   if (password !== passwordVerification) {
  //     console.log("password not match");
  //   } else {
  fetch(url
    // , {
////     //   method: "POST",
//     mode: "cors"
//     //   credentials: "include"
//     //   headers: {
//     //     "Content-Type": "application/json"
//     //   },
//     //   body: JSON.stringify({
//     //     username: username,
//     //     email: email,
//     //     password: password
//     //   })
//   })
)
.then(response => response.json())
    .then(result => console.log(result))
    .catch(err => console.error(err));
  //   }
};
