// Script.js → enhance site interactivity

// 1️⃣ Fade in elements on scroll
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

// 2️⃣ Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// 3️⃣ Back to Top Button (safe version)
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (backToTopButton) {
    if (window.scrollY > 200) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  }
});

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 4️⃣ Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded"); // TEST → should appear

  // 4a️⃣ Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }

  // 4b️⃣ Dashboard dropdown toggle
  const dashboardToggle = document.getElementById('dashboardToggle');
  const dashboardDropdown = document.getElementById('dashboardDropdown');

  if (dashboardToggle && dashboardDropdown) {
    dashboardToggle.addEventListener('click', function (e) {
      console.log("Dashboard clicked"); // TEST → should appear
      dashboardDropdown.classList.toggle('show');
      e.stopPropagation(); // prevent outside click from closing immediately
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function (e) {
      if (!document.querySelector('.dashboard-menu').contains(e.target)) {
        dashboardDropdown.classList.remove('show');
      }
    });
  } else {
    console.log("Dashboard elements not found"); // helpful debug
  }
});
