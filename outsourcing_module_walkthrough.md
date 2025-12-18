# Man Power Outsourcing Services Module - Completed

The Man Power Outsourcing module is now fully implemented with both backend and frontend components. This module allows the organization to manage staffing requests, assign employees to clients, track contracts, and manage timesheets for billable hours.

## Key Features Implemented

### 1. Outsourcing Dashboard (Overview)
- **Dynamic Stats**: Real-time counts of Active Placements, Open Staffing Requests, Active Contracts, and Pending Timesheets.
- **Quick Management**: A central hub for common actions like reviewing requests, approving timesheets, and viewing contracts.
- **Business Growth Insight**: A contextual card highlighting open requirements.

### 2. Staffing Request Management
- **List View**: A comprehensive table showing all client requests with status and priority tracking.
- **Request Detail Page**:
    - Detailed view of job titles, descriptions, and required skills.
    - **AI Candidate Matching**: A feature that simulates AI matching to suggest the best candidates from the internal employee pool based on skills and experience.
- **New Request Form**: A streamlined form to capture client needs, required skills, positions, and timeline.

### 3. Outsourced Personnel (Placements)
- **Placement Directory**: Track which employee is assigned to which client, including their role and billing rate.
- **Assignment Form**: A tool to link employees to staffing requests or directly to clients, specifying billing terms and periods.

### 4. Timesheet & Billing Management
- **Timesheet List**: Monitor submitted timesheets for outsourced staff.
- **Timesheet Submission**: A form for employees to record work hours for specific client placements, featuring automatic billable amount calculation.
- **Approval Workflow**: Capability for managers to approve or reject timesheets (integrated into the API logic).

### 5. Staffing Contracts
- **Contract Repository**: View active agreements with clients, including contract numbers, total values, and validity periods.

## Technical Details

### Backend (Django)
- **App**: `apps.outsourcing`
- **Models**: `StaffingRequest`, `OutsourcedStaff`, `StaffingContract`, `StaffingTimesheet`.
- **API Endpoints**: 
    - `/api/outsourcing/requests/` (with `/stats/` action)
    - `/api/outsourcing/staff/`
    - `/api/outsourcing/contracts/`
    - `/api/outsourcing/timesheets/`
- **Serializers**: Optimized to return full client and employee names for frontend display.

### Frontend (Next.js)
- **Root Path**: `/outsourcing`
- **UI Framework**: Material UI (MUI v6/v7 standards).
- **Style**: Premium dashboard aesthetic with card-based layouts, hover effects, and linear gradient highlights for AI features.
- **Routing**: Integrated into the main application sidebar.

## Next Steps Recommended
1. **Invoice Generation**: Connect `StaffingTimesheet` with the `finance` module to auto-generate invoices for clients.
2. **Client Portal Access**: Extend authentication to allow clients to log in and submit `StaffingRequests` directly.
3. **Real AI Integration**: Replace the mock matching logic with a vector-based search using the actual skills field.
