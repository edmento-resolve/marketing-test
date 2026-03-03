export const schoolData = {
    overview: {
        totalStudents: 2480,
        attendanceRate: 94,
        activeTeachers: 142,
        upcomingExams: 12,
        feeCollectionRate: 84.2,
        studentAttendanceGrowth: 1.2,
        facultyAttendanceRate: 98.2,
        lastTermOverallPerf: 76.5,
        currentTermOverallPerf: 81.2,
    },
    syllabusCompletion: [
        { grade: 'Grade 8', subject: 'Mathematics', completion: 78, target: 100 },
        { grade: 'Grade 8', subject: 'Science', completion: 82, target: 100 },
        { grade: 'Grade 9', subject: 'Mathematics', completion: 85, target: 100 },
        { grade: 'Grade 10', subject: 'Science', completion: 72, target: 100 },
        { grade: 'Grade 11', subject: 'Physics', completion: 90, target: 100 },
        { grade: 'Grade 12', subject: 'English', completion: 65, target: 100 },
    ],
    classPerformance: [
        { grade: '10-A', averageScore: 88, lastTermScore: 82, growth: 6.0, status: 'Top' },
        { grade: '11-A', averageScore: 92, lastTermScore: 89, growth: 3.0, status: 'Excellent' },
        { grade: '9-C', averageScore: 82, lastTermScore: 78, growth: 4.0, status: 'Improving' },
        { grade: '10-B', averageScore: 76, lastTermScore: 77, growth: -1.0, status: 'Stable' },
        { grade: '8-B', averageScore: 64, lastTermScore: 68, growth: -4.0, status: 'Needs Attention' },
    ],
    class8SubjectWise: [
        { subject: 'Mathematics', score: 62 },
        { subject: 'Science', score: 68 },
        { subject: 'English', score: 75 },
        { subject: 'Social Studies', score: 71 },
        { subject: 'Arts', score: 88 },
    ],
    subjectPerformance: [
        {
            subject: 'Mathematics', averageScore: 78, improved: true, classes: [
                { grade: '8-B', score: 62 },
                { grade: '10-A', score: 85 },
                { grade: '9-C', score: 79 }
            ]
        },
        {
            subject: 'Physics', averageScore: 84, improved: true, classes: [
                { grade: '11-A', score: 92 },
                { grade: '10-A', score: 76 }
            ]
        },
        {
            subject: 'Chemistry', averageScore: 72, improved: false, classes: [
                { grade: '11-A', score: 70 },
                { grade: '10-A', score: 74 }
            ]
        },
        {
            subject: 'English', averageScore: 81, improved: true, classes: [
                { grade: '8-B', score: 75 },
                { grade: '12-A', score: 88 }
            ]
        },
    ],
    attendanceTrends: [
        { month: 'Sep', value: 82 },
        { month: 'Oct', value: 88 },
        { month: 'Nov', value: 85 },
        { month: 'Dec', value: 92 },
        { month: 'Jan', value: 90 },
        { month: 'Feb', value: 94 },
    ],
    examSegmentation: [
        { label: 'Below 50', value: 18, color: '#f97316' },
        { label: '50 - 80', value: 45, color: '#eab308' },
        { label: 'Above 80', value: 37, color: '#10b981' },
    ],
    facultyOnLeave: [
        { name: "Dr. Sarah Johnson", role: "Senior HOD", subjects: ["Mathematics", "Physics"] },
        { name: "Robert Wilson", role: "Art Teacher", subjects: ["Visual Arts"] },
        { name: "Emma Davis", role: "English Faculty", subjects: ["English Lit."] }
    ],
    priorityTasks: [
        { title: "Review Annual Budget 2026", due_date: "Today, 4:00 PM", priority: "HIGH" },
        { title: "Staff Performance Reviews", due_date: "Tomorrow, 10:00 AM", priority: "MEDIUM" },
        { title: "PTA Meeting Preparation", due_date: "28 Feb, 2026", priority: "LOW" }
    ],
    announcements: [
        { id: '1', sender: 'Administrative Office', message: 'New safety protocols updated for the upcoming sports meet.', time: '20m ago', unread: true },
        { id: '2', sender: 'Coordinator Office', message: 'Finalized the midterm schedule for Grade 10 and 12.', time: '1h ago', unread: true },
        { id: '3', sender: 'System Alert', message: 'School management system backup completed successfully.', time: '5h ago', unread: false }
    ]
};
