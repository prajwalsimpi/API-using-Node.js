# Nurturelabs-Backend-Intern-Assignments
Assignment for my internship application 
Backend API application created using node 

**Accepts and Responds JSON requests**

Run the app using the command 

__npm init__


__nodemon app__


heroku URL : 
https://nurturelabs-intern-assignment.herokuapp.com/

append the following routes to test the API:

API: Add an advisor
--- /admin/advisor/

API: Register as a user
--- /user/register/

API: Log in as a user
--- /user/login/

API: Get the list of advisors
--- /user/<-user-id->/advisor

    ex : /user/Tony/advisor
  
API: Can book call with an advisor
--- /user/<-user-id->/advisor/<-advisor-id->/

    ex : /user/Tony/advisor/Sam/
  
API: Get all the booked calls
--- /user/<-user-id->/advisor/booking/

    ex : /user/Tony/advisor/booking/


__Use postman to observe the JSON responses and send JSON requests__


***Look into the app.js file for dummy data (userData, bookingData, advisorData) for testing***
