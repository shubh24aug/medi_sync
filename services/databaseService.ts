
import { User, UserRole, MedicalRecord, Consultation } from '../types.ts';

const DB_KEYS = {
  USERS: 'medisync_db_users',
  RECORDS: 'medisync_db_records',
  BOOKINGS: 'medisync_db_bookings',
};

const hash = (pw: string) => btoa(`m_sync_${pw}_v1`);

class DatabaseService {
  private read<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }

  private write<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getUsers(): User[] { return this.read<User>(DB_KEYS.USERS); }
  
  getDoctors(activeOnly = true): User[] {
    return this.getUsers().filter(u => u.role === UserRole.DOCTOR && (!activeOnly || u.profileActive));
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  authenticate(email: string, password?: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user || !password) return null;
    const h = hash(password);
    return (user.password === h || user.password === password) ? user : null;
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    const data = { ...user, password: user.password && !user.password.startsWith('m_sync_') ? hash(user.password) : user.password };
    if (idx > -1) users[idx] = { ...users[idx], ...data };
    else users.push(data);
    this.write(DB_KEYS.USERS, users);
  }

  updateDoctorStatus(id: string, active: boolean): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx > -1) {
      users[idx].profileActive = active;
      this.write(DB_KEYS.USERS, users);
    }
  }

  getRecords(patientId: string): MedicalRecord[] {
    return this.read<MedicalRecord>(DB_KEYS.RECORDS).filter(r => r.patientId === patientId);
  }

  saveRecord(record: MedicalRecord): void {
    const records = this.read<MedicalRecord>(DB_KEYS.RECORDS);
    records.unshift(record);
    this.write(DB_KEYS.RECORDS, records);
  }

  getBookings(userId: string, role: UserRole): Consultation[] {
    const b = this.read<Consultation>(DB_KEYS.BOOKINGS);
    return role === UserRole.PATIENT ? b.filter(x => x.patientId === userId) : b.filter(x => x.doctorId === userId);
  }

  saveBooking(booking: Consultation): void {
    const b = this.read<Consultation>(DB_KEYS.BOOKINGS);
    b.unshift(booking);
    this.write(DB_KEYS.BOOKINGS, b);
  }

  seed() {
    if (!this.getUserByEmail('admin@example.com')) {
      this.saveUser({ id: 'a1', name: 'Admin', email: 'admin@example.com', password: 'admin', role: UserRole.ADMIN, profileActive: true, avatar: 'AD' });
    }
    if (!this.getUserByEmail('patient@example.com')) {
      this.saveUser({ id: 'p1', name: 'John Doe', email: 'patient@example.com', password: 'password', role: UserRole.PATIENT, profileActive: true, avatar: 'JD' });
    }
  }
}

export const db = new DatabaseService();
db.seed();
