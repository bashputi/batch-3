# Car Rental Reservation System Backend

[Live Demo](https://car-rental-reservation-psi.vercel.app)

## Introduction
Welcome to Car Rental Reservation System Backend. This project is crafted to streamline the management of car rental operations, with a focus on robust error handling, comprehensive CRUD functionalities, secure authentication, and efficient transaction management. By leveraging modern web technologies, this system ensures seamless user interactions and administrative oversight, catering to the needs of both customers and administrators.

### Features


### Admin Actions:
#### Car Management:
- Create new car entries
- Update existing car information
- Perform soft deletes on cars

#### Booking Oversight:
- View all ongoing and past bookings
- Calculate total cost for completed rentals

### User Actions:
#### Book a Ride:
- Book a car by entering `carId` and `startTime`

#### Rental History:
- Access booking history

## Technologies
- Node.js
- Express.js
- Mongoose
- JWT for authentication
- TypeScript
- Zod for validation

## Installation

1. Clone the repository:

```bash 
git clone https://github.com/bashputi/car_rental_reservation.git
cd car_rental_reservation
```

2. Install dependencies:

```bash 
npm install
```

3. Set up environment variables. Create a `.env` file in the root directory and add the following:

```bash 
MONGO_URI=mongodb://localhost:27017/car_rental
JWT_SECRET=your_jwt_secret
```

4. Start the development server:
```bash 
npm start
```

## Configuration
Ensure you have MongoDB running locally or provide a connection string to a MongoDB instance.

## API Endpoints

# Auth
- POST/api/auth/signup - Register a new user/admin
- POST/api/auth/signin - Login a user/admin

# Cars
- POST/api/cars- Create a new car (Admin)
- GET/api/cars - Get all cars
- GET/api/cars/:id - Get car by ID
- PUT/api/cars/:id - Update car details (Admin)
- DELETE/api/cars/:id - Soft delete a car (Admin)

# Bookings
- POST/api/bookings - Create a new booking (User)
- GET/api/bookings - Get all bookings (Admin)
    - Query Parameters: 
        - `carId`: ID of the car for which availability needs to be checked.
        - `date : The specific data for which availability needs to be checked (formate: YYYY-MM-DD).
        - Example Request: `   /api/bookings?carId=608a6d8d03a1b40012abcdef&date=2024-06-15 `
- GET/api/bookings/:id - Get booking by ID (Admin/User)
- GET/api/bookings/my-bookings - Get the logged-in user's bookings (User)
- Put/api/bookings/:id/return - Return a car and calculate the total cost (Admin)

# Authentication & Authorization
- Authentication: Implemented using JWT. Include the token in the `Authorization` header as `Bearer <token>`.
- Authorization: Middleware to check user roles and permissions.


