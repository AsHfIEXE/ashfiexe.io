document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Toggle ---
    function toggleTheme() {
        const body = document.body;
        const button = document.querySelector(".toggle-theme");
        const icon = button.querySelector("i");

        body.classList.toggle("dark-mode");

        icon.classList.toggle("fa-sun", !body.classList.contains("dark-mode"));
        icon.classList.toggle("fa-moon", body.classList.contains("dark-mode"));
    }

    // --- GitHub Stats ---
    async function fetchGitHubStats(username) {
        const statsDiv = document.getElementById('github-stats');
        if (!statsDiv) return console.error("Error: Could not find #github-stats element.");

        statsDiv.innerHTML = '<p class="loading">Loading GitHub Stats...</p>';

        try {
            const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.github.com/users/${username}`)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch from AllOrigins: ${response.status}`);

            const json = await response.json();
            const data = JSON.parse(json.contents);
            if (!data || !data.public_repos) throw new Error("Invalid data received from GitHub API.");

            statsDiv.innerHTML = '';
            statsDiv.appendChild(createStatElement('fa-code-branch', `Public Repositories: ${data.public_repos}`));
            statsDiv.appendChild(createStatElement('fa-users', `Followers: ${data.followers}`));
            statsDiv.appendChild(createStatElement('fa-user-friends', `Following: ${data.following}`));
        } catch (error) {
            console.error("Error fetching GitHub stats:", error.message);
            statsDiv.innerHTML = `<p class="error">Failed to load GitHub stats: ${error.message}</p>`;
        }
    }

    function createStatElement(iconClass, text) {
        const p = document.createElement('p');
        const icon = document.createElement('i');
        icon.classList.add('fas', iconClass);
        p.appendChild(icon);
        p.appendChild(document.createTextNode(text));
        return p;
    }

    fetchGitHubStats('ashfiexe');

    // --- Testimonial Slider ---
    let currentTestimonial = 0;
    const testimonialsSlider = document.getElementById("testimonials-slider");
    const testimonials = document.querySelectorAll(".testimonial");
    const totalTestimonials = testimonials.length;
    const testimonialNavButtons = document.querySelectorAll('#testimonial-nav button');

    function updateSlider() {
        if (testimonialsSlider) {
            testimonialsSlider.style.transform = `translateX(-${currentTestimonial * 100}%)`;
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

    if (testimonialsSlider && totalTestimonials > 0) {
        testimonialNavButtons[0]?.addEventListener('click', prevTestimonial);
        testimonialNavButtons[1]?.addEventListener('click', nextTestimonial);
        setInterval(nextTestimonial, 5000);
    }

    // --- Header Scroll ---
    window.addEventListener('scroll', () => {
        document.querySelector('header')?.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- EmailJS Integration ---
    emailjs.init("YOUR_PUBLIC_KEY");
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const templateParams = {
                from_name: document.getElementById("name").value,
                to_name: "Salehin",
                message: document.getElementById("message").value,
                reply_to: document.getElementById("email").value
            };

            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
                .then(() => {
                    alert("Message sent successfully!");
                    contactForm.reset();
                })
                .catch(error => {
                    console.error("EmailJS Error:", error);
                    alert("Failed to send message. Please try again later.");
                });
        });
    }

    // --- Menu Toggle ---
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector("nav");
    
    menuToggle?.addEventListener("click", () => navLinks?.classList.toggle("active"));
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => navLinks?.classList.remove('active'));
    });

    // --- Abstract Shapes Animation ---
    document.querySelectorAll(".abstract-shape").forEach(shape => {
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
            direction: "alternate"
        });
    });
});
