// Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  // Save preference to localStorage
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// On page load → apply saved Dark Mode preference
window.onload = function () {
  const darkPref = localStorage.getItem('darkMode') === 'true';
  if (darkPref) {
    document.body.classList.add('dark-mode');
  }
};

// Scroll To Top
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  const btn = document.getElementById("scrollTopBtn");
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


// Page Transition Animation
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
});

// Preloader
window.addEventListener("load", function(){
  const preloader = document.getElementById("preloader");
  preloader.style.display = "none";
});
