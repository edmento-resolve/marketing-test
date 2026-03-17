// ─── Students ───────────────────────────────────────────────────────────────
export const MOCK_STUDENTS = [
  { id: '1', name: 'Rajesh Kumar', admission_number: '2024001', class: 'Grade 10-A', avatar: null },
  { id: '2', name: 'Priya Sharma', admission_number: '2024002', class: 'Grade 12-B', avatar: null },
  { id: '3', name: 'Amit Singh', admission_number: '2024003', class: 'Grade 11-A', avatar: null },
  { id: '4', name: 'Sneha Patel', admission_number: '2024004', class: 'Grade 9-B', avatar: null },
  { id: '5', name: 'Vikram Mehta', admission_number: '2024005', class: 'Grade 10-B', avatar: null },
  { id: '6', name: 'Ananya Reddy', admission_number: '2024006', class: 'Grade 8-A', avatar: null },
  { id: '7', name: 'Rohan Desai', admission_number: '2024007', class: 'Grade 12-A', avatar: null },
  { id: '8', name: 'Kavya Nair', admission_number: '2024008', class: 'Grade 11-B', avatar: null },
];

// ─── Payment Groups ──────────────────────────────────────────────────────────
export const MOCK_GROUPS = [
  {
    id: 'g1',
    group_name: 'Science Club',
    member_count: 15,
    members: [
      { id: '1', display_name: 'Rajesh Kumar', admission_number: '2024001', recipient_type: 'student', contact_email: 'rajesh@example.com' },
      { id: '2', display_name: 'Priya Sharma', admission_number: '2024002', recipient_type: 'student', contact_email: 'priya@example.com' },
    ],
    creator_details: { name: 'Admin', role: 'Staff Officer', class_name: '', division_name: '' },
  },
  {
    id: 'g2',
    group_name: 'Grade 10-A Parents',
    member_count: 45,
    members: [],
    creator_details: { name: 'Mrs. Sharma', role: 'Class Teacher', class_name: '10', division_name: 'A' },
  },
  {
    id: 'g3',
    group_name: 'Sports Team',
    member_count: 25,
    members: [],
    creator_details: { name: 'Mr. John', role: 'Physical Instructor', class_name: '', division_name: '' },
  },
];

// ─── Group Fees ──────────────────────────────────────────────────────────────
export const MOCK_GROUP_FEES: Record<string, any[]> = {
  'g1': [{ id: 'f1', title: 'Monthly Lab Fee', total_amount: 500, pending_amount: 200, base_amount: 200, due_date: '2024-02-15', audience_count: 15 }],
  'g2': [{ id: 'f2', title: 'Annual Sports Fee', total_amount: 1500, pending_amount: 5000, base_amount: 5000, due_date: '2024-02-20', audience_count: 45 }],
  'g3': [{ id: 'f3', title: 'Jersey Fee', total_amount: 1200, pending_amount: 12000, base_amount: 12000, due_date: '2024-02-25', audience_count: 25 }],
};

// ─── Student Dues ────────────────────────────────────────────────────────────
export const MOCK_STUDENT_DUES: Record<string, any> = {
  '1': {
    total_pending: 15000,
    total_paid: 35000,
    fee_items_count: 2,
    fee_items: [
      { id: 'fi1', title: 'Tuition Fee - Term 1', total_amount: 10000, paid_amount: 0, pending_amount: 10000, due_date: '2024-01-10' },
      { id: 'fi2', title: 'Library Fee', total_amount: 5000, paid_amount: 0, pending_amount: 5000, due_date: '2024-01-20' },
    ],
  },
  '2': {
    total_pending: 8000,
    total_paid: 42000,
    fee_items_count: 1,
    fee_items: [
      { id: 'fi3', title: 'Tuition Fee - Term 1', total_amount: 10000, paid_amount: 2000, pending_amount: 8000, due_date: '2024-01-10' },
    ],
  },
};

