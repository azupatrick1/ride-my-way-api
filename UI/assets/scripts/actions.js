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
