// Script.js → enhance site interactivity

// Fade in elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.fade-in').forEach(element => {
  observer.observe(element);
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Future Enhancements:
// - Parallax scroll
// - Light/dark mode toggle


// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

});

// Dashboard dropdown toggle
document.getElementById('dashboardToggle').addEventListener('click', function() {
  document.getElementById('dashboardDropdown').classList.toggle('show');
});

// Optional: close dropdown when clicking outside
window.addEventListener('click', function(e) {
  if (!document.querySelector('.dashboard-menu').contains(e.target)) {
    document.getElementById('dashboardDropdown').classList.remove('show');
  }
});
