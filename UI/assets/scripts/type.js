
var i = 0;
var txt = 'RIDE MY WAY';
var speed = 100;

function typeWriter() {
  const token = localStorage.getItem("token");

  if (i < txt.length) {
    document.getElementById("type").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }

  if (token) {
    document.getElementById("my-nav").innerHTML = `
      <a href="./index.html" class="">Home</a>
			<a href="./UI/rides/index.html" class="">All Rides</a>
			<a href="./UI/rides/offers.html" class="">All Requests</a>
      <a href="./UI/users/profile.html" class="">Profile</a>
      <a onclick="signout()" class="">Sign Out</a>
    `;
    
  } 
else {
  document.getElementById("my-nav").innerHTML =`<a href="./index.html" class="">Home</a>
  <a href="./UI/rides/about.html" class="">About</a>
  <a href="./UI/users/signup.html" class="">Sign up</a>
  <a href="./UI/users/signin.html" class="">Sign in</a>`;
}
}

const signout = () => {
  localStorage.clear();
  window.location = "index.html";
};
