# 🏡 Real Estate CRM System

A full-stack **Real Estate CRM (Customer Relationship Management) Web Application** built using modern technologies to manage leads, properties, and deals efficiently with automation support.

---

## 🚀 Features

### 🔹 Lead Management

* Add, update, and delete leads
* Track lead status (New, Contacted, Qualified, Closed)
* Assign leads to agents

### 🔹 Property Management

* Add and view property listings
* Store location, price, and details
* Clean card-based UI

### 🔹 Deal Management

* Create deals from leads
* Track deal stages (Negotiation → Agreement → Closed)
* Automatic **commission calculation (2%)**

### 🔹 Workflow Automation (n8n)

* Automatically triggers workflow when a new lead is created
* Enables automation like notifications and follow-ups

### 🔹 Dashboard

* Overview of leads, properties, and deals
* Clean UI with analytics-ready structure

---

## 🛠️ Tech Stack

### Frontend

* Next.js (React)
* Tailwind CSS

### Backend

* Next.js API Routes

### Database

* MySQL

### Automation

* n8n (Webhook-based workflow automation)

---

## 📂 Project Structure

```
├── app/                # Pages & API routes
│   ├── api/            # Backend APIs
│   ├── leads/          # Leads UI
│   ├── properties/     # Properties UI
│   ├── deals/          # Deals UI
│
├── components/         # Reusable UI components
├── lib/                # Database connection
├── public/             # Static assets
├── .env.local          # Environment variables
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crm_db
```

---

### 4. Setup MySQL Database

* Create database: `crm_db`
* Import SQL schema (tables: leads, agents, properties, deals)
* Insert sample data

---

### 5. Run the project

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

### Leads

* `GET /api/leads`
* `POST /api/leads`
* `PUT /api/leads/:id`
* `DELETE /api/leads/:id`

### Properties

* `GET /api/properties`
* `POST /api/properties`

### Deals

* `GET /api/deals`
* `POST /api/deals`
* `PUT /api/deals/:id`

---

## 🔄 Workflow (System Flow)

```
Lead Created → Assigned → Contacted → Converted to Deal → Closed → Commission Generated
```

---

## 🤖 n8n Integration

* Webhook triggers on new lead creation
* Enables automation workflows
* Example: Notification or email on new lead

---

## 🌟 Key Highlights

* Full-stack application (Frontend + Backend)
* Real-time database integration
* Workflow automation using n8n
* Clean and responsive UI
* Scalable architecture

---

## 📌 Future Improvements

* Role-based authentication (Admin, Agent, Manager)
* Advanced analytics dashboard
* Email/SMS notifications
* Mobile app version

---

## 👩‍💻 Author

**Neha Sharma**
BTech CSE Student

---

## 📜 License

This project is for academic and learning purposes.
