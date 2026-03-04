import React from "react";
import { QuestionCard } from "./QuestionCard";

interface Question {
    question_number: string;
    question_text: string;
    marks: number;
    options?: string[];
    has_diagram?: boolean;
}

interface Section {
    section_id: string;
    section_marks: number;
    questions: Question[];
}

interface SectionViewProps {
    section: Section;
    r2Key: string | null;
}

export const SectionView: React.FC<SectionViewProps> = ({ section, r2Key }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-gray-200 flex-1" />
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                        Section {section.section_id}
                    </h2>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                        {section.section_marks} Marks
                    </span>
                </div>
                <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="space-y-6">
                {section.questions.map((q) => (
                    <QuestionCard key={q.question_number} question={q} r2Key={r2Key} />
                ))}
            </div>
        </div>
    );
};
