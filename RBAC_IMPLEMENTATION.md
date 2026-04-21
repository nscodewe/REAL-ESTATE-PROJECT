This document outlines the Role-Based Access Control (RBAC) implementation for the CRM.

## Role Hierarchy

### Admin
- Full system access
- Can access all modules
- Can manage users
- Can view all analytics
- Can view all data across the system

### Manager  
- Team management view
- Can access team analytics
- Can see team performance metrics
- Cannot access user management
- Cannot see global system settings

### Agent
- Personal data access only
- Can see only their assigned leads
- Can see only their assigned deals
- Can see only their assigned tasks
- Cannot access global analytics
- Cannot see other agents' data

## Implementation Details

### 1. Protected Routes
- `/user-management` - Admin only
- `/analytics` - Admin and Manager only
- All pages redirect unauthorized users to `/unauthorized`

### 2. Data Filtering
- **Leads**: Agents see only leads assigned to them (assignedAgent field)
- **Deals**: Agents see only deals assigned to them (agent field)
- **Tasks**: Agents see only tasks assigned to them (assignedTo field)
- **Properties**: All roles can see all properties
- **Clients**: All roles can see all clients

### 3. UI Components
- Sidebar dynamically shows/hides menu items based on user role
- Dashboard shows role-specific metrics and content
- User Management shows system users and permission matrix (Admin only)
- Analytics shows team/system level data (Admin and Manager only)

### 4. Unauthorized Access
- Redirects to `/unauthorized` page
- Shows clear access denied message
- Provides navigation back to dashboard

## Testing the RBAC

### Login with different roles:
- Admin: admin@crm.com / password
- Manager: emma@crm.com / password  
- Agent: john@crm.com / password

### Expected behaviors:
1. **Admin login**:
   - Can see all menu items
   - Dashboard shows full system overview
   - Can access User Management
   - Can access Analytics
   - Sees all leads and deals

2. **Manager login**:
   - Cannot see User Management in sidebar
   - Dashboard shows team metrics
   - Can access Analytics (team-level)
   - Sees all leads and deals
   - Message indicates team-level view

3. **Agent login**:
   - Sidebar shows limited options
   - Dashboard shows personal metrics only
   - Cannot access Analytics (redirects to /unauthorized)
   - Only sees assigned leads (1 lead)
   - Only sees assigned deals (3 deals)
   - Focused task view

## API Service Changes

The `apiService` now accepts optional `userRole` and `userId` parameters:
- `getLeads(userRole, userId)` - Filters by assignedAgent if role is 'agent'
- `getDeals(userRole, userId)` - Filters by agent field if role is 'agent'
- `getTasks(userRole, userId)` - Filters by assignedTo if role is 'agent'
- `getDashboardMetrics(userRole, userId)` - Calculates role-specific metrics
