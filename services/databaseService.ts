
import { User, UserRole, MedicalRecord, Consultation } from '../types.ts';

const DB_KEYS = {
  USERS: 'medisync_db_users',
  RECORDS: 'medisync_db_records',
  BOOKINGS: 'medisync_db_bookings',
};

// Simulated hashing for security demo
const hashPassword = (password: string) => btoa(`salt_${password}_hash`);

class DatabaseService {
  private getStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error reading ${key} from storage`, e);
      return [];
    }
  }

  private setStorage<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error writing ${key} to storage`, e);
    }
  }

  // --- User Operations ---
  getUsers(): User[] {
    return this.getStorage<User>(DB_KEYS.USERS);
  }

  getDoctors(activeOnly: boolean = true): User[] {
    return this.getUsers().filter(u => 
      u.role === UserRole.DOCTOR && (!activeOnly || u.profileActive)
    );
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  authenticate(email: string, password?: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user || !password) return null;
    
    const hashedInput = hashPassword(password);
    // Support legacy plain-text (if any) or hashed match
    if (user.password !== hashedInput && user.password !== password) return null;
    
    return user;
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    
    const userToSave = {
      ...user,
      password: user.password ? (user.password.startsWith('salt_') ? user.password : hashPassword(user.password)) : undefined
    };

    if (index > -1) {
      users[index] = { ...users[index], ...userToSave };
    } else {
      users.push(userToSave);
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

  seedDatabase() {
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
db.seedDatabase();
