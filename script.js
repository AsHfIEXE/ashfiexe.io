document.addEventListener('DOMContentLoaded', () => {
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

    const themeButton = document.querySelector(".toggle-theme");
    if (themeButton) {
        themeButton.addEventListener("click", toggleTheme);
    }

    // GitHub Stats Fetching with Authenticated API Calls
    async function fetchGitHubStats(username) {
        const statsContainer = document.querySelector(".github-stats-container");
        if (!statsContainer) {
            console.error("Error: .github-stats-container element not found.");
            return;
        }

        // GitHub Personal Access Token (replace with your token)
        const token = "ithub_pat_11A5SP2IQ0moKOCN8JM6Xj_YTY4QDdU0UF77e0qtPeoj7kki1EqfgBhcoOZt9W7d9EXXPANH7MC44RkCOM";
        const headers = {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json"
        };

        // Basic Stats Card
        const basicStatsDiv = document.createElement("div");
        basicStatsDiv.className = "github-stats-card";
        basicStatsDiv.innerHTML = '<p class="loading">Loading Basic Stats...</p>';
        statsContainer.appendChild(basicStatsDiv);

        try {
            const url = `https://api.github.com/users/${username}`;
            const response = await fetch(url, { headers });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("GitHub API rate limit exceeded. Please try again later.");
                }
                throw new Error(`Network error: ${response.status}`);
            }

            const data = await response.json();

            if (!data || !data.public_repos) {
                throw new Error("Invalid GitHub API response");
            }

            basicStatsDiv.innerHTML = "<h4>GitHub Stats</h4>";
            basicStatsDiv.appendChild(createStatElement("fa-code-branch", `Public Repos: ${data.public_repos}`));
            basicStatsDiv.appendChild(createStatElement("fa-users", `Followers: ${data.followers}`));
            basicStatsDiv.appendChild(createStatElement("fa-user-friends", `Following: ${data.following}`));
        } catch (error) {
            console.error("Error fetching GitHub stats:", error.message);
            basicStatsDiv.innerHTML = `<p class="error">Failed to load stats: ${error.message}</p>`;
        }

        // Top Languages Card
        const langsDiv = document.createElement("div");
        langsDiv.className = "github-stats-card";
        langsDiv.innerHTML = '<p class="loading">Loading Top Languages...</p>';
        statsContainer.appendChild(langsDiv);

        try {
            // Check cache
            const cacheKey = `github-langs-${username}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const cacheData = JSON.parse(cached);
                if (Date.now() - cacheData.timestamp < 3600000) { // 1-hour cache
                    langsDiv.innerHTML = "<h4>Top Languages</h4>";
                    cacheData.languages.forEach(([lang, bytes]) => {
                        langsDiv.appendChild(createStatElement("fa-code", `${lang}: ${Math.round(bytes / 1024)} KB`));
                    });
                    return;
                }
            }

            const reposUrl = `https://api.github.com/users/${username}/repos`;
            const reposResponse = await fetch(reposUrl, { headers });

            if (!reposResponse.ok) {
                if (reposResponse.status === 429) {
                    throw new Error("GitHub API rate limit exceeded. Please try again later.");
                }
                throw new Error(`Network error: ${reposResponse.status}`);
            }

            const repos = await reposResponse.json();

            // Limit to 5 repos to reduce API calls
            const reposToFetch = repos.slice(0, 5);
            const languageStats = {};

            for (const repo of reposToFetch) {
                const langUrl = `https://api.github.com/repos/${username}/${repo.name}/languages`;
                try {
                    const langResponse = await fetch(langUrl, { headers });
                    if (!langResponse.ok) {
                        if (langResponse.status === 429) {
                            throw new Error("GitHub API rate limit exceeded for languages.");
                        }
                        continue;
                    }

                    const langs = await langResponse.json();

                    for (const [lang, bytes] of Object.entries(langs)) {
                        languageStats[lang] = (languageStats[lang] || 0) + bytes;
                    }
                } catch (error) {
                    console.warn(`Failed to fetch languages for repo ${repo.name}: ${error.message}`);
                    continue;
                }
            }

            if (Object.keys(languageStats).length === 0) {
                throw new Error("No language data available from repositories.");
            }

            // Sort languages by usage
            const sortedLangs = Object.entries(languageStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5); // Top 5 languages

            // Cache the results
            localStorage.setItem(cacheKey, JSON.stringify({
                languages: sortedLangs,
                timestamp: Date.now()
            }));

            langsDiv.innerHTML = "<h4>Top Languages</h4>";
            sortedLangs.forEach(([lang, bytes]) => {
                langsDiv.appendChild(createStatElement("fa-code", `${lang}: ${Math.round(bytes / 1024)} KB`));
            });
        } catch (error) {
            console.error("Error fetching top languages:", error.message);
            langsDiv.innerHTML = `<p class="error">Unable to load languages: ${error.message}</p>`;
        }

        // Contributions Placeholder
        const contribDiv = document.createElement("div");
        contribDiv.className = "github-stats-card";
        contribDiv.innerHTML = "<h4>GitHub Streak</h4><p>Contributions data unavailable due to GitHub API limitations.</p>";
        statsContainer.appendChild(contribDiv);
    }

    function createStatElement(iconClass, text) {
        const p = document.createElement("p");
        const icon = document.createElement("i");
        icon.classList.add("fas", iconClass);
        p.appendChild(icon);
        p.appendChild(document.createTextNode(` ${text}`));
        return p;
    }

    fetchGitHubStats("AsHfIEXE");

    // Hire Me Button Toggle
    const hireMeButton = document.querySelector(".hire-me");
    const hireMeDropdown = document.querySelector(".hire-me-dropdown");

    if (hireMeButton && hireMeDropdown) {
        hireMeButton.addEventListener("click", () => {
            hireMeDropdown.classList.toggle("active");
        });

        document.addEventListener("click", (event) => {
            if (!hireMeButton.contains(event.target) && !hireMeDropdown.contains(event.target)) {
                hireMeDropdown.classList.remove("active");
            }
        });
    }

    // Testimonials Drag and Navigation
    const slider = document.querySelector('#testimonials-slider');
    const container = document.querySelector('#testimonials-container');
    const prevBtn = document.querySelector('#testimonial-nav button:first-child');
    const nextBtn = document.querySelector('#testimonial-nav button:last-child');

    if (slider && container && prevBtn && nextBtn) {
        let isDragging = false;
        let startX;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let currentIndex = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        const totalTestimonials = testimonials.length;

        const updateButtons = () => {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalTestimonials - 1;
        };

        const calculateOffset = (index) => {
            const containerWidth = container.offsetWidth;
            const testimonialWidth = testimonials[0].offsetWidth;
            const gap = 24;
            const totalWidth = testimonialWidth + gap;
            const offset = -index * totalWidth + (containerWidth - testimonialWidth) / 2;
            return offset;
        };

        const slideTo = (index) => {
            currentIndex = Math.max(0, Math.min(index, totalTestimonials - 1));
            currentTranslate = calculateOffset(currentIndex);
            prevTranslate = currentTranslate;
            slider.style.transform = `translateX(${currentTranslate}px)`;
            updateButtons();
        };

        const setPositionByIndex = () => {
            slider.style.transition = 'transform 0.6s ease-in-out';
            slideTo(currentIndex);
        };

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            container.style.cursor = 'grabbing';
            slider.style.transition = 'none';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = (x - startX) * 1.2;
            currentTranslate = prevTranslate + walk;
            slider.style.transform = `translateX(${currentTranslate}px)`;
        });

        container.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            container.style.cursor = 'grab';
            const containerWidth = container.offsetWidth;
            const testimonialWidth = testimonials[0].offsetWidth;
            const gap = 24;
            const totalWidth = testimonialWidth + gap;
            const movedBy = currentTranslate - prevTranslate;

            const threshold = containerWidth / 4;
            if (movedBy < -threshold && currentIndex < totalTestimonials - 1) {
                currentIndex += 1;
            } else if (movedBy > threshold && currentIndex > 0) {
                currentIndex -= 1;
            }

            setPositionByIndex();
        });

        container.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
                setPositionByIndex();
            }
        });

        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            slider.style.transition = 'none';
        });

        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 1.2;
            currentTranslate = prevTranslate + walk;
            slider.style.transform = `translateX(${currentTranslate}px)`;
        });

        container.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            const containerWidth = container.offsetWidth;
            const testimonialWidth = testimonials[0].offsetWidth;
            const gap = 24;
            const movedBy = currentTranslate - prevTranslate;
            const threshold = containerWidth / 4;

            if (movedBy < -threshold && currentIndex < totalTestimonials - 1) {
                currentIndex += 1;
            } else if (movedBy > threshold && currentIndex > 0) {
                currentIndex -= 1;
            }

            setPositionByIndex();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex -= 1;
                setPositionByIndex();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalTestimonials - 1) {
                currentIndex += 1;
                setPositionByIndex();
            }
        });

        updateButtons();
        setPositionByIndex();

        window.addEventListener('resize', () => {
            setPositionByIndex();
        });
    }

    // Header Scroll Effect
    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }
    });

    // EmailJS Integration
    emailjs.init("YOUR_PUBLIC_KEY");

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

            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
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
    const nav = document.querySelector("nav");

    if (menuToggle && nav) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            nav.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", !isExpanded);
            menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
            menuToggle.querySelector("i").classList.toggle("fa-bars", isExpanded);
            menuToggle.querySelector("i").classList.toggle("fa-times", !isExpanded);
        });

        // Close menu when a nav link is clicked
        document.querySelectorAll("nav a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
                menuToggle.querySelector("i").classList.add("fa-bars");
                menuToggle.querySelector("i").classList.remove("fa-times");
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", (event) => {
            if (!nav.contains(event.target) && !menuToggle.contains(event.target) && nav.classList.contains("active")) {
                nav.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
                menuToggle.querySelector("i").classList.add("fa-bars");
                menuToggle.querySelector("i").classList.remove("fa-times");
            }
        });
    }

    // Abstract Shapes Animation
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