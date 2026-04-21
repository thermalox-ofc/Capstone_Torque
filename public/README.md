# Torque Garage Public Prototype

This project is a browser-based automotive service management prototype built from static frontend assets in the [`public/`](/Users/beofam/Downloads/automotive-repair-management-system-main/public) folder. It provides a role-based demo experience for `admin`, `operator`, and `customer` users using `HTML`, `CSS`, `JavaScript`, and `localStorage` persistence, with no backend or installation required for local use.

## Table of Contents

- [Introduction](#introduction)
- [Why This Project](#why-this-project)
- [Goals](#goals)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Data Model Overview](#data-model-overview)
- [Getting Started](#getting-started)
- [Workflow Summary](#workflow-summary)
- [Notes and Limitations](#notes-and-limitations)

## Introduction

### About This Project

Torque Garage is a front-end prototype for an automotive repair workflow. It simulates how a small repair shop can manage:

- customer profiles
- vehicle records
- appointment intake
- operator assignment
- work-order status progression
- inventory tracking
- customer-facing service visibility

The prototype is intentionally self-contained. All app state is stored in the browser with `localStorage`, making it easy to demo, test, and iterate on workflow behavior without needing a Flask backend, database server, or deployment pipeline.

### Live Prototype Style

The UI follows a warm industrial service-desk style with:

- frosted glass panels
- rounded forms and cards
- responsive layout for desktop and mobile
- role-aware navigation and content visibility

## Why This Project

Many auto shop workflows are still spread across phone calls, whiteboards, paper tickets, and disconnected spreadsheets. This prototype brings those concepts into one place so we can validate the user experience and service lifecycle before wiring it into a full backend.

It helps demonstrate:

- role-based access for shop staff and customers
- a guided appointment-to-service workflow
- front-end validation rules
- customer-safe status messaging
- inventory and service tracking behavior

## Goals

- Provide a realistic browser-based MVP for an automotive repair workflow
- Let admins, operators, and customers interact with role-specific views
- Persist records after refresh using `localStorage`
- Validate business rules like VIN format, required fields, booking conflicts, and positive mileage
- Serve as a clean public prototype that can later connect to a backend implementation

## Key Features

### 1. Role-Based Access

The prototype supports three demo roles:

- `admin`
- `operator`
- `customer`

Each role sees only the tools relevant to that workflow.

#### Admin Capabilities

- create, edit, and delete customer profiles
- register and update vehicles
- edit inventory items including stock and price
- search customers, vehicles, and work-related records
- monitor low-stock inventory
- assign appointments to operators and bays
- review operator completion progress

#### Operator Capabilities

- view only operator-relevant records
- update vehicle mileage and diagnostic codes
- work from assigned jobs instead of creating manual work orders
- move service progress through active statuses

#### Customer Capabilities

- sign in to a customer portal
- add a vehicle before booking
- book appointments
- see appointment IDs and visit updates
- cancel only valid future appointments
- change password

### 2. Appointment and Service Workflow

The current public prototype models a structured service flow:

1. Customer or admin creates an appointment
2. System generates a unique appointment ID
3. Admin assigns operator and bay
4. Linked work order is tracked against the appointment
5. Operator starts and updates the job
6. Operator marks the service completed
7. Admin reviews and finalizes the job
8. Customer sees pickup-ready messaging only when appropriate

Supported statuses include:

- `PENDING_APPROVAL`
- `ASSIGNED`
- `IN_PROGRESS`
- `WAITING_FOR_PARTS`
- `WAITING_FOR_APPROVAL`
- `ON_HOLD`
- `WORK_COMPLETED`
- `VERIFIED`
- `READY_FOR_PICKUP`
- `COMPLETED`

### 3. Vehicle and Customer Management

The admin workflow supports:

- customer creation and editing
- customer deletion with password confirmation
- vehicle registration and update
- VIN validation
- required field validation
- protection against invalid mileage values

The operator workflow is intentionally narrower:

- no customer profile access
- no vehicle deletion
- update only mileage and diagnostic codes

### 4. Inventory Management

The admin inventory section supports:

- parts list rendering
- current stock tracking
- reorder threshold display
- low-stock alert metrics
- editing part quantity, reorder point, and unit price

Demo data includes realistic items such as:

- spark plugs
- engine oil
- coolant
- filters
- brake pads
- wiper blades
- batteries
- serpentine belts

### 5. Customer Portal Experience

The customer portal includes:

- account summary
- password change
- vehicle registration
- appointment booking
- visit status updates
- maintenance checklist suggestions

Customer-facing messaging is intentionally simplified so internal operator/admin workflow details are not exposed unnecessarily.

### 6. Persistence and Validation

The prototype includes:

- `localStorage` persistence for app data and auth state
- required field validation
- invalid VIN blocking
- negative mileage prevention
- admin password confirmation before destructive delete actions
- session timeout tracking with optimized persistence writes

## Tech Stack

### Frontend

- `HTML5`
- `CSS3`
- `Vanilla JavaScript (ES6+)`
- `localStorage`

### Design

- custom CSS variables
- responsive grid and panel layout
- no frontend build step

### Runtime

- any modern browser
- no package installation required

## Architecture

This public version is a static frontend prototype rather than a backend SaaS deployment.

### High-Level Architecture

```text
┌────────────────────────────────────────────┐
│                Browser Runtime             │
│     HTML · CSS · Vanilla JavaScript        │
└──────────────────────┬─────────────────────┘
                       │
┌──────────────────────┴─────────────────────┐
│              Application UI                 │
│  Login · Dashboard · Customer Portal        │
│  Admin Views · Operator Views · Inventory   │
└──────────────────────┬─────────────────────┘
                       │
┌──────────────────────┴─────────────────────┐
│             Client-Side State               │
│  localStorage-backed records + auth         │
│  users · customers · vehicles               │
│  appointments · workOrders · inventory      │
└────────────────────────────────────────────┘
```

### State Management Approach

The prototype uses a single browser-side state object loaded from `localStorage` and normalized on startup. UI rendering functions update sections of the DOM based on:

- active session role
- saved records
- appointment/work-order status
- validation and visibility rules

## Project Structure

```text
public/
├── index.html                    # Main app entry using external CSS/JS
├── torque-garage-prototype.html  # Alternate entry wired to same assets
├── style.css                     # Full visual design system and responsive styles
├── script.js                     # App state, auth, workflow, rendering, validation
├── RepairOS-logo.svg             # Logo asset
├── chan_logo.svg                 # Logo asset
└── README.md                     # Public prototype documentation
```

## Data Model Overview

All records are stored as JSON inside browser `localStorage`.

### Core Collections

#### Users

- role
- email
- password hash
- display name
- optional `customerId`

#### Customers

- id
- name
- address
- phone
- email
- loyalty tier

#### Vehicles

- id
- customerId
- VIN
- year
- make
- model
- mileage
- warranty
- diagnostic codes

#### Appointments

- id
- customerId
- vehicleId
- appointment time
- service type
- booking note
- approval/assignment info
- operator
- bay
- workflow status

#### Work Orders

- id
- appointmentId
- customerId
- vehicleId
- assigned technician/operator
- services performed
- timestamps
- review status

#### Inventory

- id
- name
- SKU
- quantity
- reorder point
- unit price

#### Loyalty

- customerId
- points
- tier

## Getting Started

### No Installation Required

Open either of these in a browser:

- [/Users/beofam/Downloads/automotive-repair-management-system-main/public/index.html](/Users/beofam/Downloads/automotive-repair-management-system-main/public/index.html)
- [/Users/beofam/Downloads/automotive-repair-management-system-main/public/torque-garage-prototype.html](/Users/beofam/Downloads/automotive-repair-management-system-main/public/torque-garage-prototype.html)

### Demo Logins

#### Admin

- email: `admin@icloud.com`
- password: `admin123`

#### Operator

- email: `operator@icloud.com`
- password: `operator123`

#### Customer

- use any seeded customer email
- default password: `customer123`

### Reset Demo Data

The admin dashboard includes:

- `Reload Demo Data`
- `Clear Saved Data`

These controls make it easy to restore or reset browser state during testing.

## Workflow Summary

### Customer Booking Rules

- customer must add a vehicle before booking
- appointment must be within business hours
- appointment must be on the hour
- duplicate/invalid bookings are blocked

### Admin Review Rules

- admin assigns the operator and bay
- destructive deletes require admin password confirmation
- admin owns inventory management

### Operator Rules

- operator cannot manage customers
- operator cannot delete vehicles
- operator updates only allowed job/vehicle details
- completed work flows back for admin review

### Customer Visibility Rules

- customer sees simplified visit messaging
- internal workflow details stay hidden where not needed
- completed service uses the thank-you message instead of an in-progress message

## Notes and Limitations

This `public/` version is a front-end prototype, not the original full Flask multi-tenant SaaS backend.

That means:

- there is no live database server
- there is no Stripe integration in this static build
- there is no Google OAuth integration in this static build
- there is no backend-enforced RBAC beyond the browser demo logic
- password hashing here is simplified for prototype behavior, not production security

It is still useful for:

- UX validation
- stakeholder demos
- workflow prototyping
- front-end iteration
- preparing for backend integration later

## Future Expansion

This prototype is a strong base for later upgrades such as:

- Flask or FastAPI backend integration
- PostgreSQL persistence
- real authentication and hashed credential storage
- Stripe subscription billing
- email or SMS reminders
- server-side audit logging
- production deployment
