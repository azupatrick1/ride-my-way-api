function openPage(page) {
  location.href = page;
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
