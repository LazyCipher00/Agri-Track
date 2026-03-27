# Agri-Track
Smart Crop Lifecycle &amp; Farm Management System (C# WebForms Project)


##AgriTrack: Smart Crop Lifecycle & Farm Management System**



# 1. Project Overview

AgriTrack is a web-based farm management system developed using **C# WebForms (.NET Framework)** and a **relational database (SQL Server).

The system is designed to help farmers digitally manage the **entire crop lifecycle**, from planting (pre-harvest), through monitoring and farm activities, to post-harvest inventory and sales tracking.

AgriTrack focuses on providing structured tracking, historical records, and simple decision support to improve farm productivity and management efficiency.



# 2. Core Objectives

* Digitize farm operations and crop tracking
* Monitor crop health during pre-harvest stages
* Record and manage farm activities over time
* Track harvested produce and inventory
* Maintain sales and basic profit records
* Provide a clear dashboard for insights and summaries



# 3. System Modules & Functionality

## 3.1 User Management

* User registration and login
* Role-based access (Admin, Farmer)
* Authentication and session handling



## 3.2 Farm & Plot Management

* Create and manage farms
* Divide farms into plots
* Assign crops to specific plots



## 3.3 Crop Management

* Create crop instances (linked to crop types such as maize, beans, sorghum)
* Store planting date and crop status
* Track lifecycle stages:

  * Planted
  * Growing
  * Ready for harvest
  * Harvested



## 3.4 Farm Activities Management

The system records all actions performed on crops over time.

### Supported Activities:

* Planting
* Irrigation (watering)
* Fertilization
* Pest/Disease control
* Harvesting

### Features:

* Log activity with date and notes
* Associate each activity with a specific crop (via CropID)
* Maintain a complete activity history



## 3.5 Crop Health Monitoring

* Record crop health status independently from activities
* Health statuses include:

  * Healthy
  * Pest-infected
  * Diseased
* Store observations and notes
* Track changes in health over time



## 3.6 Harvest Management

* Record harvested crops
* Capture:

  * Harvest date
  * Quantity harvested
* Update crop status to “Harvested”



## 3.7 Inventory Management (Post-Harvest)

* Store harvested produce in inventory
* Track:

  * Total quantity
  * Remaining stock
* Manage storage records



## 3.8 Sales & Profit Tracking

* Record sales transactions
* Capture:

  * Quantity sold
  * Price
* Automatically update inventory
* Maintain basic profit tracking



## 3.9 Dashboard & Reporting

* Display key system metrics:

  * Total crops
  * Active vs harvested crops
  * Inventory levels
  * Recent activities
* Provide summaries for decision-making


# 4. System Workflow 

1. User logs into the system
2. User creates a crop instance (linked to a plot and crop type)
3. User logs farm activities over time
4. System records crop health updates
5. User performs corrective actions if needed
6. Crop is harvested and recorded
7. Harvested crops are added to inventory
8. Sales are recorded and inventory is updated


# 5. Key Data Entities (Database Overview)

* Users
* Farms
* Plots
* CropTypes
* Crops
* Activities
* CropHealthLogs
* Harvests
* Inventory
* Sales



# 6. Functional Requirements

* The system must allow users to create and manage crop records
* The system must log and store all farm activities
* The system must track crop health independently
* The system must record harvest data and quantities
* The system must manage inventory and update stock levels
* The system must support recording of sales transactions
* The system must provide dashboard summaries



# 7. Non-Functional Requirements

* Usability: Simple and intuitive UI for farmers
* Performance: Efficient database queries for data retrieval
* Scalability: Structured design to support future expansion
* Reliability: Data consistency and proper relationships
* Security: Basic authentication and session management



# 8. Technology Stack

* Frontend: ASP.NET WebForms
* Backend: C# (.NET Framework)
* Database: Microsoft SQL Server


# 9. System Scope

This system is designed as an academic project with real-world applicability.
It does not include advanced integrations such as live weather APIs or AI-based predictions but is structured to support future enhancements.

---

