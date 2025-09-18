# User Stories

## Story 1 User Registration

### Front of Card
- **As a** new user  
- **I want to** register with my personal details (full name, email address, phone number, and password)  
- **So that** I can create a unique account, access the system securely, and start booking tables  

---

### Back of Card

#### Acceptance Criteria
1. Registration succeeds only when all required details are provided and valid.  
2. The system must validate the **email format** and **phone number format** before submission.  
3. Passwords must meet complexity requirements (minimum 8 characters, at least one uppercase letter, one number, and one special character).  
4. Duplicate email addresses or phone numbers must be rejected with a clear error message.  
5. Upon successful registration, the user receives a **confirmation email and/or SMS** with an activation link/code.  
6. The user account must be marked as **inactive** until the confirmation link/code is verified.  
7. Registration errors (e.g., missing fields, weak password, duplicate email) must display user-friendly error messages.  

#### Notes
- Mandatory fields: full name, email, phone number, and password.  
- Optional fields (if any, e.g., referral code) should not block registration if left blank.  
- Passwords must be stored securely (hashed & salted).  
- The system should support multiple device types (web and mobile).  

#### Constraints
- Registration must complete within **120 seconds** under normal load.  
- The system must handle at least **1000 concurrent registration requests** without failure.  
- Email/SMS delivery should occur within **30 seconds** of registration submission.  

---

## Story 2 User Login

### Front of Card
- **As a** registered user  
- **I want to** log in securely  
- **So that** I can access my personalized dashboard  

---

### Back of Card

#### Acceptance Criteria
1. Login succeeds only when the correct email/username and password are provided.  
2. Incorrect credentials must display clear and user-friendly error messages without revealing sensitive details.  
3. Passwords must be stored securely in encrypted (hashed & salted) form.  
4. A session must be created upon successful login, and session tokens should be securely generated and stored.  
5. Session timeout must occur automatically after a predefined period of inactivity (e.g., 15 minutes).  
6. Users must be able to log out manually, which should invalidate the session.  
7. Account lockout must occur after multiple failed login attempts (e.g., 5 attempts) to prevent brute-force attacks.  
8. System should provide “Forgot Password” functionality for account recovery.  

#### Notes
- Login should accept either **email** or **username** .  
- Remember-me functionality can be provided with secure persistent cookies.  
- Audit logs must record login attempts (both successful and failed) for security monitoring.  
- Two-factor authentication (2FA) can be optionally supported for enhanced security.  

#### Constraints
- Login must work seamlessly on both **web and mobile platforms**.  
- Authentication response time should be less than **3 seconds** under normal load.  
- System must handle at least **5000 concurrent login requests** without performance degradation.  

---

## Story 3 Search Restaurants

### Front of Card
- **As a** user  
- **I want to** search for restaurants by location or cuisine  
- **So that** I can find suitable dining options  

---

### Back of Card

#### Acceptance Criteria
1. Matching restaurants must be displayed with essential details such as **name, rating, cuisine type, location, price range, and availability**.  
2. If no matches exist, the system must display a clear and friendly message .  
3. Users must be able to apply filters such as **distance, cuisine type, price range, rating, and availability**.  
4. Search results must support pagination or infinite scrolling for better usability.  
5. The system must allow sorting by **relevance, rating, distance, or popularity**.  
6. If location-based search is enabled, the system must use the user’s current location (with permission) or allow manual input.  
7. Partial matches (e.g., entering “pizz” for “pizza”) should still return relevant results.  

#### Notes
- Search results should default to being sorted by **relevance** but allow users to change the sorting option.  
- Restaurants that are currently unavailable (closed or fully booked) should be indicated clearly in the results.  
- The system should provide autocomplete suggestions while typing in the search bar.  
- Multi-language support should be considered for restaurant names and cuisines.  

#### Constraints
- Search results must be returned within **3 seconds** under normal conditions.  
- The system must handle at least **10,000 concurrent search requests** without significant performance degradation.  
- Location-based search should integrate with reliable mapping APIs (e.g., Google Maps, OpenStreetMap).  

---

## Story 4 View Menus

### Front of Card
- **As a** user  
- **I want to** view restaurant menus  
- **So that** I can decide what to order before reserving  

---

### Back of Card

#### Acceptance Criteria
1. Menus must display **dish names, descriptions, prices, categories, and availability status**.  
2. Any updates made by restaurant managers (e.g., adding/removing dishes, changing availability, updating prices) must reflect **immediately** in the user interface.  
3. Menus must support categorization (e.g., Appetizers, Main Course, Desserts, Beverages).  
4. Items should display dietary labels (e.g., vegetarian, vegan, gluten-free, spicy).  
5. Search and filter options must be available within menus (e.g., filter by cuisine type, dietary preference, or price range).  
6. If an item becomes unavailable while browsing, the system must indicate it clearly in real time.  

#### Notes
- Photos of dishes are optional but strongly recommended to improve user experience.  
- High-resolution images should be optimized for fast loading.  
- Menus should support **multi-language display** if configured by the restaurant.  
- Users should be able to mark favorite dishes for quick access later.  

#### Constraints
- Menu must load in under **5 seconds** under normal conditions.  
- System should handle at least **5000 concurrent menu views** without performance issues.  
- All updates made by managers must propagate to the user interface within **2 seconds**.  

---


## Story 5 – Book a Table

### Front of Card
- *As a* user  
- *I want to* book a table by selecting date, time, and number of people  
- *So that* I can secure my dining slot  

---

### Back of Card

#### Acceptance Criteria
1. System checks real-time table availability.  
2. Each booking generates a unique reservation ID.  
3. Confirmation is sent via email/SMS/app.  

#### Notes
- Reservation ID must be searchable in the system.  

#### Constraints
- Booking must not exceed restaurant seating capacity.  


---

## Story 6 – Modify/Cancel Reservation

### Front of Card
- *As a* user  
- *I want to* modify or cancel my reservation  
- *So that* I can adjust plans if needed  

---

### Back of Card

#### Acceptance Criteria
1. Modification is allowed only before cutoff time.  
2. Cancellation must notify both user and restaurant.  

#### Notes
- Refund policies may apply for cancellations.  

#### Constraints
- Modifications must be processed within *5 seconds*.  


---

## Story 7 – Booking Confirmation

### Front of Card
- *As a* user  
- *I want to* receive booking confirmations by giving tokens  
- *So that* I have proof of my reservation  

---

### Back of Card

#### Acceptance Criteria
1. Confirmation message is sent immediately after token payment.  
2. Message contains reservation ID, date, time, and restaurant details.  
3. Token payment must be logged and linked to the reservation.  

#### Notes
- Reservation ID must remain searchable in the system.  
- Token policies (refundable/non-refundable) may vary per restaurant.  

#### Constraints
- Notifications must be delivered via at least *two channels* (email + SMS).  
- Token validation must complete within *3 seconds* to confirm booking.  


---

## Story 8 – Reservation Reminder

### Front of Card
- *As a* user  
- *I want to* receive reminders before my booking  
- *So that* I do not forget my reservation  

---

### Back of Card

#### Acceptance Criteria
1. Reminder sent *X hours* before scheduled time.  
2. Includes booking details and restaurant contact.  

#### Constraints
- Reminders must not be missed during system outages.