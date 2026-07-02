LuxStay Hotel is a front-end web application that simulates a hotel booking and dining reservation system. Users can browse a selection of luxurious rooms and exquisite meals, add them to a cart after logging in, and proceed to a simulated checkout. This project is built with HTML, CSS, and vanilla JavaScript, utilizing the Bootstrap 5 framework for a responsive layout.


Dynamic Room & Dining Showcase: Loads and displays available rooms and dining options from a static data source.
User Authentication Simulation: A simple login/logout system (no backend) to enable booking functionalities. Email and password formats are validated.
Room Booking: Logged-in users can select check-in and check-out dates to book a room.
Meal Ordering: Add meals to the cart with a single click after logging in.
Shopping Cart: A fully functional cart modal allows users to view, manage, and remove items. The total cost is calculated and displayed.
Responsive Design: A mobile-first design that adapts seamlessly to various screen sizes.
Technologies Used
HTML5
CSS3
JavaScript (ES6)
Bootstrap 5
Getting Started
To run this project locally, follow these simple steps:

Clone the repository:

git clone https://github.com/avinashm17/luxstay-hotel.git
Navigate to the project directory:

cd luxstay-hotel/Hotel
Open the application: Simply open the index.html file in your web browser.

Project Structure
The project consists of four main files:

index.html: Provides the main HTML structure and layout of the web page, including the navbar, hero section, modals, and content areas.
styles.css: Contains custom CSS for styling the hero section, content cards, and other visual elements to create a unique look and feel.
data.js: Stores the sample data for hotel rooms and meals as JavaScript arrays of objects.
app.js: The core script that handles all interactivity, state management (login status, cart contents), event handling, and dynamic content rendering.
