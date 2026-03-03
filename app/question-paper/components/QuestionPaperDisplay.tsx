import React from "react";
import { QuestionPaperR2Data } from "./types";

interface QuestionPaperDisplayProps {
    data: QuestionPaperR2Data;
}

export default function QuestionPaperDisplay({ data }: QuestionPaperDisplayProps) {
    const { question_paper, board, grade } = data;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm border border-gray-200 rounded-xl font-serif">
            {/* Header */}
            <div className="text-center mb-8 border-b border-gray-200 pb-6">
                <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">
                    {board} QUESTION PAPER
                </h1>
                <div className="flex justify-between items-center text-gray-600 mt-4 px-4">
                    <span><strong>Subject:</strong> {question_paper.metadata.subject_name}</span>
                    <span><strong>Grade:</strong> {grade}</span>
                </div>
            </div>

            {/* General Instructions */}
            {question_paper.general_instructions && question_paper.general_instructions.length > 0 && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-2">General Instructions:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {question_paper.general_instructions.map((inst, idx) => (
                            <li key={idx}>{inst}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Sections */}
            <div className="space-y-8">
                {question_paper.sections.map((section) => (
                    <div key={section.section_id}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800 uppercase">
                                Section {section.section_id}
                            </h2>
                            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {section.section_marks} Marks
                            </span>
                        </div>

                        <div className="space-y-6">
                            {section.questions.map((question) => (
                                <div key={question.question_number} className="flex gap-4">
                                    <div className="font-bold text-gray-900 w-8">{question.question_number}.</div>
                                    <div className="flex-1">
                                        <p className="text-gray-800 mb-2">{question.question_text}</p>

                                        {/* Options for MCQs */}
                                        {question.options && question.options.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-2">
                                                {question.options.map((option, optIdx) => (
                                                    <div key={optIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                                        <span className="font-medium">({String.fromCharCode(65 + optIdx)})</span>
                                                        <span>{option}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="font-semibold text-gray-500 text-sm w-12 text-right">
                                        [{question.marks}]
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
