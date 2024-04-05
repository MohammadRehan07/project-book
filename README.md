.Logic for computing sell count

Whenever user is purchasing the book purchase history is getting created when user purchase the book and the amount of book gets added to the total revenue of the author e.g, suppose author have total revenue of 5000 and one users come and purchase book of Rs500 then the total revenue of author will add and then the total revenue will be Rs 5500

.mechanism for sending email notification

for sending email notification i have used node mailer package to send the notification and when api gets called 100 users gets notified per minutes and this notification is gpoing in batches of 100. when i have use the setInterval function by setting its interval time to 60seconds.

.Choice made in terms of desigining database and implementation

In this project i have 4 collections. Role User Book Purchase
In Role i have created roles of admin,author and user and in User Model there is roleId field referencing to role model to identify what is the role of user. In Book i have userId which refers to user Model and only the user with role author and admin can add the book beacause i have implmented authentication and authorization there. In purchase i have UserId and BookId field where these two are referring to model user and book respectively through which we one can identify which book is purchased by which user.
