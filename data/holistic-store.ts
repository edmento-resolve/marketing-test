import { useState, useEffect, useMemo, useCallback } from 'react';
import { grade10StudentsData } from './student-data';
import {
    GraduationCap,
    Brain,
    MessageSquare,
    Users,
    Heart,
    Palette,
    Activity,
    Award
} from 'lucide-react';

export type SkillLevel = 'Beginner' | 'Progressing' | 'Proficient' | 'Advanced' | 'Not Assessed';

export interface StudentProgress {
    id: string;
    name: string;
    evaluations: Record<string, SkillLevel>;
    code: string;
    classId: string;
    className: string;
}

export interface ClassData {
    id: string;
    name: string;
    students: StudentProgress[];
    insights: {
        skill: string;
        level: SkillLevel;
        percentage: number;
    }[];
}

export const DOMAINS = [
    { id: 'academic', name: 'Academic', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'cognitive', name: 'Cognitive', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'communication', name: 'Communication', icon: MessageSquare, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { id: 'social', name: 'Social', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'emotional', name: 'Emotional', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'creative', name: 'Creative', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'physical', name: 'Physical', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'leadership', name: 'Leadership', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
];

export const SUB_DOMAINS: Record<string, string[]> = {
    physical: ['Motor Skills', 'Physical Health', 'Hygiene', 'Safety', 'Sensory Perception', 'Stamina'],
    academic: ['Literacy', 'Numeracy', 'General Knowledge', 'Language', 'Science awareness'],
    cognitive: ['Problem Solving', 'Logical Thinking', 'Memory', 'Attention', 'Curiosity'],
    social: ['Teamwork', 'Empathy', 'Conflict Resolution', 'Peer Interaction', 'Social Manners'],
    emotional: ['Self Awareness', 'Self Regulation', 'Confidence', 'Motivation', 'Resilience'],
    communication: ['Listening Skills', 'Verbal Expression', 'Non-verbal Communication', 'Understanding Instructions'],
    creative: ['Artistic Expression', 'Music & Rhythm', 'Imagination', 'Storytelling'],
    leadership: ['Responsibility', 'Initiative', 'Guidance', 'Decision Making'],
};

export const ASSESSMENT_LEVELS = [
    { label: 'Beginner', value: 'Beginner', color: 'bg-rose-500' },
    { label: 'Progressing', value: 'Progressing', color: 'bg-slate-300' },
    { label: 'Proficient', value: 'Proficient', color: 'bg-slate-300' },
    { label: 'Advanced', value: 'Advanced', color: 'bg-slate-300' },
];

// Dynamically build class structure from the actual student data
const INITIAL_CLASSES: ClassData[] = Object.values(
    grade10StudentsData.reduce((acc, student) => {
        const classId = `${student.grade}-${student.section}`;
        if (!acc[classId]) {
            acc[classId] = {
                id: classId,
                name: `Class ${classId}`,
                students: [],
                insights: [
                    { skill: 'Foundational Literacy', level: 'Proficient', percentage: 75 },
                    { skill: 'Foundational Numeracy', level: 'Progressing', percentage: 40 },
                ]
            };
        }

        // Randomly assign some initial evaluations or leave them blank
        const mockEvals: Record<string, SkillLevel> = {};

        acc[classId].students.push({
            id: student.id,
            name: student.name,
            classId: classId,
            className: `Class ${classId}`,
            evaluations: mockEvals,
            code: student.id,
        });

        return acc;
    }, {} as Record<string, ClassData>)
);

export function useHolisticStore() {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const classesToUse = classes.length > 0 ? classes : INITIAL_CLASSES;

    // We get all students in a flat array for the dropdowns
    const allStudents = useMemo(() => classesToUse.flatMap((c) => c.students), [classesToUse]);

    useEffect(() => {
        const stored = localStorage.getItem('holistic-data-store-v4');
        if (stored) {
            setClasses(JSON.parse(stored));
        } else {
            localStorage.setItem('holistic-data-store-v4', JSON.stringify(INITIAL_CLASSES));
            setClasses(INITIAL_CLASSES);
        }

        // Listen for storage events (if user updates in another tab)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'holistic-data-store-v4' && e.newValue) {
                setClasses(JSON.parse(e.newValue));
            }
        };

        // Listen for manual same-tab sync events to bypass Next.js Client Router Cache bugs
        const handleCustomSync = () => {
            const storedData = localStorage.getItem('holistic-data-store-v4');
            if (storedData) setClasses(JSON.parse(storedData));
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('local-storage-sync', handleCustomSync);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('local-storage-sync', handleCustomSync);
        };
    }, []);

    const updateEvaluations = useCallback((studentId: string, newEvaluations: Record<string, string>) => {
        setClasses(prev => {
            const newData = prev.map(c => ({
                ...c,
                students: c.students.map(s => {
                    if (s.id === studentId) {
                        return { ...s, evaluations: { ...s.evaluations, ...newEvaluations } as any };
                    }
                    return s;
                })
            }));
            localStorage.setItem('holistic-data-store-v4', JSON.stringify(newData));
            // Force ALL mounted variations of this store layout to sync synchronously across Next.js cached pages
            window.dispatchEvent(new Event('local-storage-sync'));
            return newData;
        });
    }, []);

    return {
        classes: classesToUse,
        allStudents,
        updateEvaluations
    };
}
