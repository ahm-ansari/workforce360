# Client Company (CRM) Module - Implementation Overview

The Client Company module has been established as a dedicated CRM (Customer Relationship Management) system within Workforce360. This module allows you to manage the entire lifecycle of B2B client relationships, going beyond simple visitor company records.

## Key Features Implemented

### 1. Client Directory (CRM Central)
- **Comprehensive List**: A modern, searchable directory of all registered clients.
- **Categorization**: Filter clients by status (Prospect, Active, Inactive, Negotiation) and Type (Enterprise, SME, NGO).
- **Primary Contact Tracking**: Visual indicators for primary email and phone contacts.

### 2. Client Detail Management
- **Multi-Tab Interface**:
    - **Overview**: General business information, tax identification (Tax ID/VAT), and billing preferences.
    - **Contacts**: Manage multiple contact persons per client, designating primary stakeholders for HR or Finance.
    - **Locations**: Track multiple operational sites, head offices, and branch locations. 
- **Relationship Tracking**: Assign internal **Account Managers** to specific clients to track responsibility.

### 3. Onboarding & Forms
- **Advanced Onboarding**: A detailed form to capture legal names, business industries, payment terms (e.g., Net 30), and internal notes.
- **Real-time Validation**: Integrated with backend serializers for data integrity.

## Technical Infrastructure

### Backend (Django)
- **New App**: `apps.clients`
- **Primary Models**: 
    - `Client`: Core organization record.
    - `ClientContact`: Individual contacts at the client firm.
    - `ClientSite`: Physical locations and addresses.
- **REST API**: 
    - `/api/clients/clients/`
    - `/api/clients/contacts/`
    - `/api/clients/sites/`

### Frontend (Next.js)
- **Routes**:
    - `/clients`: Main directory.
    - `/clients/new`: Onboarding form.
    - `/clients/[id]`: 360-degree view of the client.
- **State Management**: Integrated with Axios and standard MUI layout patterns.

## Next Steps
1. **Link with Outsourcing**: Update the Outsourcing module to use the new `Client` model instead of the basic `visitors.Company` model.
2. **Project Integration**: Link `Client` records directly to Projects for better financial tracking.
3. **Document Management**: Implement the file upload logic for Client NDAs, MSAs, and KYC documents.
