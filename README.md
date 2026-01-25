# OCS Recruitment System

A secure, backend-driven recruitment portal built as part of the OCS assignment.  
The system models a real campus recruitment workflow with **Students**, **Recruiters**, and **Admins**, enforcing all rules on the server using a REST API.

---

## Overview

This project implements a complete recruitment system where:

- Students can view profiles, apply, and accept/reject offers
- Recruiters can create profiles and select students
- Admins have full visibility and control
- Authentication is handled using JWT
- All application rules and eligibility checks are enforced on the backend

The frontend is intentionally minimal and stateless, acting only as a client that reflects backend state.

---

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: HTML, CSS, Vanilla JavaScript
- **API Style**: REST

---

## Roles & Permissions

### Student
- View own user details
- View available profiles
- Apply to profiles
- Accept or reject selected offers
- Once an offer is accepted, the process becomes terminal

### Recruiter
- View own recruiter details
- Create and manage job/internship profiles
- View applications submitted to their profiles
- Change application status (e.g., Applied → Selected)

### Admin
- View all users, profiles, and applications
- Create profiles for any recruiter
- Change application status for any student

---

## Application Workflow

The system follows a strict backend-enforced state machine:

