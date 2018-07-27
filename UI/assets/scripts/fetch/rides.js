const baseurl = "https://ride-my-way-api.herokuapp.com/api/v1/";
const token = localStorage.getItem("token");

const urlId = window.location.hash.substring(1);
const localId = localStorage.getItem("rideId");

const notifyX = () => {
  const notify = document.getElementById("notify");
  const notifyTitle = notify.querySelector("#notify-title");
  const notifyBody = notify.querySelector("#notify-body");
  if (classie.hasClass(notify, "alert-error"))
    classie.remove(notify, "alert-error");
  if (classie.hasClass(notify, "alert-success"))
    classie.remove(notify, "alert-success");
  notifyTitle.innerHTML = "";
  notifyBody.innerHTML = "";
  classie.remove(notify, "visible");
};

const callError = (element, message) => {
  const notify = document.getElementById("notify");
  const notifyTitle = notify.querySelector("#notify-title");
  const notifyBody = notify.querySelector("#notify-body");
  if (classie.hasClass(notify, "alert-error"))
    classie.remove(notify, "alert-error");
  if (classie.hasClass(notify, "alert-success"))
    classie.remove(notify, "alert-success");
  classie.add(notify, "alert-error");
  notifyTitle.innerHTML = `Error at ${element}`;
  notifyBody.innerHTML = message;
  classie.add(notify, "visible");
  setTimeout(() => {
    notifyX();
  }, 3000);
};

const callSuccess = message => {
  const notify = document.getElementById("notify");
  const notifyTitle = notify.querySelector("#notify-title");
  const notifyBody = notify.querySelector("#notify-body");
  if (classie.has(notify, "alert-error")) classie.remove(notify, "alert-error");
  if (classie.has(notify, "alert-success"))
    classie.remove(notify, "alert-success");
  classie.add(notify, "alert-success");
  notifyTitle.innerHTML = "Message";
  notifyBody.innerHTML = message;
  classie.add(notify, "visible");
  setTimeout(() => {
    notifyX();
  }, 3000);
};
const timeConvert = time => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time
  ];
  if (time.length > 1) {
    time = time.slice(1);
    time[3] = +time[0] < 12 ? " AM" : " PM";
    time[0] = +time[0] % 12 || 12;
  }
  return time.join("");
};
const signout = () => {
  localStorage.clear();
  window.location = "../../index.html";
};
const allRides = () => {
  const token = localStorage.getItem("token");
  const rideGroup = document.getElementById("all-rides");
  if (!token) {
    window.location = "../users/signin.html";
  } else {
    fetch(`${baseurl}rides`, {
      headers: {
        Accept: "application/json",
        "x-token-access": token
      }
    })
      .then(response => response.json())
      .then(result => {
        if (result.status === "error") {
          //   callError("Verification", result.data.message);
        }
        if (result.status === "fail") {
          //   callError("Verification", result.data.message);
        }
        if (result.status === "success") {
          let rides = "";
          const allRide = result.data.rides.reverse();
          allRide.forEach(ride => {
            if (ride.status !== "cancelled") {
              rides += `
              <div class="box">
                    <h3>${ride.name}</h3>    
                    <p>From ${ride.location} to ${ride.destination}</p>
                    <p>${timeConvert(ride.time)} </p>
                    <p><strong>${ride.slot}</strong> slot Available</p>
                    <p>Ride with <strong >${ride.driver}</strong> in ${ride.carmodel} </p>
                    <p><small> created on ${ride.created_at.split("T")[0]} </small></p>
                    <div class="foot">
                    <a onclick="openRide(${ride.id})" class="button btn-open">View Details</a>
                    </div>
                </div>
              `;
            }
          });

          rideGroup.innerHTML = rides;
          console.log(result);
        }
      })
      .catch(err =>
        callError("connection", "Check your network or contact web admin")
      );
  }
};

const openRide = rideId => {
  localStorage.setItem("rideId", rideId);
  window.location = `show.html#${rideId}`;
};

