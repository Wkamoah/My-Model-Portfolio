document.addEventListener('DOMContentLoaded', function() {
    const bookingsLink = document.querySelector('nav ul li a[href="components/bookings.html"]');
    
    bookingsLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'components/bookings.html';
    });
});