
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileActive?: boolean;
  avatar?: string;
}

export interface DoctorProfile extends User {
  licenseNumber: string;
  specialty: string;
  costPerConsultation: number;
  availableSlots: string[]; // ISO Strings
  bio: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  fileName: string;
  uploadDate: string;
  summary: string;
  keyFindings: string[];
  originalContent: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  slot: string;
  status: 'pending' | 'confirmed' | 'completed';
  meetLink: string;
  notes?: string;
  translatedNotes?: Record<string, string>;
}

export interface HealthDataPoint {
  date: string;
  steps: number;
  heartRate: number;
  sleepHours: number;
}
