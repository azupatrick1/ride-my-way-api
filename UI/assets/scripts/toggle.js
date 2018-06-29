const toggle = document.getElementById('container');
const toggleContainer = document.getElementById('toggle-container');

const all = document.getElementById('all');
const byride = document.getElementById('byride');


toggle.addEventListener('click', function() {
	
	if (all.className == "unhide") {
		toggleContainer.style.clipPath = 'inset(0 0 0 50%)';
        toggleContainer.style.backgroundColor = '#ec7f19';
        all.className = 'hide';
        byride.className = 'unhide';
	} else {
		toggleContainer.style.clipPath = 'inset(0 50% 0 0)';
        toggleContainer.style.backgroundColor = '#2e8dec';
        all.className = 'unhide';
        byride.className = 'hide';
	}
	
});