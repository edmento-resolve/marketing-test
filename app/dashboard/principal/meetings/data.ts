
export interface PrincipalMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
}

export interface PrincipalGroup {
    id: string;
    name: string;
    description: string;
    memberIds: string[];
}

export interface ScheduledMeeting {
    id: string;
    title: string;
    time: string;
    type: string;
    link?: string;
    venue?: string;
    audience: string[];
    status: string;
}

export interface MeetingHistory {
    id: string;
    title: string;
    date: string;
    type: string;
    duration: string;
    participants: number;
}

export const MOCK_MEMBERS: PrincipalMember[] = [
    { id: "p1", name: "Dr. Elena Gilbert", role: "Academic Dean", avatar: "https://i.pravatar.cc/150?u=elena" },
    { id: "p2", name: "Stefan Salvatore", role: "Director of Operations", avatar: "https://i.pravatar.cc/150?u=stefan" },
    { id: "p3", name: "Damon Salvatore", role: "Finance Head", avatar: "https://i.pravatar.cc/150?u=damon" },
    { id: "p4", name: "Bonnie Bennett", role: "Special Education Lead", avatar: "https://i.pravatar.cc/150?u=bonnie" },
    { id: "p5", name: "Caroline Forbes", role: "Student Affairs Coordinator", avatar: "https://i.pravatar.cc/150?u=caroline" },
    { id: "p6", name: "Alaric Saltzman", role: "Science Department HOD", avatar: "https://i.pravatar.cc/150?u=alaric" },
    { id: "p7", name: "Tyler Lockwood", role: "Sports Director", avatar: "https://i.pravatar.cc/150?u=tyler" },
    { id: "p8", name: "Jeremy Gilbert", role: "IT Admin Lead", avatar: "https://i.pravatar.cc/150?u=jeremy" },
];

export const MOCK_GROUPS: PrincipalGroup[] = [
    {
        id: "g1",
        name: "Strategic Committee",
        description: "Deans and Finance Lead for institutional planning",
        memberIds: ["p1", "p2", "p3"],
    },
    {
        id: "g2",
        name: "Department Heads",
        description: "All subject HODs for academic oversight",
        memberIds: ["p4", "p6", "p8"],
    },
];

export const MOCK_SCHEDULED_MEETINGS: ScheduledMeeting[] = [
    {
        id: "m1",
        title: "Annual institutional Strategy Review",
        time: "Today, 04:00 PM - 05:30 PM",
        type: "online",
        link: "https://meet.google.com/abc-defg-hij",
        audience: ["Elena Gilbert", "Stefan Salvatore", "Damon Salvatore"],
        status: "scheduled",
    },
    {
        id: "m2",
        title: "Board of Directors Briefing",
        time: "Tomorrow, 09:30 AM - 11:00 AM",
        type: "offline",
        venue: "Executive Boardroom",
        audience: ["Academic Dean", "Operations Director"],
        status: "scheduled",
    },
];

export const MOCK_MEETING_HISTORY: MeetingHistory[] = [
    {
        id: "h1",
        title: "Quarterly Performance Audit",
        date: "Feb 28, 2024",
        type: "online",
        duration: "1h 45m",
        participants: 15,
    },
    {
        id: "h2",
        title: "HOD Monthly Sync",
        date: "Feb 20, 2024",
        type: "offline",
        duration: "1h 15m",
        participants: 9,
    },
];
