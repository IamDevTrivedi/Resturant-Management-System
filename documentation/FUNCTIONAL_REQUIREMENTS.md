# Functional Requirements

1.  *User Authentication*
    *   *Description:* The system must provide a secure way for both customers and restaurant owners to create accounts, log in, and log out.
    *   *Actors:* Customer, Restaurant Owner
    *   *Details:*
        *   Customers should be able to register with their name, email, and password.
        *   Restaurant owners should have a separate registration process.
        *   The system should authenticate users before granting access to protected features.

2.  *Restaurant Discovery and Search*
    *   *Description:* Customers must be able to find and view details of available restaurants.
    *   *Actors:* Customer
    *   *Details:*
        *   Display a list of all restaurants.
        *   Allow customers to search for restaurants by name.
        *   Allow customers to browse restaurant details, including location, cuisine, menus, and images.

3.  *Table Reservation*
    *   *Description:* Customers must be able to make a reservation at a selected restaurant.
    *   *Actors:* Customer
    *   *Details:*
        *   Customers can select a date, time, and the number of guests.
        *   The system should check for table availability based on the restaurant's configuration.
        *   A secure token payment is required to confirm the reservation.
        *   Customers should receive a confirmation of their booking.

4.  *Restaurant Profile Management*
    *   *Description:* Restaurant owners must be able to manage their restaurant's profile.
    *   *Actors:* Restaurant Owner
    *   *Details:*
        *   Owners can add a new restaurant profile with details like name, location, cuisine, and contact information.
        *   Owners can upload and update menus and images.
        *   Owners can define opening hours and table configurations.
        *   Owners can update or delete their restaurant profile.

5.  *Reservation Management*
    *   *Description:* Restaurant owners must be able to view and manage incoming reservations.
    *   *Actors:* Restaurant Owner
    *   *Details:*
        *   Display a list of all reservations for the owner's restaurant.
        *   The list should include customer details, date, time, and number of guests.
        *   Owners can update the status of a reservation (e.g., Confirmed, Canceled, Completed).