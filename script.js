function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const icon = document.querySelector(".toggle-theme i"); // Select the <i> tag
    if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    } else {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }
}

async function fetchGitHubStats(ashfiexe) {
    const statsDiv = document.getElementById('github-stats');
    statsDiv.innerHTML = '<p class="loading">Loading GitHub Stats...</p>'; 

    try {
        // Use AllOrigins proxy to bypass GitHub rate limits
        const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.github.com/users/${ashfiexe}`)}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

        const json = await response.json();
        const data = JSON.parse(json.contents); // Extract actual GitHub data

        statsDiv.innerHTML = ''; 

        statsDiv.appendChild(createStatElement('fa-code-branch', `Public Repositories: ${data.public_repos}`));
        statsDiv.appendChild(createStatElement('fa-users', `Followers: ${data.followers}`));
        statsDiv.appendChild(createStatElement('fa-user-friends', `Following: ${data.following}`));

    } catch (error) {
        console.error("Error fetching GitHub stats:", error.message);
        statsDiv.innerHTML = `<p class="error">${error.message}</p>`;
    }
}



// Function to create stat elements with Font Awesome icons
function createStatElement(iconClass, text) {
    const statDiv = document.createElement('div');
    statDiv.classList.add('github-stat');
    statDiv.innerHTML = `<i class="fas ${iconClass}"></i> ${text}`;
    return statDiv;
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


      //-------TESTIMONIALS----------
      const testimonialSlider = document.getElementById('testimonials-slider');
      const testimonials = document.querySelectorAll('.testimonial');


      // Function that runs and calls buttons to toggle between
      testimonialNavButtons = document.querySelectorAll('#testimonial-nav button');
      totalTestimonials = testimonials.length;

        testimonialNavButtons.forEach((button, index) => {
              button.disabled = (index === 0)
          });
      let testimonialIndex = 0;
      const updateTestimonialSlider = () => {
          testimonialSlider.style.transform = `translateX(-${testimonialIndex * (100 / totalTestimonials)}%)`;
          testimonialNavButtons.forEach((button, index) => {
              button.disabled = (index === testimonialIndex)
          });
      }

      nextTestimonial = () => { //No error and const, let variables
          testimonialIndex = (testimonialIndex + 1) % totalTestimonials;
          updateTestimonialSlider();
      };

      prevTestimonial = () => {
          testimonialIndex = (testimonialIndex - 1 + totalTestimonials) % totalTestimonials;
          updateTestimonialSlider();
      };
    // Assigning event listeners to the buttons
     if(testimonialNavButtons[0]) // Make sure that functions are working
     {
          testimonialNavButtons[0].addEventListener('click', prevTestimonial);
          testimonialNavButtons[1].addEventListener('click', nextTestimonial);
      }
  //-------END TESTIMONIALS----------

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector("nav"); // Select the <nav> element

    // Check if menuToggle and navLinks actually exist!  Important for debugging.
    if (!menuToggle || !navLinks) {
        console.error("Error: Could not find .menu-toggle or nav elements.  Check your HTML.");
        return; // Stop execution if elements are missing
    }

    // Add click event to menu-toggle to show menu
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
});