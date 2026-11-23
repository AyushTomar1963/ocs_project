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


---

## Configuration

Copy `.env.example` to `.env` and fill in the values. `JWT_SECRET` is required (32+ characters): the server
refuses to start without it, so no default secret lives in the source. Generate one with:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

If an earlier version was deployed, set a **new** `JWT_SECRET` there. The old built-in value is public in the git
history and must be treated as compromised. Changing the secret signs every user out.
