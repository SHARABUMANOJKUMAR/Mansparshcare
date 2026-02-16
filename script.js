// Mansparshcare - Main Script

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Customization ---
    const themeBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Check local storage
    const savedTheme = localStorage.getItem('mansparshcare-theme') || 'light';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('mansparshcare-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeBtn) {
            themeBtn.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    // --- Performance: Cache Selectors ---
    const navbar = document.querySelector('.navbar');
    const scrollBar = document.getElementById("scroll-bar");
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateScrollEffects() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollBar) scrollBar.style.width = scrolled + "%";

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });




    // --- Accordion Logic ---
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            const item = acc.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- Google Sheets Form Submission ---
    const form = document.getElementById("bookingForm");
    if (form) {
        const scriptURL = "https://script.google.com/macros/s/AKfycbzet52Q4rrdshivashakthimWiYTaLyV4RtTt-VMjhF7FUjAgzfS3tjq6CW1AyzV6uQAXA0ew0xOw/exec";

        form.addEventListener("submit", function (e) 
            e.preventDefault();

            const submitBtn = form.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Submitting...";

            // Show loading spinner if you have one
            // document.getElementById('loader').style.display = 'flex';

            const formData = {
                fullName: document.getElementById("fullName").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                preferredTime: document.getElementById("preferredTime").value,
                message: document.getElementById("message").value.trim()
            };

            fetch(scriptURL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        // Confetti Effect
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 }
                        });

                        alert("🌿 Your session request has been submitted successfully!");
                        form.reset();
                    } else {
                        alert("⚠ Something went wrong. Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("❌ Server error. Please try again later.");
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                });
        });
    }
});

