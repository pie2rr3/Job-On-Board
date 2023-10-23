# Job-On-Board

Welcome to Job On Board, your one-stop destination for job opportunities. We are committed to helping you find your dream job in France.

## Table of Contents
1. [Summary](#summary)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
    - [Home Page](#home-page)
    - [Job Offer Page](#job-offer-page)
    - [Profile Page](#profile-page)
    - [Company Page](#company-page)
    - [Administration Page](#administration-page)
4. [Getting Started](#getting-started)

## Summary

**Job-On-Board** is an online job platform that exclusively serves the French job market. Our platform connects job seekers with their dream jobs by providing a comprehensive catalog of job listings. Job seekers can create profiles, view and apply to job offers, and track their application status. Employers can create and manage their job listings, view applicant details, and update job status.

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js with Express.js for the API
- **Database:** PostgreSQL via Prisma ORM, hosted in the cloud with Neon.db

## Features

### Home Page

The **Home Page** is the entry point to the application. It showcases the application logo and our slogan. Here, you can find the three latest job listings, sorted from most recent to oldest. 

- Clicking on "Learn More" for a job listing displays:
    - Full job description
    - Salary information
    - Department
    - Location of the job
    - Working time
    - Publication date (in French timezone)
  
- Clicking "Hide" hides the additional information, leaving only the job title and a brief description.

- Clicking "Apply" (also available without clicking "Learn More") opens a form for job application. It displays "Submit" and "Cancel" buttons. To use the "Apply" feature, a user profile must be logged in.

### Job Offer Page

The **Job Offer Page** is where you can find your dream job based on various filters:

- Keyword search
- Salary range
- Work time (Full time, Part time, Remote, or all)
- Department

Clicking the "Search" button filters job listings based on the selected criteria. Job listings are displayed from most recent to oldest, with the same information available as on the Home Page.

By default, all job listings are shown.

### Profile Page

The **Profile Page** allows users to log in or create a user profile by providing:

- Name
- Department
- Email
- Phone
- Password

Users can modify their:
- Name
- Department
- Email
- Phone

Using the "Edit" button. Users can also log out ("Disconnect") or delete their account ("Delete").

If a user has applied for jobs, they can view their applications' status and messages sent by clicking "Learn More" on job listings. If a user is associated with a company, this information will be displayed on their profile.

### Company Page

The **Company Page** allows users to create a company profile by providing:

- Name
- Department
- Password

Users can log in with their email and password. This page also enables companies to create, modify, and delete job listings, as well as manage job applications by changing their status (pending, rejected, accepted).

### Administration Page

The **Administration Page** is only available to the admin user. The admin has full control over user accounts, company profiles, job listings, and application messages. They can create, modify, and delete all these elements.

## Getting Started

To launch the application, follow these steps:

1. Navigate to the "back" directory using the command `cd back`.
2. Run `npm i` to install the necessary dependencies.
3. Navigate to the "src" directory and launch the server with the command `ts-node index.ts`.
4. Go to the "front" directory and open the "index.html" file in a web browser.

Enjoy using Job-On-Board to find your dream job or recruit the ideal candidate for your company!
