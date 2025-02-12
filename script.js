function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-mode");
  
    //Correctly find button
    const button = document.querySelector(".toggle-theme");
  
    if (button) { // Check if button exists
      const icon = button.querySelector("i");
  
      if (body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      } else {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      }
    } else {
      console.error("Toggle theme button not found!");
    }
  }


async function fetchGitHubStats(username) {
    const statsDiv = document.getElementById('github-stats');
    statsDiv.innerHTML = '<p class="loading">Loading GitHub Stats...</p>'; // Initial loading

    try {
        // Use AllOrigins proxy to bypass GitHub rate limits/CORS in client-side code
        const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.github.com/users/${username}`)}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch from AllOrigins: ${response.status}`);
        }

        const json = await response.json(); // Get JSON from AllOrigins
        const data = JSON.parse(json.contents); // Parse the *actual* GitHub API response

        if (!data || !data.public_repos) {
            throw new Error("Invalid data received from GitHub API (via AllOrigins).");
        }


        statsDiv.innerHTML = ''; // Clear loading message

        // Create and append stat elements with icons
        statsDiv.appendChild(createStatElement('fa-code-branch', `Public Repositories: ${data.public_repos}`));
        statsDiv.appendChild(createStatElement('fa-users', `Followers: ${data.followers}`));
        statsDiv.appendChild(createStatElement('fa-user-friends', `Following: ${data.following}`));

    } catch (error) {
        console.error("Error fetching GitHub stats:", error.message); // Log the specific error
        statsDiv.innerHTML = `<p class="error">Failed to load GitHub stats: ${error.message}</p>`; // Show error
    }
}


// Helper function to create stat elements with icons
function createStatElement(iconClass, text) {
    const p = document.createElement('p');
    const icon = document.createElement('i');
    icon.classList.add('fas', iconClass);
    p.appendChild(icon);
    p.appendChild(document.createTextNode(text));
    return p;
}



// Testimonial Slider
let currentTestimonial = 0;
let testimonialsSlider; // Declare here
let totalTestimonials = 0;
let testimonialNavButtons;

function updateSlider() {
    if (testimonialsSlider) { // Check if it exists
      testimonialsSlider.style.transform = `translateX(-${currentTestimonial * 100 / totalTestimonials}%)`;
    }
    updateButtonState();
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
    const prevButton = document.querySelector('#testimonial-nav button:first-of-type');
    const nextButton = document.querySelector('#testimonial-nav button:last-of-type');

    if (prevButton && nextButton) {
        prevButton.disabled = (currentTestimonial === 0);
        nextButton.disabled = (currentTestimonial === totalTestimonials - 1);
    }
}

// DOMContentLoaded Event - Everything that interacts with the DOM goes here
document.addEventListener('DOMContentLoaded', function() {

    // --- GitHub Stats ---
    fetchGitHubStats('ashfiexe'); // Call the function with your GitHub username

    // --- Testimonial Slider Setup ---
    testimonialsSlider = document.getElementById("testimonials-slider"); //Initialize
    const testimonials = document.querySelectorAll(".testimonial");

    // Check if testimonial elements exist, and only proceed if they do.  CRUCIAL.
    if (testimonialsSlider && testimonials.length > 0) {
      totalTestimonials = testimonials.length;
      updateButtonState(); // Initialize button states

      //Only try to setup the slider if testimonials exist.
        testimonialNavButtons = document.querySelectorAll('#testimonial-nav button');
        if (testimonialNavButtons.length > 0) { // Ensure nav buttons
            testimonialNavButtons[0].addEventListener('click', prevTestimonial);
            testimonialNavButtons[1].addEventListener('click', nextTestimonial);
             //Optional: Autoscroll every 5 seconds
           setInterval(nextTestimonial, 5000);
        }

    } else {
        console.error("Testimonial elements not found. Check your HTML structure.");
    }


    // --- Header Scroll ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- EmailJS ---
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your Public Key

    // Contact Form Submission
    const contactForm = document.getElementById("contactForm");
    if (contactForm) { // Check if contact form exists
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            const templateParams = {
                from_name: name,
                to_name: "Salehin",
                message: message,
                reply_to: email
            };

            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert("Message sent successfully!");
                    contactForm.reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    alert("Failed to send message. Please try again later.");
                });
        });
    }

    // --- Menu Toggle ---
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector("nav"); // Get the <nav> element

    if (menuToggle && navLinks) { // Check existence
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

          // Close the menu when a navigation link is clicked
        const navLinksList = document.querySelectorAll('nav a');
         navLinksList.forEach(link => {
         link.addEventListener('click', () => {
                navLinks.classList.remove('active'); // Remove 'active'
            });
    });
    }
// --- Abstract shapes setup

  const shapes = document.querySelectorAll(".abstract-shape");

    if (shapes.length > 0) {  // Only proceed if shapes exist
        shapes.forEach((shape, index) => {

            shape.style.left = `${Math.random() * 100}vw`;
            shape.style.top = `${Math.random() * 100}vh`;

            anime({
                targets: shape,
                translateX: [0, Math.random() * 200 - 100], // Moves randomly left and right
                translateY: [0, Math.random() * 200 - 100], // Moves randomly up and down
                scale: [1, Math.random() * 1.5 + 0.5],      // Changes size randomly
                opacity: [0.6, 1],                          // Makes it fade in/out slightly
                duration: 4000 + Math.random() * 3000,     // Randomized speed
                easing: "easeInOutSine",
                loop: true,
                direction: "alternate"
        });
    });
    }
});