### Scrape Apple's Refurbished Page using Lambda

This project scrapes the Apple Refurbished page and sends a text message when specified conditions are satisfied.  This is a MVP implementation and uses a brute force methodology to get this to work.  To limit daily reminders you'd need a persistent tracking mechninism for previously recorded (daily/weekly) notifications. 

You'll need an environment variable named `PhoneNumber` in AWS Lambda for this script to work appropriately.
