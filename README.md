# QueueFlow

> Real-time queue management system for managing service queues efficiently.

QueueFlow is a full-stack web application that allows users to join service queues remotely, receive a token, track their queue position, and manage their tickets.

Staff members have a dedicated dashboard to view waiting customers, call the next customer, and complete tickets.

The application also handles simultaneous queue requests using MongoDB transactions and atomic operations to prevent duplicate queue tokens.

---

## Live Demo

**Frontend:** https://queue-flow-lac.vercel.app/

**Backend:** https://queueflow-x8ut.onrender.com/

---

## Features

### User

- Sign up and login
- JWT authentication
- Browse available services
- Join a queue remotely
- Receive a queue token
- Track queue position
- View ticket status
- Cancel a waiting ticket
- View ticket history
- Real-time ticket updates

### Staff

- Dedicated staff dashboard
- Role-based access control
- Select and manage services
- View waiting customers
- View current token
- Call the next customer
- Complete the current ticket
- Real-time queue updates

---

## Screenshots

### User

#### Login
<img width="977" height="826" alt="image" src="https://github.com/user-attachments/assets/0b850eee-3577-4321-965c-95068a84cc5a" />

#### Dashboard
<img width="1600" height="796" alt="WhatsApp Image 2026-08-12 at 4 23 50 PM" src="https://github.com/user-attachments/assets/9ca334e4-bea0-4e99-8104-809562971b29" />

<img width="1466" height="837" alt="WhatsApp Image 2026-08-12 at 4 24 07 PM" src="https://github.com/user-attachments/assets/47f73e80-b693-4309-a86e-f45ca6c13fd0" />

#### Queue Details
<img width="1502" height="810" alt="WhatsApp Image 2026-08-12 at 4 28 06 PM" src="https://github.com/user-attachments/assets/b4d3460c-06b1-49f3-816e-b154724f45f3" />

<img width="1353" height="807" alt="WhatsApp Image 2026-08-12 at 4 28 23 PM" src="https://github.com/user-attachments/assets/55d36aa2-727c-4cbe-a5e0-eba51e002d4a" />
<img width="1600" height="745" alt="WhatsApp Image 2026-08-12 at 4 32 36 PM" src="https://github.com/user-attachments/assets/fb4eeb5c-bf33-4086-bb1d-a8cbc9c1632a" />

#### My Ticket

![My Ticket](screenshots/user-ticket.png)

#### Ticket History
<img width="1600" height="594" alt="WhatsApp Image 2026-08-12 at 5 15 43 PM" src="https://github.com/user-attachments/assets/dd49a6ee-a4ae-4238-9e8f-fd1a936a805a" />


---

### Staff

#### Staff Dashboard
<img width="1600" height="775" alt="WhatsApp Image 2026-08-12 at 4 30 58 PM" src="https://github.com/user-attachments/assets/f2b128e4-fc45-48f9-963a-f02fd5c92696" />



#### Waiting Customers
<img width="1600" height="816" alt="WhatsApp Image 2026-08-12 at 4 31 22 PM" src="https://github.com/user-attachments/assets/8e1880c6-6c3f-42ff-9b76-ce092e72a746" />
<img width="1412" height="857" alt="WhatsApp Image 2026-08-12 at 4 31 32 PM" src="https://github.com/user-attachments/assets/67f65e0b-4a82-4668-a7e3-35ca5d9922a7" />


#### Call Next Customer
<img width="1258" height="877" alt="WhatsApp Image 2026-08-12 at 4 31 57 PM" src="https://github.com/user-attachments/assets/83c8c8bf-c1b1-407e-993b-60b682db78fc" />


---

## How It Works

### User Flow

```text
Sign Up / Login
      ↓
Dashboard
      ↓
Select Service
      ↓
Join Queue
      ↓
Receive Token
      ↓
Track Queue
      ↓
Staff Calls Customer
      ↓
Ticket Completed
