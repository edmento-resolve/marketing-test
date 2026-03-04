"use client";

import { useState, useEffect } from "react";
import { questionPaperApi } from "./api";

import type { BasicDetails, Class, Subject, Board } from "./types";

interface BasicDetailsStepProps {
    basicDetails: BasicDetails;
    isLoading: boolean;
    updateBasicDetails: (details: Partial<BasicDetails>) => void;
}

export function BasicDetailsStep({
    basicDetails,
    isLoading,
    updateBasicDetails,
}: BasicDetailsStepProps) {

    const [classes, setClasses] = useState<Class[]>([]);
    const [boards, setBoards] = useState<Board[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
    const [subjectsLoading, setSubjectsLoading] = useState(false);
    const [classesLoading, setClassesLoading] = useState(false);
    const [boardsLoading, setBoardsLoading] = useState(false);

    // Fetch classes and boards on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            setClassesLoading(true);
            setBoardsLoading(true);
            try {
                const [classesRes, boardsRes] = await Promise.all([
                    questionPaperApi.fetchClasses(),
                    questionPaperApi.fetchBoards()
                ]);

                if (classesRes.success) {
                    setClasses(classesRes.data);
                }
                if (boardsRes.success) {
                    setBoards(boardsRes.data);
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setClassesLoading(false);
                setBoardsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch subjects when class is selected
    useEffect(() => {
        const fetchSubjectsFromApi = async () => {
            if (basicDetails.class && basicDetails.board_id) {
                setSubjectsLoading(true);
                try {
                    const response = await questionPaperApi.fetchSubjects(basicDetails.board_id);
                    if (response.success) {
                        // Filter duplicates by name to avoid duplicates in UI
                        // but still map it to Subject objects
                        const uniqueMap = new Map<string, Subject>();
                        response.data.forEach(s => {
                            if (!uniqueMap.has(s.subject_name)) {
                                uniqueMap.set(s.subject_name, s);
                            }
                        });
                        setAvailableSubjects(Array.from(uniqueMap.values()));
                    }
                } catch (error) {
                    console.error("Error fetching subjects:", error);
                } finally {
                    setSubjectsLoading(false);
                }
            } else {
                setAvailableSubjects([]);
            }
        };

        fetchSubjectsFromApi();
    }, [basicDetails.class, basicDetails.board_id]);


    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subjectId = e.target.value;
        const subject = availableSubjects.find((s: any) => s.id === subjectId);
        updateBasicDetails({
            subject_id: subjectId,
            subject_name: subject?.subject_name || "",
        });
    };

    if (isLoading || classesLoading || boardsLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Basic Details
                    </h2>
                    <p className="text-gray-600">Loading details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Basic Details
                </h2>
                <p className="text-gray-600">
                    Provide the basic information for your question paper
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Board
                    </label>
                    <select
                        value={basicDetails.board_id}
                        onChange={(e) => {
                            updateBasicDetails({
                                board_id: e.target.value
                            });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    >
                        <option value="">Select Board</option>
                        {boards.map((board) => (
                            <option key={board.id} value={board.id}>
                                {board.board_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class
                    </label>
                    <select
                        value={basicDetails.class}
                        onChange={(e) => {
                            updateBasicDetails({
                                class: e.target.value,
                                subject_id: "",
                                subject_name: ""
                            });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {`Class ${cls.class_number}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                    </label>
                    <select
                        value={basicDetails.subject_id}
                        onChange={handleSubjectChange}
                        disabled={!basicDetails.class || subjectsLoading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">
                            {subjectsLoading ? "Loading Subjects..." : "Select Subject"}
                        </option>
                        {availableSubjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.subject_name}
                            </option>
                        ))}
                    </select>
                    {!basicDetails.class && (
                        <p className="text-xs text-gray-500 mt-1">
                            Please select a class first
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Duration (minutes)
                    </label>
                    <input
                        type="number"
                        value={basicDetails.examDuration}
                        onChange={(e) =>
                            updateBasicDetails({
                                examDuration: e.target.value,
                            })
                        }
                        placeholder="e.g., 180"
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>
            </div>
        </div>
    );
}
