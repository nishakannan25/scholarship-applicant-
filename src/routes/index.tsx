import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { SecurityPage } from '../pages/SecurityPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ScholarshipsPage } from '../pages/ScholarshipsPage';
import { ScholarshipDetailPage } from '../pages/ScholarshipDetailPage';
import { ApplicationsListPage } from '../pages/ApplicationsListPage';
import { ApplicationDetailsPage } from '../pages/ApplicationDetailsPage';
import { ApplicationWizardPage } from '../pages/ApplicationWizardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ApplicantLayout } from '../layouts/ApplicantLayout';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  // Main Protected App Routes (Supports both /dashboard and /app/dashboard)
  {
    element: (
      <ProtectedRoute>
        <ApplicantLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/app/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/scholarships',
        element: <ScholarshipsPage />,
      },
      {
        path: '/app/scholarships',
        element: <ScholarshipsPage />,
      },
      {
        path: '/scholarships/:id',
        element: <ScholarshipDetailPage />,
      },
      {
        path: '/app/scholarships/:id',
        element: <ScholarshipDetailPage />,
      },
      {
        path: '/applications',
        element: <ApplicationsListPage />,
      },
      {
        path: '/app/applications',
        element: <ApplicationsListPage />,
      },
      {
        path: '/applications/:applicationId',
        element: <ApplicationWizardPage />,
      },
      {
        path: '/app/applications/:applicationId',
        element: <ApplicationWizardPage />,
      },
      {
        path: '/applications/:applicationId/details',
        element: <ApplicationDetailsPage />,
      },
      {
        path: '/app/applications/:applicationId/details',
        element: <ApplicationDetailsPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/app/profile',
        element: <ProfilePage />,
      },
      {
        path: '/security',
        element: <SecurityPage />,
      },
      {
        path: '/app/security',
        element: <SecurityPage />,
      },
    ],
  },
]);
