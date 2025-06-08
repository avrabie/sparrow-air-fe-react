# Airline Management System

## Overview
The Airline Management System is a comprehensive web application designed to streamline and optimize airline operations. Built with React and Vite, this modern application provides a user-friendly interface for managing various aspects of airline operations.

## Features

### Flight Management
- Schedule and track flights with real-time updates
- View detailed information about aircraft types
- Monitor flight status and performance metrics

### Passenger Services
- Streamline check-in and boarding processes
- Manage passenger information and bookings
- Enhance the overall passenger experience

### Crew Management
- Optimize crew scheduling and assignments
- Track crew certifications and qualifications
- Ensure compliance with regulatory requirements

### Maintenance Tracking
- Monitor aircraft maintenance schedules
- Track maintenance history and upcoming requirements
- Ensure aircraft safety and compliance

## Aircraft Types Database
The system includes a comprehensive database of aircraft types with detailed information including:
- Model name and manufacturer
- ICAO code
- Seating capacity
- Maximum range
- Technical specifications

## Technical Implementation
- Built with React and Vite for optimal performance
- Responsive design for desktop and mobile devices
- Dark mode support for user preference
- RESTful API integration for data management

## Backend Integration
The following operations have been integrated with the backend:
- Aircraft Type management

## Performance Metrics
- 99.8% On-time Performance
- Serving 500+ Airlines Worldwide
- 24/7 Customer Support

## Environment Profiles
The application supports different environment profiles for connecting to different backend servers:

- **Development**: Uses `http://localhost:8080` as the backend API URL
- **Production**: Uses `http://192.168.0.47:8080` as the backend API URL

You can customize these URLs by modifying the `.env` and `.env.production` files in the project root.

## Getting Started
1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server:
   - For local development: `npm run dev` (uses localhost:8080 as backend)
   - For production environment: `npm run dev:prod` (uses 192.168.0.47:8080 as backend)
4. Access the application at `http://localhost:5173` on the local machine
5. To access from other computers on the same network:
   - Find your computer's IP address (e.g., using `ipconfig` on Windows or `ifconfig` on Mac/Linux)
   - Other computers can access the application at `http://<your-ip-address>:5173`
   - Make sure your firewall allows connections to port 5173
   - When accessing from another computer, use `npm run dev:prod` to ensure the backend URL is correctly set

## Technologies Used
- React
- React Router
- Vite
- FontAwesome
- CSS3
