
import { User, UserRole, MedicalRecord, Consultation } from '../types.ts';

const DB_KEYS = {
  USERS: 'medisync_db_users',
  RECORDS: 'medisync_db_records',
  BOOKINGS: 'medisync_db_bookings',
};

class DatabaseService {
  private getStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- User Operations ---
  getUsers(): User[] {
    return this.getStorage<User>(DB_KEYS.USERS);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  authenticate(email: string, password?: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;
    
    // For this demo, we check password if it was provided during registration
    // If no password exists in DB, we allow login (for legacy seeded users)
    if (user.password && user.password !== password) return null;
    
    return user;
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (index > -1) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    this.setStorage(DB_KEYS.USERS, users);
  }

  updateDoctorStatus(doctorId: string, active: boolean): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === doctorId);
    if (index > -1) {
      users[index].profileActive = active;
      this.setStorage(DB_KEYS.USERS, users);
    }
  }

  // --- Record Operations ---
  getRecords(patientId: string): MedicalRecord[] {
    return this.getStorage<MedicalRecord>(DB_KEYS.RECORDS).filter(r => r.patientId === patientId);
  }

  saveRecord(record: MedicalRecord): void {
    const records = this.getStorage<MedicalRecord>(DB_KEYS.RECORDS);
    records.unshift(record);
    this.setStorage(DB_KEYS.RECORDS, records);
  }

  // --- Booking Operations ---
  getBookings(userId: string, role: UserRole): Consultation[] {
    const bookings = this.getStorage<Consultation>(DB_KEYS.BOOKINGS);
    if (role === UserRole.PATIENT) return bookings.filter(b => b.patientId === userId);
    if (role === UserRole.DOCTOR) return bookings.filter(b => b.doctorId === userId);
    return bookings;
  }

  saveBooking(booking: Consultation): void {
    const bookings = this.getStorage<Consultation>(DB_KEYS.BOOKINGS);
    bookings.unshift(booking);
    this.setStorage(DB_KEYS.BOOKINGS, bookings);
  }

  // Initial Seed for Admin & Default Patient
  seedDatabase() {
    const users = this.getUsers();
    
    const adminEmail = 'admin@example.com';
    if (!this.getUserByEmail(adminEmail)) {
      this.saveUser({
        id: 'admin-1',
        name: 'System Admin',
        email: adminEmail,
        password: 'admin',
        role: UserRole.ADMIN,
        profileActive: true,
        avatar: 'AD'
      });
    }

    const patientEmail = 'patient@example.com';
    if (!this.getUserByEmail(patientEmail)) {
      this.saveUser({
        id: 'patient-1',
        name: 'John Doe',
        email: patientEmail,
        password: 'password',
        role: UserRole.PATIENT,
        profileActive: true,
        avatar: 'JD'
      });
    }
  }
}

export const db = new DatabaseService();
db.seedDatabase(); // Ensure initial accounts exist
