# Real Estate CRM Platform

A modern, full-featured Customer Relationship Management (CRM) system designed specifically for real estate professionals. Built with Next.js 16, React 19, and TypeScript.

## Features

### 🔐 Authentication & Authorization
- Multi-role authentication system (Admin, Agent, Manager)
- Secure session management with HTTP-only cookies
- Protected routes with automatic redirects
- Demo credentials for testing

### 📊 Dashboard
- Real-time metrics and KPIs
- Sales charts and lead conversion tracking
- Recent activity feed
- Role-specific views

### 👥 Leads Management
- Comprehensive lead tracking
- Status-based filtering (New, Contacted, Qualified, Proposal, Negotiation, Closed, Lost)
- Search and filter capabilities
- Lead lifecycle management

### 🏠 Properties
- Property listings with detailed information
- Filter by type (Residential, Commercial, Apartment, Land)
- Price and specifications display
- Quick search functionality

### 💼 Deals Pipeline
- Kanban-style deal management
- Pipeline stages (Proposal, Negotiation, Agreement, Closed)
- Deal value tracking
- Commission calculations

### 📈 Analytics
- Revenue tracking and forecasting
- Lead conversion metrics
- Deal pipeline analysis
- Performance reports

### 💬 Communications
- Centralized communication history
- Integration points for email/calls/meetings
- Contact timeline

### 👤 User Management (Admin only)
- User creation and role assignment
- Permission management
- Team organization

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Authentication**: Custom context-based auth

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd real-estate-crm
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open http://localhost:3000 in your browser

### Demo Credentials

- **Admin**: admin@crm.com / password
- **Agent**: john@crm.com / password
- **Manager**: emma@crm.com / password

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication routes
│   ├── dashboard/           # Main dashboard
│   ├── leads/              # Leads module
│   ├── properties/         # Properties module
│   ├── deals/             # Deals module
│   ├── analytics/         # Analytics module
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components (Sidebar, TopNavbar)
├── lib/
│   ├── auth-context.tsx  # Authentication provider
│   ├── api-service.ts    # API layer
│   ├── types.ts          # TypeScript types
│   └── report-service.ts # Export/reporting utilities
├── middleware.ts          # Next.js middleware for auth
└── styles/
    └── globals.css        # Global styles and design tokens
```

## Key Features Implementation

### Role-Based Access Control
- Admin: Full system access, user management
- Manager: Team management, analytics, reporting
- Agent: Lead and deal management

### Data Management
- Mock data layer ready for backend integration
- Type-safe data structures
- Validation schemas for all forms

### Reporting & Export
- CSV export for leads, deals, and properties
- Summary reports with key metrics
- Performance analytics

### UI/UX
- Dark theme with semantic color tokens
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Loading states with skeleton screens
- Toast notifications for user feedback

## Customization

### Theme Colors
Edit `app/globals.css` to customize the color scheme:
```css
@theme inline {
  --primary: #your-color;
  --primary-foreground: #your-foreground;
  /* ... other tokens ... */
}
```

### API Integration
The `lib/api-service.ts` is set up for easy backend integration. Replace mock data with real API calls:
```typescript
export const apiService = {
  getLeads: async () => {
    const response = await fetch('/api/leads');
    return response.json();
  },
  // ... other methods
};
```

### Adding New Modules
1. Create a new folder in `app/` (e.g., `app/tasks/`)
2. Add a `page.tsx` that uses `DashboardLayout`
3. Add navigation link in `components/layout/sidebar.tsx`
4. Create corresponding API methods in `lib/api-service.ts`

## Performance Optimizations

- Server-side rendering for fast initial load
- Incremental Static Regeneration (ISR)
- Image optimization with Next.js Image
- Code splitting with dynamic imports
- CSS-in-JS optimization with Tailwind
- Font optimization with next/font

## Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

```bash
vercel deploy
```

### Environment Variables
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
```

## Security Best Practices

- HTTP-only cookies for auth tokens
- CSRF protection through middleware
- Input validation with Zod
- Protected API routes
- Environment variable management
- No sensitive data in frontend code

## Future Enhancements

- Real database integration (Supabase, PostgreSQL)
- Real-time notifications with WebSockets
- AI-powered lead scoring
- Mobile app with React Native
- Video calling integration
- Advanced reporting with custom dashboards
- Workflow automation
- Email integration

## Support & Contributing

For issues and feature requests, please visit the GitHub repository or contact the development team.

## License

MIT License - feel free to use this project for your real estate business.
