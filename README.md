# Raksha Alert – Emergency Safety Alert System

**Raksha Alert** is a real-time safety monitoring system where users report incidents with location data, an admin verifies them, and alerts are sent to nearby users to improve public safety and awareness.

## ⚙️ Full Working Process (Step-by-Step 🔥)

### 🟢 STEP 1: User Registration/Login
- User account create chesthadu
- Login ayyi system lo enter avuthadu

### 🟢 STEP 2: Incident Reporting
- User "Report Incident" click chesthadu
- Details fill chesthadu:
  - Type
  - Description
  - Image
- Location:
  - Auto detect (GPS) OR 
  - Manual map select
  
👉 **Data backend ki send avutundi**

### 🟢 STEP 3: Data Storage
- Backend data receive chesthundi
- Database lo store chesthundi (Pending status)

### 🟢 STEP 4: Admin Verification 🔥 (IMPORTANT)
- Admin dashboard lo report kanipistundi
- Admin:
  - Check details
  - Approve / Reject

### 🟢 STEP 5: After Approval
- Incident map lo display avutundi
- Public ki visible

### 🟢 STEP 6: Alert System
- Nearby users ki notification veltundi
- "Danger Alert" message vastundi

### 🟢 STEP 7: Map Visualization
- Users map open chesthe:
  - All incidents markers
  - Safe/Unsafe zones

### 🟢 STEP 8: Communication
- User ↔ Admin chat
- Help request

### 🟢 STEP 9: Continuous Monitoring
- Admin:
  - Track incidents
  - Manage users
  - Send alerts

---

## 🔄 Complete Flow (Short Version 🔥)

👉 **User** → Report  
👉 **Backend** → Store  
👉 **Admin** → Verify  
👉 **System** → Publish  
👉 **Users** → Receive Alert

---

## 🚨 Admin Can Create Alerts (Core Functionality)

### 🧠 What is Admin Alert?
- 👉 Admin create chese official notification / warning
- 👉 Incident lekunda kuda alert pampachu

### ⚙️ How It Works

**🟢 1. Create Alert (Admin Panel)**
- Admin dashboard lo:
  - “📢 Create Alert” button
- Fields:
  - Title
  - Message
  - Location (optional)
  - Alert Type

**🟢 2. Alert Types**
- 🔴 Emergency Alert (High priority)
- ⚠️ Warning Alert
- ℹ️ Information Alert

**🟢 3. Target Audience**
- Admin decide cheyachu:
  - All users
  - Specific area users
  - Nearby users (location-based)

**🟢 4. Instant Notification 🔥**
- Push notification veltundi
- App lo alert popup
- Map lo highlight (if location based)

**🟢 5. Alert Visibility**
- Users alert history lo store avutundi
- Dashboard lo display avutundi

### 🔄 System Flow
Admin → Create Alert → Backend → Users receive notification

### 🗄️ Database Structure
**📢 Alerts Table**
- alert_id
- title
- message
- type (Emergency/Warning/Info)
- location
- created_by (Admin)
- timestamp

### 💡 Difference: Incident vs Alert
| Feature | Incident | Alert |
|---------|----------|-------|
| **Who creates** | User/Admin | Admin only |
| **Needs verification** | Yes (user cases) | No |
| **Purpose** | Report event | Notify users |
| **Speed** | Medium | Instant |

### 🛠️ UI Features
**Admin Panel:**
- ➕ Create Alert
- Alert history
- Delete / Edit alerts

**User Side:**
- 🔔 Notification popup
- Alerts list
- Map highlight

### 🚀 Advanced Features
- 🔊 Sound alert
- 📍 Geo-fencing alerts
- ⏰ Scheduled alerts
- 📲 SMS integration

---

## What technologies are used for this project?
This project is built with:
- React
- Next.js / Vite
- TypeScript
- Supabase (Backend & Database)
- Tailwind CSS & shadcn-ui