// ─── Fee Items ───────────────────────────────────────────────────────────────
// Matches the shape used by fee-items/page.tsx and fee-items/[id]/page.tsx
export const MOCK_FEE_ITEMS_DETAIL = [
  {
    fee_item_id: 'item1',
    id: 'item1',
    title: 'Tuition Fee 2024',
    description: 'Academic tuition fee for all enrolled students covering the full academic year.',
    frequency: 'ONE_TIME',
    payment_mode: 'CASH-ONLINE',
    total_amount: 25000,
    collected_amount: 20000,
    pending_amount: 5000,
    base_amount: 25000,
    due_date: '2024-06-30',
    days_left: 45,
    collections: [
      { id: 'c1', student_name: 'Rajesh Kumar', admission_number: '2024001', class_name: 'Grade 10-A', amount: 25000, status: 'PAID', paid_date: '2024-01-15' },
      { id: 'c2', student_name: 'Priya Sharma', admission_number: '2024002', class_name: 'Grade 12-B', amount: 25000, status: 'PENDING', paid_date: null },
      { id: 'c3', student_name: 'Amit Singh', admission_number: '2024003', class_name: 'Grade 11-A', amount: 25000, status: 'PAID', paid_date: '2024-01-20' },
      { id: 'c4', student_name: 'Sneha Patel', admission_number: '2024004', class_name: 'Grade 9-B', amount: 25000, status: 'OVERDUE', paid_date: null },
    ],
  },
  {
    fee_item_id: 'item2',
    id: 'item2',
    title: 'Transport Fee',
    description: 'Monthly bus transportation service for students who avail school buses.',
    frequency: 'INSTALLMENT',
    payment_mode: 'CASH-ONLINE',
    total_amount: 2000,
    collected_amount: 1600,
    pending_amount: 400,
    base_amount: 2000,
    due_date: '2024-03-31',
    days_left: -10,
    collections: [
      { id: 'c5', student_name: 'Vikram Mehta', admission_number: '2024005', class_name: 'Grade 10-B', amount: 2000, status: 'PAID', paid_date: '2024-01-10' },
      { id: 'c6', student_name: 'Ananya Reddy', admission_number: '2024006', class_name: 'Grade 8-A', amount: 2000, status: 'OVERDUE', paid_date: null },
    ],
  },
  {
    fee_item_id: 'item3',
    id: 'item3',
    title: 'Examination Fee',
    description: 'Fee for mid-term and final examinations.',
    frequency: 'ONE_TIME',
    payment_mode: 'CASH-ONLINE',
    total_amount: 1500,
    collected_amount: 1500,
    pending_amount: 0,
    base_amount: 1500,
    due_date: '2024-12-01',
    days_left: 90,
    collections: [
      { id: 'c7', student_name: 'Rohan Desai', admission_number: '2024007', class_name: 'Grade 12-A', amount: 1500, status: 'PAID', paid_date: '2024-01-05' },
      { id: 'c8', student_name: 'Kavya Nair', admission_number: '2024008', class_name: 'Grade 11-B', amount: 1500, status: 'PAID', paid_date: '2024-01-07' },
    ],
  },
];

// Simple list version (for dropdowns / selects)
export const MOCK_FEE_ITEMS = MOCK_FEE_ITEMS_DETAIL.map(({ fee_item_id, title }) => ({
  id: fee_item_id,
  title,
}));

// ─── Transactions ────────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS = [
  { id: 1, student: 'Rajesh Kumar', studentId: 'STU-001', amount: 15000, feeType: 'Tuition Fee', date: '2024-01-15', status: 'completed', transactionId: 'TXN-2024-001', paymentMethod: 'payment-gateway' },
  { id: 2, student: 'Priya Sharma', studentId: 'STU-002', amount: 18500, feeType: 'Exam Fee', date: '2024-01-15', status: 'completed', transactionId: 'TXN-2024-002', paymentMethod: 'cash' },
];

// ─── Fee Tracking (for Collections page) ─────────────────────────────────────
// Field names match what collections/page.tsx uses
export const MOCK_FEE_TRACKING = [
  { id: 'ft1', student_name: 'Rajesh Kumar', admission_number: '2024001', grade_name: 'Grade 10-A', total_due: 10000, amount_paid: 10000, payment_method: 'ONLINE', status: 'PAID', date: '2024-01-15' },
  { id: 'ft2', student_name: 'Priya Sharma', admission_number: '2024002', grade_name: 'Grade 12-B', total_due: 10000, amount_paid: 2000, payment_method: 'CASH', status: 'PARTIAL', date: '2024-01-15' },
  { id: 'ft3', student_name: 'Amit Singh', admission_number: '2024003', grade_name: 'Grade 11-A', total_due: 8000, amount_paid: 0, payment_method: 'UNPAID', status: 'PENDING', date: null },
  { id: 'ft4', student_name: 'Sneha Patel', admission_number: '2024004', grade_name: 'Grade 9-B', total_due: 25000, amount_paid: 25000, payment_method: 'ONLINE', status: 'PAID', date: '2024-01-10' },
  { id: 'ft5', student_name: 'Vikram Mehta', admission_number: '2024005', grade_name: 'Grade 10-B', total_due: 2000, amount_paid: 2000, payment_method: 'CASH', status: 'PAID', date: '2024-01-12' },
  { id: 'ft6', student_name: 'Ananya Reddy', admission_number: '2024006', grade_name: 'Grade 8-A', total_due: 2000, amount_paid: 0, payment_method: 'UNPAID', status: 'PENDING', date: null },
  { id: 'ft7', student_name: 'Rohan Desai', admission_number: '2024007', grade_name: 'Grade 12-A', total_due: 18000, amount_paid: 9000, payment_method: 'CASH', status: 'PARTIAL', date: '2024-01-14' },
  { id: 'ft8', student_name: 'Kavya Nair', admission_number: '2024008', grade_name: 'Grade 11-B', total_due: 5000, amount_paid: 5000, payment_method: 'ONLINE', status: 'PAID', date: '2024-01-13' },
];