const oneRide = () => {
  const rideReqBtn = document.getElementById("ride-req-btn");
  const oneRide = document.getElementById("one-ride");

  if (!token) {
    window.location = "../users/signin.html";
  } else {
    let rideId;
    let reqstat = 1;
    let riderReq;
    const fetchride = () => {
      fetch(`${baseurl}rides/${rideId}`, {
        headers: {
          Accept: "application/json",
          "x-token-access": token
        }
      })
        .then(response => response.json())
        .then(result => {
          if (result.status === "error") {
            //   callError("Verification", result.data.message);
          }
          if (result.status === "fail") {
            //   callError("Verification", result.data.message);
          }
          if (result.status === "success") {
            const ride = result.data.ride;
            const date = new Date(Date.parse(ride.takeoffdate.split("T")[0]));
            oneRide.innerHTML = `
            <h2> ${ride.name}</h2>
            <h4>Departure Location :
                <small>${ride.location}</small>
            </h4>
            <h4>Destination :
                <small>${ride.destination}</small>
            </h4>
            <h4>Departure Time :
                <small>${timeConvert(ride.time)}</small>
            </h4>
            <h4>Departure Time :
            <small>${date.toDateString().split(" ").join(" ")}</small>
                        </h4>
            <h4>Avalaible slot :
                <small>${ride.slot}</small>
            </h4>
            <h4>Vehicle:
                <small>${ride.carmodel}</small>
            </h4>
            <h4>Ride Status:
              <small>${ride.status}</small>            </h4>
            `;
            if (ride.status === "cancelled") {
              rideReqBtn.innerHTML = `
              <h3 id="req-sent" > Ride has been cancelled! </h3>`;
            } else {
              if (reqstat === 1) {
                rideReqBtn.innerHTML = `
            <a id="join" class="button btn-open" onclick="join()"> Join this ride</a>
                        <h3 id="req-sent" class="text-green disappear">
                            Request sent!
                        </h3>
            `;
              } else if (reqstat === 2) {
                rideReqBtn.innerHTML = `
                        <h3 id="req-sent" class="text-green">
                            Request sent!
                        </h3>
            `;
              } else if (reqstat === 3) {
                rideReqBtn.innerHTML = `
              <a id="cancel" class="button btn-open" onclick="cancelRide()"> Cancel this ride</a>
              <h3 id="req-sent" > No request to this ride </h3>`;
              } else if (reqstat === 5) {
                rideReqBtn.innerHTML = `
                        <h3 id="req-sent" class="text-green">
                            Request Accepted !
                        </h3>
            `;
              } else if (reqstat === 6) {
                rideReqBtn.innerHTML = `
                        <h3 id="req-sent" class="text-red">
                            Request Rejected!
                        </h3>
            `;
              } else {
                let r = `
              <a id="cancel" class="button btn-open" onclick="cancelRide()"> Cancel this ride</a>
              <h3> ride requests (${riderReq.length})</h3>`;
                riderReq.forEach(req => {
                  r += `<p> ${req.rider} </p>`;
                });
                rideReqBtn.innerHTML = r;
              }
            }
            console.log(result);
          }
        })
        .catch(err => console.error(err));
    };
    if (!urlId || urlId === undefined) {
      if (localId && localId !== undefined) {
        window.location = `show.html#${localId}`;
      } else {
        window.location = "index.html";
      }
    } else {
      rideId = urlId;
      localStorage.setItem("rideId", urlId);
      fetch(`${baseurl}rides/${rideId}/requests`, {
        headers: {
          Accept: "application/json",
          "x-token-access": token
        }
      })
        .then(response => response.json())
        .then(result => {
          if (result.status === "error") {
            //   callError("Verification", result.data.message);
          }
          if (
            result.status === "fail" &&
            result.data.message === "you have sent no request to this ride"
          ) {
            reqstat = 1;
            fetchride();
          } else if (
            result.status === "fail" &&
            result.data.message === "you have no request to this ride"
          ) {
            reqstat = 3;
            fetchride();
          } else if (
            result.status === "success" &&
            !result.data.request &&
            !result.data.requests
          ) {
            reqstat = 1;
            fetchride();
          } else if (result.status === "success" && result.data.requests) {
            reqstat = 4;
            riderReq = result.data.requests;
            fetchride();
          } else if (result.status === "success" && result.data.request.status === "Accepted" ) {
             reqstat = 5;
            fetchride();
          } else if (result.status === "success" && result.data.request.status === "Rejected" ) {
            reqstat = 6;
           fetchride();
         }else {
            reqstat = 2;
            fetchride();
          }
          console.log(result);
        })
        .catch(err =>
          callError("connection", "Check your network or contact web admin")
        );
    }
  }
};

const join = () => {
  let btn = document.getElementById("join");
  let sign = document.getElementById("req-sent");
  const rideReqBtn = document.getElementById("ride-req-btn");

  fetch(`${baseurl}rides/${urlId}/requests`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "x-token-access": token
    }
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === "error") {
        //   callError("Verification", result.data.message);
        console.log(result);
      }

      if (result.status === "fail") {
        callError("Ride request", result.data.message);
        console.log(result.data.message);
      }

      if (result.status === "success") {
        callSuccess("Your request for this ride has being sent");

        location.reload();
      }
    })
    .catch(err =>
      callError("connection", "Check your network or contact web admin")
    );
};

