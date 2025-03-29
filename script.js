// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const button = document.querySelector(".toggle-theme");
    const icon = button?.querySelector("i");

    body.classList.toggle("dark-mode");

    if (icon) {
        icon.classList.toggle("fa-sun", !body.classList.contains("dark-mode"));
        icon.classList.toggle("fa-moon", body.classList.contains("dark-mode"));
    }
}

// GitHub Stats Fetching
async function fetchGitHubStats(username) {
    const statsDiv = document.getElementById("github-stats");
    if (!statsDiv) {
        console.error("Error: #github-stats element not found.");
        return;
    }

    statsDiv.innerHTML = '<p class="loading">Loading GitHub Stats...</p>';

    try {
        const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.github.com/users/${username}`)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const json = await response.json();
        const data = JSON.parse(json.contents);
        if (!data || !data.public_repos) throw new Error("Invalid GitHub API response");

        statsDiv.innerHTML = "";
        statsDiv.appendChild(createStatElement("fa-code-branch", `Public Repos: ${data.public_repos}`));
        statsDiv.appendChild(createStatElement("fa-users", `Followers: ${data.followers}`));
        statsDiv.appendChild(createStatElement("fa-user-friends", `Following: ${data.following}`));
    } catch (error) {
        console.error("Error fetching GitHub stats:", error.message);
        statsDiv.innerHTML = `<p class="error">Failed to load stats: ${error.message}</p>`;
    }
}

function createStatElement(iconClass, text) {
    const p = document.createElement("p");
    const icon = document.createElement("i");
    icon.classList.add("fas", iconClass);
    p.appendChild(icon);
    p.appendChild(document.createTextNode(` ${text}`)); // Added space for readability
    return p;
}

// Testimonial Slider
let currentTestimonial = 0;
let totalTestimonials = 0;

function updateSlider() {
    const slider = document.getElementById("testimonials-slider");
    if (slider) {
        slider.style.transform = `translateX(-${currentTestimonial * 100}%)`;
        updateButtonState();
    }
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    updateSlider();
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    updateSlider();
}

function updateButtonState() {
    const prevButton = document.querySelector("#testimonial-nav button:first-of-type");
    const nextButton = document.querySelector("#testimonial-nav button:last-of-type");

    if (prevButton && nextButton) {
        prevButton.disabled = currentTestimonial === 0;
        nextButton.disabled = currentTestimonial === totalTestimonials - 1;
    }
}

// Consolidated DOMContentLoaded Listener
document.addEventListener("DOMContentLoaded", function () {
    // Theme Toggle Button
    const toggleButton = document.querySelector(".toggle-theme");
    if (toggleButton) {
        toggleButton.innerHTML = `<i class="fas ${document.body.classList.contains("dark-mode") ? "fa-moon" : "fa-sun"}"></i>`;
        toggleButton.addEventListener("click", toggleTheme);
    }

    // Fetch GitHub Stats
    fetchGitHubStats("ashfiexe"); // Replace with your GitHub username

    // Testimonial Slider Setup
    const testimonials = document.querySelectorAll(".testimonial");
    totalTestimonials = testimonials.length;
    const testimonialNavButtons = document.querySelectorAll("#testimonial-nav button");

    if (totalTestimonials > 0 && testimonialNavButtons.length === 2) {
        testimonialNavButtons[0].addEventListener("click", prevTestimonial);
        testimonialNavButtons[1].addEventListener("click", nextTestimonial);
        updateSlider();
        setInterval(nextTestimonial, 5000);
    } else {
        console.warn("Testimonial slider not initialized: missing testimonials or navigation buttons.");
    }

    // Header Scroll Effect
    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }
    });

    // EmailJS Integration
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS Public Key

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const message = document.getElementById("message")?.value.trim();

            if (!name || !email || !message) {
                alert("Please fill in all fields.");
                return;
            }

            const templateParams = {
                from_name: name,
                to_name: "Salehin",
                message: message,
                reply_to: email,
            };

            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams) // Replace with your Service and Template IDs
                .then(() => {
                    alert("Message sent successfully!");
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error("EmailJS Error:", error);
                    alert("Failed to send message. Please try again later.");
                });
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector("nav");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));
        document.querySelectorAll("nav a").forEach((link) => {
            link.addEventListener("click", () => navLinks.classList.remove("active"));
        });
    }

    // Abstract Shapes Animation (requires anime.js)
    if (typeof anime !== "undefined") {
        document.querySelectorAll(".abstract-shape").forEach((shape) => {
            shape.style.left = `${Math.random() * 100}vw`;
            shape.style.top = `${Math.random() * 100}vh`;

            anime({
                targets: shape,
                translateX: [0, Math.random() * 200 - 100],
                translateY: [0, Math.random() * 200 - 100],
                scale: [1, Math.random() * 1.5 + 0.5],
                opacity: [0.6, 1],
                duration: 4000 + Math.random() * 3000,
                easing: "easeInOutSine",
                loop: true,
                direction: "alternate",
            });
        });
    } else {
        console.warn("Anime.js not loaded; abstract shapes animation skipped.");
    }
});