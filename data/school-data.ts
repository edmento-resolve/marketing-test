import { grade10StudentsData } from './student-data';

export const schoolData = {
    overview: {
        totalStudents: 3245,
        newAdmissions: 215,
        activeTeachers: 182,
        totalStaff: 240,
        studentTeacherRatio: '18:1',
        totalClassrooms: 110,
        attendanceRate: 95.8,
        facultyAttendanceRate: 98.4,
        studentAttendanceGrowth: 1.5,
        feeCollectionRate: 92.4,
        upcomingExams: 14,
        lastTermOverallPerf: 78.5,
        currentTermOverallPerf: 83.2,
        disciplinaryIncidents: 3,
        parentMeetingsScheduled: 8,
        transportUtilization: 82.5,
        libraryBooksIssued: 1450,
    },
    syllabusCompletion: [
        { grade: 'Grade 6', subject: 'Mathematics', completion: 82, target: 100 },
        { grade: 'Grade 6', subject: 'Science', completion: 88, target: 100 },
        { grade: 'Grade 7', subject: 'Mathematics', completion: 74, target: 100 },
        { grade: 'Grade 7', subject: 'Science', completion: 80, target: 100 },
        { grade: 'Grade 8', subject: 'Mathematics', completion: 78, target: 100 },
        { grade: 'Grade 8', subject: 'Science', completion: 85, target: 100 },
        { grade: 'Grade 9', subject: 'Mathematics', completion: 65, target: 100 },
        { grade: 'Grade 9', subject: 'Physics', completion: 72, target: 100 },
        { grade: 'Grade 9', subject: 'Chemistry', completion: 68, target: 100 },
        { grade: 'Grade 10', subject: 'Mathematics', completion: 88, target: 100 },
        { grade: 'Grade 10', subject: 'Physics', completion: 92, target: 100 },
        { grade: 'Grade 10', subject: 'Chemistry', completion: 85, target: 100 },
        { grade: 'Grade 11', subject: 'Physics', completion: 60, target: 100 },
        { grade: 'Grade 11', subject: 'Biology', completion: 75, target: 100 },
        { grade: 'Grade 12', subject: 'Mathematics', completion: 95, target: 100 },
        { grade: 'Grade 12', subject: 'Chemistry', completion: 94, target: 100 },
        { grade: 'Grade 12', subject: 'English', completion: 98, target: 100 },
        { grade: 'Grade 12', subject: 'Computer Science', completion: 90, target: 100 },
    ],
    classPerformance: [
        { grade: '12-A (Sci)', averageScore: 91.5, lastTermScore: 88.0, growth: 3.5, status: 'Top' },
        { grade: '10-A', averageScore: 89.2, lastTermScore: 84.5, growth: 4.7, status: 'Excellent' },
        { grade: '11-B (Com)', averageScore: 85.0, lastTermScore: 82.0, growth: 3.0, status: 'Good' },
        { grade: '9-A', averageScore: 84.5, lastTermScore: 79.5, growth: 5.0, status: 'Improving' },
        { grade: '8-C', averageScore: 78.0, lastTermScore: 76.5, growth: 1.5, status: 'Stable' },
        { grade: '10-C', averageScore: 74.5, lastTermScore: 77.0, growth: -2.5, status: 'Declining' },
        { grade: '11-C (Arts)', averageScore: 72.0, lastTermScore: 71.0, growth: 1.0, status: 'Stable' },
        { grade: '9-C', averageScore: 68.5, lastTermScore: 74.0, growth: -5.5, status: 'Needs Attention' },
        { grade: '7-B', averageScore: 65.0, lastTermScore: 67.5, growth: -2.5, status: 'Needs Attention' },
    ],
    class8SubjectWise: [
        { subject: 'Mathematics', score: 72 },
        { subject: 'Science', score: 78 },
        { subject: 'English', score: 85 },
        { subject: 'Social Studies', score: 76 },
        { subject: 'Computer Science', score: 92 },
        { subject: 'Second Language', score: 81 },
        { subject: 'Arts', score: 88 },
    ],
    subjectPerformance: [
        {
            subject: 'Mathematics', averageScore: 82, improved: true, classes: [
                { grade: '12-A', score: 94 },
                { grade: '10-A', score: 88 },
                { grade: '9-C', score: 65 },
                { grade: '8-B', score: 72 },
                { grade: '7-A', score: 85 }
            ]
        },
        {
            subject: 'Physics', averageScore: 86, improved: true, classes: [
                { grade: '12-A', score: 92 },
                { grade: '11-A', score: 84 },
                { grade: '10-B', score: 81 },
                { grade: '9-A', score: 85 }
            ]
        },
        {
            subject: 'Chemistry', averageScore: 78, improved: false, classes: [
                { grade: '12-A', score: 89 },
                { grade: '11-A', score: 74 },
                { grade: '10-A', score: 82 },
                { grade: '9-B', score: 68 }
            ]
        },
        {
            subject: 'Biology', averageScore: 88, improved: true, classes: [
                { grade: '12-B', score: 91 },
                { grade: '11-B', score: 86 },
                { grade: '10-C', score: 84 },
                { grade: '9-C', score: 89 }
            ]
        },
        {
            subject: 'Computer Science', averageScore: 91, improved: true, classes: [
                { grade: '12-A', score: 96 },
                { grade: '11-C', score: 88 },
                { grade: '10-B', score: 92 },
                { grade: '8-A', score: 89 }
            ]
        },
        {
            subject: 'English', averageScore: 85, improved: true, classes: [
                { grade: '12-C', score: 89 },
                { grade: '11-A', score: 84 },
                { grade: '10-A', score: 86 },
                { grade: '9-B', score: 81 },
                { grade: '8-B', score: 85 }
            ]
        },
        {
            subject: 'History', averageScore: 76, improved: false, classes: [
                { grade: '10-C', score: 72 },
                { grade: '9-A', score: 78 },
                { grade: '8-C', score: 74 },
                { grade: '7-B', score: 79 }
            ]
        },
    ],
    attendanceTrends: [
        { month: 'Jul', value: 91.2 },
        { month: 'Aug', value: 92.5 },
        { month: 'Sep', value: 90.8 },
        { month: 'Oct', value: 93.4 },
        { month: 'Nov', value: 95.1 },
        { month: 'Dec', value: 89.5 },
        { month: 'Jan', value: 94.2 },
        { month: 'Feb', value: 96.8 },
        { month: 'Mar', value: 95.8 },
    ],
    examSegmentation: [
        { label: 'Below 40% (Remedial)', value: 8, color: '#ef4444' },    // red-500
        { label: '40% - 60% (Pass)', value: 22, color: '#f97316' },      // orange-500
        { label: '60% - 80% (First Class)', value: 45, color: '#eab308' }, // yellow-500
        { label: '80% - 90% (Distinction)', value: 18, color: '#3b82f6' }, // blue-500
        { label: 'Above 90% (Select)', value: 7, color: '#10b981' },     // emerald-500
    ],
    facultyOnLeave: [
        { name: "Dr. Sarah Johnson", role: "Head of Science Dept.", subjects: ["Physics XII"] },
        { name: "Robert Wilson", role: "Sr. Art Teacher", subjects: ["Visual Arts"] },
        { name: "Emma Davis", role: "English Faculty", subjects: ["English Lit. IX, X"] },
        { name: "Michael Chen", role: "PE Instructor", subjects: ["Physical Education"] },
        { name: "Elena Rodriguez", role: "Math Teacher", subjects: ["Mathematics VII, VIII"] }
    ],
    priorityTasks: [
        { title: "Review Board Exam Registration Data", due_date: "Today, 2:00 PM", priority: "HIGH" },
        { title: "Approve Term 2 Budget Reallocation", due_date: "Today, 5:00 PM", priority: "HIGH" },
        { title: "Teacher Evaluation Meetings (Science Dept)", due_date: "Tomorrow, 9:30 AM", priority: "MEDIUM" },
        { title: "Review Disciplinary Report for 9-C", due_date: "Tomorrow, 1:00 PM", priority: "MEDIUM" },
        { title: "Finalize Annual Sports Day Schedule", due_date: "Next Week", priority: "LOW" },
        { title: "PTA Committee Meeting Prep", due_date: "12 Mar, 2026", priority: "LOW" }
    ],
    announcements: [
        { id: '1', sender: 'State Board Authority', message: 'Updated circular regarding changes in Grade 10 practical exam evaluation rubrics.', time: '10m ago', unread: true },
        { id: '2', sender: 'Administrative Office', message: 'Bus Route 4 delayed by 20 minutes due to heavy traffic on Main Street.', time: '45m ago', unread: true },
        { id: '3', sender: 'Head of IT', message: 'Scheduled maintenance for the learning management portal tonight at 11 PM.', time: '2h ago', unread: false },
        { id: '4', sender: 'Coordinator Office', message: 'Finalized the midterm schedule for Grades 9 through 12.', time: '5h ago', unread: false },
        { id: '5', sender: 'HR Department', message: 'Interview schedule for new Special Educator position confirmed for Thursday.', time: '1d ago', unread: false }
    ],
    financialOverview: {
        totalBudget: 2500000,
        utilizedBudget: 1850000,
        pendingDues: 125000,
        scholarshipsAwarded: 45000,
        revenueFromEvents: 12000
    },
    incidentReports: [
        { id: 'INC-101', type: 'Disciplinary', description: 'Altercation in cafeteria during lunch break', date: '2026-03-03', status: 'Resolved' },
        { id: 'INC-102', type: 'Medical', description: 'Student twisted ankle in PE class', date: '2026-03-02', status: 'Follow-up Required' },
        { id: 'INC-103', type: 'Property', description: 'Chemistry lab window broken', date: '2026-02-28', status: 'Pending Repair' }
    ],
    grade10Students: grade10StudentsData
};
