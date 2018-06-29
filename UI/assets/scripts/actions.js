function openPage(page) {
   location.href= page;
}

function join() {


    let  btn = document.getElementById('join');
    let  btn2 = document.getElementById('join2');

    if (btn) {
        alert('Ride request has been sent');
    btn.classList.remove("btn-green");
    btn.classList.add("btn-red");
    btn.innerText = "Cancel Request";
    btn.id = "join2";
    } else {
    alert('Ride request has been cancelled');
    btn2.classList.remove("btn-red");
    btn2.classList.add("btn-green");
    btn2.innerText = "Join this ride";
    btn2.id = "join";
    }
    

}

