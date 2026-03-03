import React from "react";
import { MarkingSchemeR2Data } from "./types";

interface MarkingSchemeDisplayProps {
    data: MarkingSchemeR2Data;
}

export default function MarkingSchemeDisplay({ data }: MarkingSchemeDisplayProps) {
    const { marking_scheme } = data;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm border border-gray-200 rounded-xl font-sans">
            <div className="text-center mb-8 border-b border-gray-200 pb-6">
                <h1 className="text-2xl font-bold uppercase tracking-wider text-green-700">
                    Marking Scheme
                </h1>
                <p className="text-gray-500 text-sm mt-2">Reference ID: {data.id}</p>
            </div>

            <div className="space-y-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 bg-gray-100 p-3 rounded-t-lg font-bold text-gray-700 text-sm uppercase">
                    <div className="col-span-1">QNo.</div>
                    <div className="col-span-1">Sec</div>
                    <div className="col-span-8">Answer / Marking Points</div>
                    <div className="col-span-2 text-right">Marks</div>
                </div>

                {/* Rows */}
                {marking_scheme.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 border-b border-gray-100 p-3 items-start hover:bg-gray-50 transition-colors">
                        <div className="col-span-1 font-bold text-gray-900">{item.question_number}</div>
                        <div className="col-span-1 text-gray-500 text-sm">{item.section}</div>
                        <div className="col-span-8">
                            {/* Correct Answer for MCQs */}
                            {item.correct_answer && (
                                <div className="mb-2">
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">
                                        Correct Option: {item.correct_answer}
                                    </span>
                                </div>
                            )}

                            {/* Marking Points */}
                            <ul className="text-sm text-gray-700 space-y-1">
                                {item.marking_points.map((point, pIdx) => (
                                    <li key={pIdx} className="flex gap-2">
                                        <span className="text-gray-400">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-span-2 text-right font-semibold text-gray-900">
                            {item.total_marks}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
