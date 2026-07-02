// State management
let isLoggedIn = false;
let currentUser = null;
let cart = [];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const cartBtn = document.getElementById('cartBtn');
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
const loginForm = document.getElementById('loginForm');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
cartBtn.addEventListener('click', () => cartModal.show());
loginBtn.addEventListener('click', () => loginModal.show());
checkoutBtn.addEventListener('click', handleCheckout);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayRooms();
    displayMeals();
    updateCartCount();
});

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if(emailIsValid(email) & validPass(password)) {

        // Simple demo authentication
        isLoggedIn = true;
        currentUser = { email, name: email.split('@')[0] };
        loginModal.hide();
        loginBtn.textContent = `Welcome, ${currentUser.name}`;
        loginBtn.onclick = handleLogout;
        
        // Reset form
        loginForm.reset();
        
        // Refresh displays to show booking options
        displayRooms();
        displayMeals();
    }else{
        alert('Enter Valid Combination of email and password!')
    }
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPass(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/.test(password);
}


function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    loginBtn.textContent = 'Login';
    loginBtn.onclick = () => loginModal.show();
    
    // Refresh displays to hide booking options
    displayRooms();
    displayMeals();
}

// Rooms Display
function displayRooms() {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = rooms.map(room => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100">
                <img src="${room.image}" class="card-img-top" alt="${room.name}">
                <div class="card-body">
                    <h5 class="card-title">${room.name}</h5>
                    <p class="card-text">${room.description}</p>
                    <p class="card-text"><small class="text-muted">Capacity: ${room.capacity} guests</small></p>
                    <h6 class="card-subtitle mb-3 text-primary">$${room.price}/night</h6>
                    ${isLoggedIn ? `
                        <div class="date-inputs mb-3">
                            <div>
                                <label class="form-label">Check-in</label>
                                <input type="date" class="form-control" id="checkin-${room.id}" min="${new Date().toISOString().split('T')[0]}">
                            </div>
                            <div>
                                <label class="form-label">Check-out</label>
                                <input type="date" class="form-control" id="checkout-${room.id}">
                            </div>
                        </div>
                        <button onclick="bookRoom(${room.id})" class="btn btn-primary w-100">Book Now</button>
                    ` : `
                        <p class="text-muted">Please login to book</p>
                    `}
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners for date inputs
    rooms.forEach(room => {
        const checkinInput = document.getElementById(`checkin-${room.id}`);
        const checkoutInput = document.getElementById(`checkout-${room.id}`);
        
        if (checkinInput && checkoutInput) {
            checkinInput.addEventListener('change', (e) => {
                checkoutInput.min = e.target.value;
            });
        }
    });
}

// Meals Display
function displayMeals() {
    const mealsList = document.getElementById('mealsList');
    mealsList.innerHTML = meals.map(meal => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100">
                <img src="${meal.image}" class="card-img-top" alt="${meal.name}">
                <div class="card-body">
                    <h5 class="card-title">${meal.name}</h5>
                    <p class="card-text">${meal.description}</p>
                    <p class="card-text"><small class="text-muted">${meal.category}</small></p>
                    <h6 class="card-subtitle mb-3 text-primary">$${meal.price}</h6>
                    ${isLoggedIn ? `
                        <button onclick="orderMeal(${meal.id})" class="btn btn-primary w-100">Order Now</button>
                    ` : `
                        <p class="text-muted">Please login to order</p>
                    `}
                </div>
            </div>
        </div>
    `).join('');
}

// Booking Functions
function bookRoom(roomId) {
    const checkinDate = document.getElementById(`checkin-${roomId}`).value;
    const checkoutDate = document.getElementById(`checkout-${roomId}`).value;
    
    if (!checkinDate || !checkoutDate) {
        alert('Please select check-in and check-out dates');
        return;
    }

    const room = rooms.find(r => r.id === roomId);
    cart.push({
        type: 'room',
        item: room,
        dates: { checkin: checkinDate, checkout: checkoutDate }
    });
    
    updateCartCount();
    alert('Room added to cart!');
}

function orderMeal(mealId) {
    const meal = meals.find(m => m.id === mealId);
    cart.push({
        type: 'meal',
        item: meal,
        quantity: 1
    });
    
    updateCartCount();
    alert('Meal added to cart!');
}

// Cart Functions
function updateCartCount() {
    cartCount.textContent = cart.length;
}

function displayCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted">Your cart is empty</p>';
        cartTotal.textContent = '$0';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map((item, index) => {
        let itemTotal;
        if (item.type === 'room') {
            const days = Math.ceil((new Date(item.dates.checkout) - new Date(item.dates.checkin)) / (1000 * 60 * 60 * 24));
            itemTotal = item.item.price * days;
            total += itemTotal;
            
            return `
                <div class="cart-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6>${item.item.name}</h6>
                            <small class="text-muted">
                                ${item.dates.checkin} to ${item.dates.checkout}
                            </small>
                            <p class="mb-0">$${item.item.price} × ${days} nights = $${itemTotal}</p>
                        </div>
                        <button onclick="removeFromCart(${index})" class="btn btn-sm btn-danger">Remove</button>
                    </div>
                </div>
            `;
        } else {
            itemTotal = item.item.price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6>${item.item.name}</h6>
                            <p class="mb-0">$${item.item.price} × ${item.quantity} = $${itemTotal}</p>
                        </div>
                        <button onclick="removeFromCart(${index})" class="btn btn-sm btn-danger">Remove</button>
                    </div>
                </div>
            `;
        }
    }).join('');
    
    cartTotal.textContent = `$${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCart();
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    alert('Thank you for your order! This is a demo, so no actual payment will be processed.');
    cart = [];
    updateCartCount();
    cartModal.hide();
}

// Update cart display when modal is shown
document.getElementById('cartModal').addEventListener('show.bs.modal', displayCart);