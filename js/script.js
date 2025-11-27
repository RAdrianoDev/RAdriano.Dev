/*==================== toggle icon navbar ====================*/
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

/*==================== scroll sections active link ====================*/
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  sections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });
  /*==================== sticky navbar ====================*/
  let header = document.querySelector("header");

  header.classList.toggle("sticky", window.scrollY > 100);

  /*==================== remove toggle icon and navbar when click navbar link (scroll) ====================*/
  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");
};

/*==================== scroll reveal ====================*/
ScrollReveal({
  //reset: true,
  distance: "80px",
  duration: 2000,
  delay: 200,
});

ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
ScrollReveal().reveal(
  ".home-img, .services-container, portfolio-box, .contact form",
  { origin: "bottom" }
);
ScrollReveal().reveal(".home-content h1, .about-img", { origin: "left" });
ScrollReveal().reveal(".home-content p, .about-content", { origin: "right" });

/*==================== typed js ====================*/
const typed = new Typed(".multiple-text", {
  strings: [
    "a Full Stack Developer",
    "an IT Administrator",
    "an ERP Consultant",
    // "an Accountant",
  ],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true,
});

/*==================== equalize services cards height ====================*/
function equalizeCardsHeight() {
  const cards = document.querySelectorAll('.services-container .services-box');
  if (cards.length === 0) return;

  // Reset heights
  cards.forEach(card => {
    card.style.height = 'auto';
  });

  // Get all cards in the same row
  const rows = [];
  let currentRow = [];
  let currentTop = null;

  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    
    if (currentTop === null || Math.abs(rect.top - currentTop) < 10) {
      // Same row
      currentRow.push(card);
      currentTop = rect.top;
    } else {
      // New row
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [card];
      currentTop = rect.top;
    }
  });

  // Add last row
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  // Set same height for cards in each row
  rows.forEach(row => {
    let maxHeight = 0;
    row.forEach(card => {
      const height = card.offsetHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });
    row.forEach(card => {
      card.style.height = maxHeight + 'px';
    });
  });
}

// Run on load and resize
window.addEventListener('load', equalizeCardsHeight);
window.addEventListener('resize', equalizeCardsHeight);

// Also run after a short delay to ensure all content is loaded
setTimeout(equalizeCardsHeight, 100);