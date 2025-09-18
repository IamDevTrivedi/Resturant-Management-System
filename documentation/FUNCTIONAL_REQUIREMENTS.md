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


6.  *Table Management*
   - *Description:* Restaurant owners must be able to configure and update table arrangements to optimize seating.  
   - *Actors:* Restaurant Owner  
   - *Details:*  
     - Owners can add, update, or remove tables in their restaurant.  
     - Owners can specify table capacity (e.g., 2-seater, 4-seater).  
     - The system should automatically update availability when reservations are made.  

7. *Customer Notifications and Reminders*  
   - *Description:* The system should notify customers about reservation confirmations, cancellations, or reminders.  
   - *Actors:* Customer, System  
   - *Details:*  
     - Send real-time notifications via email/SMS/app for booking confirmations and cancellations.  
     - Send reminders before the reservation time.  
     - Notify in case of restaurant-initiated changes.  

8. *Payment and Refund Management*  
   - *Description:* The system must handle secure payments and refund processing for reservations.  
   - *Actors:* Customer, System  
   - *Details:*  
     - Customers can pay securely using integrated payment gateways (e.g., Stripe/PayPal).  
     - Refunds must be processed automatically in case of cancellations (as per policy).  
     - The system should keep a transaction history for each customer.  

9. *Reviews and Ratings*  
   - *Description:* Customers must be able to rate and review restaurants after completing a reservation.  
   - *Actors:* Customer  
   - *Details:*  
     - Customers can submit reviews with star ratings and comments.  
     - Reviews are linked to completed reservations only (to prevent fake reviews).  
     - Average ratings should be displayed on restaurant profiles.  

10. *Analytics Dashboard for Restaurant Owners*  
   - *Description:* Restaurant owners should be able to view insights about their reservations and performance.  
   - *Actors:* Restaurant Owner  
   - *Details:*  
     - Dashboard shows metrics like total reservations, peak booking times, cancellation rates.  
     - Graphs/charts for tracking trends (weekly, monthly).  
     - Helps owners optimize operations and marketing.  

11. *Waitlist and Walk-in Management*  
   - *Description:* Customers should be able to join a waitlist if no tables are available, and owners should manage walk-ins.  
   - *Actors:* Customer, Restaurant Owner  
   - *Details:*  
     - Customers can request to be added to a waitlist for a specific time slot.  
     - Owners can mark walk-in reservations in the system.  
     - The system should notify customers automatically if a table becomes available.  

12. *Multi-Device Responsiveness*  
   - *Description:* The system must be accessible and functional across web and mobile devices.  
   - *Actors:* Customer, Restaurant Owner  
   - *Details:*  
     - Responsive UI/UX design.  
     - Consistent performance on desktop, tablet, and mobile.  
     - Cross-browser compatibility.  

13. *Admin Management (Super Admin)*  
   - *Description:* A super admin must be able to oversee the platform and handle disputes.  
   - *Actors:* Admin  
   - *Details:*  
     - Approve or verify restaurant owner accounts.  
     - Monitor customer and owner activity.  
     - Resolve payment/refund disputes.  
     - Handle reports of inappropriate reviews or fake restaurants.
