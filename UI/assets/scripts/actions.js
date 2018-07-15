function openPage(page) {
  location.href = page;
}

function join() {
  let btn = document.getElementById("join");
  let sign = document.getElementById("req-sent");

  if (!classie.hasClass(btn, "disappear")) {
    alert("Ride request has been sent");
    classie.remove(sign, "disappear");
    classie.add(btn, "disappear");
  }
}

function notifyClose() {
  const notify = document.getElementById("notify");
  if (classie.hasClass(notify, "alert-error"))
    classie.remove(notify, "alert-error");
  if (classie.hasClass(notify, "alert-success"))
    classie.remove(notify, "alert-success");
  notifyTitle.innerHTML = "";
  notifyBody.innerHTML = "";
  classie.remove(notify, "visible");
}
