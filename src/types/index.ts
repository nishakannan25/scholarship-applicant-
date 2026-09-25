export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  applicationId?: string;
  applicationNumber?: string;
  phone?: string;
  role?: string;
  institution?: string;
  city?: string;
  state?: string;
  country?: string;

  // Board & Identification Details
  boardType?: string;
  aadhaarNumber?: string;
  age?: string;
  marks10th?: string;
  percentage10th?: string;
  marks12th?: string;
  percentage12th?: string;

  // College Student Specific Details
  degreeCourse?: string;
  studyYear?: string;
  cgpaPercentage?: string;
  majorBranch?: string;

  isVerified?: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  amount: number;
  deadline: string;
  category: string;
  description: string;
}

export interface Application {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'contested';
  submittedAt?: string;
  updatedAt: string;
}
