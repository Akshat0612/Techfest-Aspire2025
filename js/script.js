document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open');
        });
    }

    // --- Code for Lightbox Gallery ---
    const galleryLinks = document.querySelectorAll('.photo-gallery a');
    let lightboxOverlay = null;

    galleryLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Stop the link from opening in a new page

            const imgSrc = this.href;
            const imgCaption = this.dataset.caption || '';

            // Create the lightbox HTML
            lightboxOverlay = document.createElement('div');
            lightboxOverlay.classList.add('lightbox-overlay');
            lightboxOverlay.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="${imgSrc}" class="lightbox-image" alt="${imgCaption}">
                <p class="lightbox-caption">${imgCaption}</p>
            </div>
        `;

            document.body.appendChild(lightboxOverlay);

            // Show the lightbox with a slight delay for the transition
            setTimeout(() => {
                lightboxOverlay.classList.add('visible');
            }, 10);

            // Add event listeners to close the lightbox
            lightboxOverlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            lightboxOverlay.addEventListener('click', (e) => {
                if (e.target === lightboxOverlay) {
                    closeLightbox();
                }
            });
        });
    });

    function closeLightbox() {
        if (lightboxOverlay) {
            lightboxOverlay.classList.remove('visible');
            // Remove from DOM after transition ends
            lightboxOverlay.addEventListener('transitionend', () => {
                if (lightboxOverlay) {
                    lightboxOverlay.remove();
                    lightboxOverlay = null;
                }
            }, { once: true });
        }
    }
    // --- Code for the REGISTRATION PAGE (register.html) ---
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            const selectedEvents = [];
            document.querySelectorAll('input[name="events"]:checked').forEach((checkbox) => {
                selectedEvents.push(checkbox.value);
            });

            if (!fullName || !email || selectedEvents.length === 0) {
                alert('Please fill in your name, email, and select at least one event.');
                return;
            }

            const registrationData = {
                id: Date.now(), // Unique ID for each registration
                name: fullName,
                email: email,
                phone: phone,
                events: selectedEvents
            };

            let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
            registrations.push(registrationData);
            localStorage.setItem('registrations', JSON.stringify(registrations));

            alert('Registration Successful!');
            window.location.href = 'my-registrations.html';
        });
    }


    // --- Code for the MY REGISTRATIONS PAGE (my-registrations.html) ---
    const registrationsContainer = document.getElementById('registrations-container');

    if (registrationsContainer) {
        displayRegistrations(); // Call function to display registrations

        // NEW: Use event delegation to handle clicks on delete buttons
        registrationsContainer.addEventListener('click', function (event) {
            // Check if the clicked element has the 'delete-btn' class
            if (event.target.classList.contains('delete-btn')) {
                // Get the unique ID from the button's data-id attribute
                const registrationId = event.target.dataset.id;
                // Ask for confirmation before deleting
                if (confirm('Are you sure you want to delete this registration?')) {
                    deleteRegistration(registrationId);
                }
            }
        });
    }
});

// NEW: Function to display registrations on the page
function displayRegistrations() {
    const registrationsContainer = document.getElementById('registrations-container');
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];

    registrationsContainer.innerHTML = ''; // Clear existing content to prevent duplicates

    if (registrations.length > 0) {
        registrations.forEach(reg => {
            const card = document.createElement('div');
            card.classList.add('registration-card');

            // Add a delete button with a data-id attribute to identify the registration
            card.innerHTML = `
                <button class="delete-btn" data-id="${reg.id}" title="Delete Registration">&times;</button>
                <h3>${reg.name}</h3>
                <p><strong>Email:</strong> ${reg.email}</p>
                <p><strong>Phone:</strong> ${reg.phone}</p>
                <p class="events"><strong>Events:</strong> ${reg.events.join(', ')}</p>
            `;

            registrationsContainer.appendChild(card);
        });
    } else {
        registrationsContainer.innerHTML = '<p>You have not registered for any events yet. Please go to the Register page to sign up!</p>';
    }
}

// NEW: Function to delete a registration by its ID
function deleteRegistration(id) {
    let registrations = JSON.parse(localStorage.getItem('registrations')) || [];

    // Filter the array, keeping only the registrations that DO NOT match the ID
    registrations = registrations.filter(reg => reg.id != id);

    // Save the updated (smaller) array back to localStorage
    localStorage.setItem('registrations', JSON.stringify(registrations));

    // Re-display the registrations to show the change immediately
    displayRegistrations();
}