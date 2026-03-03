import React from 'react';
import { QuestionPaperGenerationResponse } from './types';

interface QuestionPaperViewProps {
    data: any; // This will be the layoutInput from GenerationResult
    zoom: number;
}

const QuestionPaperView: React.FC<QuestionPaperViewProps> = ({ data, zoom }) => {
    const qp = data.question_paper;
    const metadata = data.metadata || data;

    // Fallback for school name/exam name if not in data
    // const schoolName = "MODERN INTERNATIONAL SCHOOL";
    const examName = metadata.exam_name || "Pre-Board Examination I – January 2024";
    const logoSrc = '/school_name.png';

    return (
        <div
            className="flex flex-col items-center w-full"
            style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                marginBottom: `${(1123 * zoom * 1.5) - 1123}px` // Improved compensation for scale
            }}
        >
            <div
                className="bg-white shadow-2xl p-12 w-[794px] min-h-[1123px] font-serif text-black relative border border-gray-200"
                id="question-paper-root"
            >
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 border-b-2 border-black pb-6">
                    {/* Logo and School Name */}
                    <div className="flex flex-col items-center mb-4">
                        <img
                            src={logoSrc}
                            alt="School Logo"
                            className="max-w-[400px] h-auto mb-2 object-contain"
                            onError={(e) => {
                                // Fallback if logo doesn't exist
                                (e.target as any).style.display = 'none';
                            }}
                        />
                        {/* <h1 className="text-2xl font-bold uppercase tracking-tight text-center">
                            {schoolName}
                        </h1> */}
                    </div>

                    {/* Exam Name */}
                    <h2 className="text-lg font-bold text-center mb-4">
                        {examName}
                    </h2>

                    {/* Metadata Grid */}
                    <div className="w-full grid grid-cols-2 gap-y-3 mt-4 text-sm font-bold">
                        <div className="flex items-center gap-2">
                            <span>Subject:</span>
                            <span className="uppercase">{metadata.subject || 'N/A'}</span>
                        </div>
                        <div className="flex justify-end items-center gap-4">
                            <div className="flex items-center gap-1">
                                <span>Grade:</span>
                                <div className="border border-black px-3 py-0.5 min-w-[30px] text-center">
                                    {metadata.grade || 'X'}
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>Board:</span>
                                <div className="border border-black px-3 py-0.5 min-w-[60px] text-center uppercase">
                                    {metadata.board || 'CBSE'}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span>Duration:</span>
                            <span>{metadata.duration || '3 Hours'}</span>
                        </div>
                        <div className="flex justify-end items-center gap-2">
                            <span>Maximum Marks:</span>
                            <span>{metadata.total_marks || '80'} Marks</span>
                        </div>
                    </div>

                    {/* Student Info Section */}
                    <div className="w-full mt-6 space-y-4">
                        <div className="flex border-b border-dotted border-black">
                            <span className="font-bold text-sm whitespace-nowrap mr-2">Student Name:</span>
                            <div className="flex-1"></div>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <div className="flex-1 flex border-b border-dotted border-black">
                                <span className="font-bold text-sm whitespace-nowrap mr-2">Roll No:</span>
                                <div className="flex-1"></div>
                            </div>
                            <div className="flex-1 flex border-b border-dotted border-black">
                                <span className="font-bold text-sm whitespace-nowrap mr-2">Division:</span>
                                <div className="flex-1"></div>
                            </div>
                            <div className="flex-1 flex border-b border-dotted border-black">
                                <span className="font-bold text-sm whitespace-nowrap mr-2">Date:</span>
                                <div className="flex-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* General Instructions */}
                {qp.general_instructions && qp.general_instructions.length > 0 && (
                    <div className="mb-8">
                        <h3 className="font-bold text-sm uppercase underline mb-2">General Instructions:</h3>
                        <ul className="list-decimal list-outside ml-5 space-y-1">
                            {qp.general_instructions.map((inst: string, idx: number) => (
                                <li key={idx} className="text-[13px] italic leading-tight">
                                    {inst}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Question Paper Content */}
                <div className="space-y-8">
                    {qp.sections?.map((section: any, sIdx: number) => (
                        <div key={sIdx} className="space-y-4">
                            {/* Section Header */}
                            <div className="bg-gray-100 border-y border-black py-1 px-2 text-center">
                                <h4 className="font-bold text-sm uppercase tracking-wider">
                                    Section {section.section_id} - {section.section_marks} Marks
                                </h4>
                            </div>

                            {/* Questions */}
                            <div className="space-y-6">
                                {section.questions?.map((q: any, qIdx: number) => (
                                    <div key={qIdx} className="relative group">
                                        <div className="flex justify-between items-start gap-4">
                                            {/* Question Text */}
                                            <div className="flex-1">
                                                <div className="flex gap-2 text-sm leading-normal">
                                                    <span className="font-bold whitespace-nowrap">{q.question_number}.</span>
                                                    <div className="whitespace-pre-wrap">{q.question_text}</div>
                                                </div>

                                                {/* Options (MCQ) */}
                                                {q.options && (
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 ml-6">
                                                        {q.options.map((opt: string, oIdx: number) => (
                                                            <div key={oIdx} className="text-[13px] flex gap-2">
                                                                <span className="font-bold">({String.fromCharCode(97 + oIdx)})</span>
                                                                <span>{opt}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Marks */}
                                            <div className="text-sm font-bold whitespace-nowrap pt-0.5">
                                                [{q.marks || 1}]
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Message */}
                <div className="mt-16 text-center border-t border-black pt-4">
                    <p className="text-xs font-bold uppercase tracking-widest italic">
                        --- End of Question Paper ---
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuestionPaperView;
