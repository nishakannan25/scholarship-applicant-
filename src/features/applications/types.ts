export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  city: string;
  state: string;
  country: string;
}

export interface AcademicDetails {
  role: 'school' | 'college' | 'other';
  // School fields
  schoolName?: string;
  className?: string;
  boardName?: string;
  academicYear?: string;
  schoolMarks?: string;
  // College fields
  collegeName?: string;
  degree?: string;
  department?: string;
  collegeYear?: string;
  cgpa?: string;
  // Other fields
  qualification?: string;
  otherInstitution?: string;
  qualificationYear?: string;
  additionalDetails?: string;
}

export interface FinancialDetails {
  familyIncome: string;
  incomeSource: string;
  familyMemberCount: string;
  financialCategory: string;
}

export interface DocumentMeta {
  id: string;
  filename: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface ApplicationDraft {
  applicationId: string;
  scholarshipId: string;
  scholarshipTitle: string;
  currentTab: number;
  status: 'draft' | 'submitted';
  updatedAt: string;
  personal: PersonalDetails;
  academic: AcademicDetails;
  financial: FinancialDetails;
  documents: DocumentMeta[];
  veriflowLocked?: boolean;
}
