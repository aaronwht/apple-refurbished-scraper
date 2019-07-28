### Scrape Apple's Refurbished Page using AWS Lambda

[Contact me](https://www.aaronwht.com/contact-me) if you run into problems using this code.  

This project scrapes the Apple Refurbished page and sends a text message when specified conditions are satisfied.  This is a MVP implementation and uses a brute force methodology for 
functionality.  To limit daily reminders you'd need a persistent tracking mechanism for previously recorded (daily/weekly) notifications. 

You'll also need to add an environment variable named `PhoneNumber` in AWS Lambda for this script to work appropriately.