const getRequest = () => {
  const MyReq = document.getElementById("my-req");
  const ReqSent = document.getElementById("req-sent");
  if (!token) {
    window.location = "../users/signin.html";
  } else {
    fetch(`${baseurl}requests`, {
      headers: {
        Accept: "application/json",
        "x-token-access": token
      }
    })
      .then(response => response.json())
      .then(result => {
        if (result.status === "error") {
          //   callError("Verification", result.data.message);
          console.log(result);
        }
        if (result.status === "fail") {
          callError("Ride requests", result.data.message);
        }
        if (result.status === "success") {
          const reqR = result.data.requestRecieve;
          const reqS = result.data.requestSent;
          if (reqR && reqR.length > 0) {
            let ride = "";
            const check = r => {
              if (r.status === "pending request") {
                return `
                <a onclick="RDecide(true, ${r.ride_id}, ${r.id})" class="button btn-green"> Accept</a>
                <a onclick="RDecide(false, ${r.ride_id}, ${r.id})" class="button btn-red"> Reject</a>
                `;
              } else if (r.status === "Accepted") {
                return "Accepted";
              } else if (r.status === "Rejected") {
                return "Rejected";
              } else {
                return "Loading ...";
              }
            };

            reqR.forEach(rr => {
              ride += `
            <div class="box">
              <h3>${rr.rider}</h3>
              <p>${rr.ride_name}</p>
              <div class="text-center">
                ${check(rr)}
              </div>
            </div>
            `;
            });

            MyReq.innerHTML = ride;
          } else {
            MyReq.innerHTML = `
              <li> No request sent to you yet... </li>
            `;
          }
          if (reqS && reqS.length > 0) {
            let ride = "";
            reqS.forEach(rs => {
              ride += `
            <div class="box">
              <h3>${rs.ride_name}</h3>
              <h4>Status:
                <small class="text-green">${rs.status}</small>
              </h4>
            </div>
            `;
            });
            ReqSent.innerHTML = ride;
          } else {
            Req.innerHTML = `
              <li> No request sent by you yet... </li>
            `;
          }
        }
      })
      .catch(err =>
        callError("connection", "Check your network or contact web admin")
      );
  }
};

const createRide = () => {
  const name = document.getElementById("name");
  const location = document.getElementById("location");
  const destination = document.getElementById("destination");
  const time = document.getElementById("time");
  const date = document.getElementById("takeOffDate");
  const car = document.getElementById("carModel");
  const slot = document.getElementById("slot");

  if (!name.checkValidity()) {
    callError("Ride name", name.validationMessage);
  } else if (!location.checkValidity()) {
    callError("Location", location.validationMessage);
  } else if (!destination.checkValidity()) {
    callError("Destination", destination.validationMessage);
  } else if (!time.checkValidity()) {
    callError("Time of departure ", time.validationMessage);
  } else if (!date.checkValidity()) {
    callError("Date of departure ", date.validationMessage);
  } else if (!car.checkValidity()) {
    callError("Date of departure ", car.validationMessage);
  } else if (!slot.checkValidity()) {
    callError("Seat slot ", slot.validationMessage);
  } else {
    fetch(`${baseurl}users/rides`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        "x-token-access": token
      },
      body: JSON.stringify({
        name: name.value,
        location: location.value,
        destination: destination.value,
        time: time.value,
        takeOffDate: date.value,
        carModel: car.value,
        slot: Number(slot.value)
      })
    })
      .then(response => response.json())
      .then(result => {
        if (result.status === "error") {
          callError("Create Ride", result.data.message);
        }
        if (result.status === "fail") {
          callError("Create Ride", result.data.message);
        }
        if (result.status === "success" && result.data.ride) {
          localStorage.setItem("status", "ridecreate");
          window.location = "../users/profile.html";
        }
      })
      .catch(err =>
        callError("connection", "Check your network or contact web admin")
      );
  }
};

const cancelRide = () => {
  const rideReqBtn = document.getElementById("ride-req-btn");

  fetch(`${baseurl}rides/${urlId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "x-token-access": token
    }
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === "error") {
        //   callError("Verification", result.data.message);
        console.log(result);
      }

      if (result.status === "fail") {
        callError("Ride request", result.data.message);
      }

      if (result.status === "success") {
        callSuccess("This ride has been cancelled");
        console.log(result);
        location.reload();
      }
    })
    .catch(err =>
      callError("connection", "Check your network or contact web admin")
    );
};

const RDecide = (status, RId, RqId) => {
  const MyReq = document.getElementById("my-req").querySelector(".box").querySelector(".text-center");

  fetch(`${baseurl}rides/${RId}/requests/${RqId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "x-token-access": token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accept: status
    })
  })
    .then(response => response.json())
    .then(result => {
      if (result.status === "error") {
        callError("Verification", result.data.message);
      }

      if (result.status === "fail") {
        callError("Ride request", result.data.message);
      }

      if (result.status === "success") {
        if (result.data.message === "you have accepted this request") {
          callSuccess(result.data.message);
          MyReq.innerHTML = "Accepted";
          console.log(result.data.message);
        
          } else {
          callSuccess(result.data.message);
          console.log(result.data.message);

          MyReq.innerHTML = "Rejected";
        }
        location.reload();
      }
    })
    .catch(err =>
      callError("connection", "Check your network or contact web admin")
    );
};