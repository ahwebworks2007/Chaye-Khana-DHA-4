export interface AdminUser {
  id: string;
  email: string;
  role: 'branch_admin';
  branchId: string;
}

// Client-side representation of public user metadata (NO passwords or hashes stored in frontend)
export const KNOWN_ADMIN_ACCOUNTS: Omit<AdminUser, 'id'>[] = [
  {
    email: 'dha4@example.com',
    role: 'branch_admin',
    branchId: 'dha-phase-4',
  },
  {
    email: 'islamabad@example.com',
    role: 'branch_admin',
    branchId: 'islamabad',
  },
  {
    email: 'saddar@example.com',
    role: 'branch_admin',
    branchId: 'saddar',
  },
];
