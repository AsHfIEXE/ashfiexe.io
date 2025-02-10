function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}

// GitHub Stats Fetching
async function fetchGitHubStats(username) {
    const statsDiv = document.getElementById('github-stats');
    statsDiv.innerHTML = '<p class="loading">Loading GitHub Stats...</p>'; // Initial loading message

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const data = await response.json();

        statsDiv.innerHTML = ''; // Clear loading message

        // Create and append stat elements with icons
        statsDiv.appendChild(createStatElement('fa-code-branch', `Public Repositories: ${data.public_repos}`));
        statsDiv.appendChild(createStatElement('fa-users', `Followers: ${data.followers}`));
        statsDiv.appendChild(createStatElement('fa-user-friends', `Following: ${data.following}`));

    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        statsDiv.innerHTML = '<p class="error">Failed to load GitHub stats.</p>';
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

// Call the function with your GitHub username
fetchGitHubStats('ashfiexe'); // Replace with your username

// Testimonial Slider JavaScript
let currentTestimonial = 0;
const testimonialsSlider = document.getElementById("testimonials-slider");
let totalTestimonials = 0;  // Initialize totalTestimonials

// Wait for the DOM to fully load before getting testimonials
document.addEventListener('DOMContentLoaded', () => {
    totalTestimonials = document.querySelectorAll(".testimonial").length;
    updateButtonState(); // Initialize button states
});


function updateSlider() {
    testimonialsSlider.style.transform = `translateX(-${currentTestimonial * 100}%)`;
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

// Function to update the button states (disabled/enabled)
function updateButtonState() {
    const prevButton = document.querySelector('#testimonial-nav button:first-of-type');
    const nextButton = document.querySelector('#testimonial-nav button:last-of-type');

    if (prevButton && nextButton) { // Check if buttons exist
        prevButton.disabled = (currentTestimonial === 0);
        nextButton.disabled = (currentTestimonial === totalTestimonials - 1);
    }
}


//Optional: Autoscroll every 5 seconds
setInterval(nextTestimonial, 5000);



document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize EmailJS - Ensure this is called *after* the DOM is fully loaded
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your Public Key


    // Contact Form Submission
    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        const templateParams = {
            from_name: name,
            to_name: "Salehin",  // Your name or recipient name
            message: message,
            reply_to: email
        };

        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams) // Replace with your Service and Template IDs
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert("Message sent successfully!");
                contactForm.reset(); // Clear the form after successful submission
            }, function(error) {
                console.log('FAILED...', error);
                alert("Failed to send message. Please try again later.");
            });
    });


});
document.addEventListener("DOMContentLoaded", function () {
    const shapes = document.querySelectorAll(".abstract-shape");

    shapes.forEach((shape, index) => {
        shape.style.left = `${Math.random() * 100}vw`;
        shape.style.top = `${Math.random() * 100}vh`;

        anime({
            targets: shape,
            translateX: [0, Math.random() * 200 - 100], // Moves randomly left and right
            translateY: [0, Math.random() * 200 - 100], // Moves randomly up and down
            scale: [1, Math.random() * 1.5 + 0.5], // Changes size randomly
            opacity: [0.6, 1], // Makes it fade in/out slightly
            duration: 4000 + Math.random() * 3000, // Randomized speed
            easing: "easeInOutSine",
            loop: true,
            direction: "alternate"
        });
    });
});

  
  