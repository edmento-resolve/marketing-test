"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, ArrowLeft, Plus, X, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { BasicDetailsStep } from "../components/BasicDetailsStep";
import { questionPaperApi } from "../components/api";
import type { BasicDetails, DifficultyLevel, QuestionPaperGenerationResponse } from "../components/types";
import QuestionPaperLoading from "../components/QuestionPaperLoading";

import dynamic from 'next/dynamic';


const GenerationResult = dynamic(() => import("../components/GenerationResult"), { ssr: false });

// Types retained temporarily until other components are migrated
interface TopicQuestion {
  id: string;
  type: string;
  numberOfQuestions: string;
  marksPerQuestion: string;
}

interface PredefinedTopic {
  id: string;
  name: string;
  questions: TopicQuestion[];
}

interface PredefinedChapter {
  id: string;
  name: string;
  subtopics: { id: string; name: string }[];
}

interface SelectedSubtopic {
  chapterId: string;
  subtopicId: string;
}

interface ChapterQuestionType {
  chapterId: string;
  questions: TopicQuestion[];
}

export default function QuestionPaperPage() {

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    board_id: "",
    class: "",
    subject_id: "",
    subject_name: "",
    examDuration: "",
  });
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>({
    easy: 30,
    medium: 40,
    hard: 30,
  });
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<SelectedSubtopic[]>([]);
  const [generationResult, setGenerationResult] = useState<QuestionPaperGenerationResponse | null>(null);
  const [chapterQuestionTypes, setChapterQuestionTypes] = useState<ChapterQuestionType[]>([]);


  const [chapters, setChapters] = useState<PredefinedChapter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingChapters, setIsFetchingChapters] = useState(false);

  // No fetching needed for static data
  useEffect(() => {
    // Boards and classes are now static
  }, []);

  const updateBasicDetails = (details: Partial<BasicDetails>) => {
    setBasicDetails(prev => ({ ...prev, ...details }));
  };



  const updateDifficulty = (level: keyof DifficultyLevel, value: number) => {
    const newDifficulty = { ...difficultyLevel, [level]: value };
    const total = newDifficulty.easy + newDifficulty.medium + newDifficulty.hard;

    if (total <= 100) {
      setDifficultyLevel(newDifficulty);
    } else {
      // Adjust other levels to keep total at 100
      const remaining = 100 - value;
      const otherLevels = Object.keys(newDifficulty).filter(
        (k) => k !== level
      ) as Array<keyof DifficultyLevel>;
      const otherTotal = otherLevels.reduce(
        (sum, k) => sum + newDifficulty[k],
        0
      );

      if (otherTotal > 0) {
        otherLevels.forEach((k) => {
          newDifficulty[k] = Math.round((newDifficulty[k] / otherTotal) * remaining);
        });
      } else {
        otherLevels.forEach((k) => {
          newDifficulty[k] = Math.round(remaining / otherLevels.length);
        });
      }

      setDifficultyLevel(newDifficulty);
    }
  };

  // Toggle chapter selection
  const toggleChapter = (chapterId: string) => {
    // ... same implementation ...
    // Keeping existing implementation for step 3+ as they are not refactored yet
    const chapter = chapters.find((ch) => ch.id === chapterId);
    if (!chapter) return;

    if (selectedChapters.includes(chapterId)) {
      // Remove chapter and all its subtopics
      setSelectedChapters(selectedChapters.filter((id) => id !== chapterId));
      setSelectedSubtopics(
        selectedSubtopics.filter((st) => st.chapterId !== chapterId)
      );
      setChapterQuestionTypes(
        chapterQuestionTypes.filter((ch) => ch.chapterId !== chapterId)
      );
    } else {
      // Add chapter with all subtopics auto-selected
      setSelectedChapters([...selectedChapters, chapterId]);
      const newSubtopics: SelectedSubtopic[] = chapter.subtopics.map(
        (subtopic) => ({
          chapterId,
          subtopicId: subtopic.id,
        })
      );
      setSelectedSubtopics([...selectedSubtopics, ...newSubtopics]);
      // Initialize question types for this chapter
      setChapterQuestionTypes([
        ...chapterQuestionTypes,
        {
          chapterId,
          questions: [
            {
              id: Date.now().toString() + "-" + chapterId,
              type: "",
              numberOfQuestions: "",
              marksPerQuestion: "",
            },
          ],
        },
      ]);
    }
  };

  // Toggle subtopic selection
  const toggleSubtopic = (chapterId: string, subtopicId: string) => {
    // ... same implementation ...
    const isSelected = selectedSubtopics.some(
      (st) => st.chapterId === chapterId && st.subtopicId === subtopicId
    );

    if (isSelected) {
      setSelectedSubtopics(
        selectedSubtopics.filter(
          (st) => !(st.chapterId === chapterId && st.subtopicId === subtopicId)
        )
      );
    } else {
      setSelectedSubtopics([
        ...selectedSubtopics,
        { chapterId, subtopicId },
      ]);
    }
  };

  // Add question type to chapter
  const addQuestionType = (chapterId: string) => {
    // ... same implementation ...
    setChapterQuestionTypes(
      chapterQuestionTypes.map((chapter) =>
        chapter.chapterId === chapterId
          ? {
            ...chapter,
            questions: [
              ...chapter.questions,
              {
                id: Date.now().toString() + "-" + chapterId,
                type: "",
                numberOfQuestions: "",
                marksPerQuestion: "",
              },
            ],
          }
          : chapter
      )
    );
  };

  // Remove question type from chapter
  const removeQuestionType = (chapterId: string, questionId: string) => {
    // ... same implementation ...
    setChapterQuestionTypes(
      chapterQuestionTypes.map((chapter) =>
        chapter.chapterId === chapterId
          ? {
            ...chapter,
            questions: chapter.questions.filter((q) => q.id !== questionId),
          }
          : chapter
      )
    );
  };

  // Update question type
  const updateQuestionType = (
    chapterId: string,
    questionId: string,
    field: "type" | "numberOfQuestions" | "marksPerQuestion",
    value: string
  ) => {
    // ... same implementation ...
    setChapterQuestionTypes(
      chapterQuestionTypes.map((chapter) =>
        chapter.chapterId === chapterId
          ? {
            ...chapter,
            questions: chapter.questions.map((q) =>
              q.id === questionId ? { ...q, [field]: value } : q
            ),
          }
          : chapter
      )
    );
  };

  const validateStep1 = () => {
    return (
      basicDetails.board_id.trim() !== "" &&
      basicDetails.class.trim() !== "" &&
      basicDetails.subject_id.trim() !== "" &&
      basicDetails.examDuration.trim() !== ""
    );
  };

  const validateStep3 = () => {
    return selectedChapters.length > 0 && selectedSubtopics.length > 0;
  };

  const validateStep4 = () => {
    if (selectedChapters.length === 0) return false;
    return chapterQuestionTypes.every(
      (chapter) =>
        chapter.questions.length > 0 &&
        chapter.questions.every(
          (q) =>
            q.type.trim() !== "" &&
            q.numberOfQuestions.trim() !== "" &&
            q.marksPerQuestion.trim() !== ""
        )
    );
  };

  const fetchChapters = async () => {
    setIsFetchingChapters(true);
    try {
      // 1. Get portion plans to find the R2 key
      const portionPlansRes = await questionPaperApi.fetchPortionPlans(
        basicDetails.subject_id,
        basicDetails.class
      );

      if (portionPlansRes.success && portionPlansRes.data.length > 0) {
        console.log("Portion plans data:", portionPlansRes.data);
        // Assume we take the first matching plan
        const plan = portionPlansRes.data[0];

        // 2. Fetch the syllabus from R2
        const syllabusData = await questionPaperApi.fetchSyllabus(plan.r2_key);

        // 3. Map to PredefinedChapter format
        // Note: The R2 data has "topics" as string[] (e.g. "6.1 Introduction"), 
        // but our UI expects subtopics as {id, name}. We will map string topics to objects.
        const mappedChapters: PredefinedChapter[] = syllabusData.chapters.map((ch, idx) => ({
          id: `ch-${idx}`, // Generate an ID
          name: ch.chapter_name,
          subtopics: ch.topics.map((topic, tIdx) => ({
            id: `ch-${idx}-st-${tIdx}`,
            name: topic
          }))
        }));

        setChapters(mappedChapters);
      } else {
        console.warn("No portion plans found for this subject/class");
        // Handle empty state or show error
        setChapters([]);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setIsFetchingChapters(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Fetch chapters before moving to step 3
      await fetchChapters();
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    }
  };

  const [streamingLogs, setStreamingLogs] = useState<string[]>([]);
  // const [generationResult, setGenerationResult] = useState<QuestionPaperGenerationResponse | null>(null); // Kept existing

  const handleGeneratePaper = async () => {
    setIsLoading(true);
    setStreamingLogs([]); // Reset logs

    // Construct payload
    const unitsPayload = chapterQuestionTypes.map(chType => {
      const chapter = chapters.find(c => c.id === chType.chapterId);
      const selectedSubtopicsForChapter = selectedSubtopics.filter(st => st.chapterId === chType.chapterId);

      // Map UI subtopics to strings (using name)
      const topicNames = selectedSubtopicsForChapter.map(st => {
        const stObj = chapter?.subtopics.find(s => s.id === st.subtopicId);
        return stObj ? stObj.name : "";
      }).filter(Boolean);

      const blueprint = chType.questions.map(q => ({
        question_type: q.type,
        question_count: parseInt(q.numberOfQuestions) || 0,
        marks_per_question: parseInt(q.marksPerQuestion) || 0
      }));

      return {
        unit_name: chapter?.name || "",
        topics: topicNames,
        blue_print: blueprint
      };
    });

    const payload = {
      board_id: basicDetails.board_id,
      class_id: basicDetails.class,
      subject_id: basicDetails.subject_id,
      units: unitsPayload,
      difficulty: {
        easy: difficultyLevel.easy,
        medium: difficultyLevel.medium,
        hard: difficultyLevel.hard
      }
    };

    await questionPaperApi.generateQuestionPaperStream(
      payload,
      (logText) => {
        setStreamingLogs(prev => [...prev, logText]);
      },
      (result) => {
        setGenerationResult(result);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error generating question paper:", error);
        setIsLoading(false);
        // Could add a toast here
      }
    );
  };

  // Calculate totals - retained
  const calculateChapterTotals = (chapterId: string) => {
    const chapter = chapterQuestionTypes.find((ch) => ch.chapterId === chapterId);
    if (!chapter) return { totalQuestions: 0, totalMarks: 0 };

    let totalQuestions = 0;
    let totalMarks = 0;

    chapter.questions.forEach((q) => {
      const numQuestions = parseInt(q.numberOfQuestions) || 0;
      const marksPerQ = parseInt(q.marksPerQuestion) || 0;
      totalQuestions += numQuestions;
      totalMarks += numQuestions * marksPerQ;
    });

    return { totalQuestions, totalMarks };
  };

  const calculateOverallTotals = () => {
    let totalQuestions = 0;
    let totalMarks = 0;

    chapterQuestionTypes.forEach((chapter) => {
      const { totalQuestions: chQuestions, totalMarks: chMarks } =
        calculateChapterTotals(chapter.chapterId);
      totalQuestions += chQuestions;
      totalMarks += chMarks;
    });

    return { totalQuestions, totalMarks };
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const totalPercentage = difficultyLevel.easy + difficultyLevel.medium + difficultyLevel.hard;
  const questionTypeOptions = ["MCQ", "Short", "Long"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
        {isLoading && <QuestionPaperLoading logs={streamingLogs} />}

        <div className="max-w-7xl mx-auto space-y-8">
          <section className="rounded-[22px] border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
              <div className="relative px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                      <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-semibold">ACADEMIC</p>
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Question Paper Generator</h1>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/" className="inline-flex">
                      <Button variant="outline" className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200 dark:hover:bg-slate-900/20">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {generationResult ? (
            <GenerationResult result={generationResult} />
          ) : (
            <Card className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.04)] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 min-h-[600px]">
              {/* Progress Steps */}
              {/* Progress Steps */}
              <div className="mb-14 pt-4">
                <div className="flex items-start justify-between max-w-5xl mx-auto px-2">
                  {[
                    { step: 1, label: "Basic Details" },
                    { step: 2, label: "Difficulty Level" },
                    { step: 3, label: "Select Chapters" },
                    { step: 4, label: "Question Types" },
                  ].map((item, idx, arr) => (
                    <div key={item.step} className={idx < arr.length - 1 ? "flex-1 flex items-start" : "flex items-start"}>
                      <div className="flex flex-col items-center relative z-10 group">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 backdrop-blur-md
                            ${currentStep >= item.step
                              ? "bg-indigo-600/90 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] scale-110 ring-4 ring-indigo-500/10"
                              : "bg-white/60 dark:bg-slate-800/60 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-white/80 shadow-sm"
                            }`}
                        >
                          {currentStep > item.step ? <Check className="w-5 h-5" /> : item.step}
                        </div>
                        <span
                          className={`absolute top-14 whitespace-nowrap text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-300
                            ${currentStep >= item.step ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}
                          `}
                        >
                          {item.label}
                        </span>
                      </div>

                      {idx < arr.length - 1 && (
                        <div className="flex-1 mx-2 sm:mx-4 mt-[19px] h-[3px] bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden backdrop-blur-sm">
                          <div
                            className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-700 ease-in-out origin-left ${currentStep > item.step ? "scale-x-100" : "scale-x-0"
                              }`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="mt-8">
                {/* Step 1: Basic Details */}
                {currentStep === 1 && (
                  <BasicDetailsStep
                    basicDetails={basicDetails}
                    isLoading={isLoading}
                    updateBasicDetails={updateBasicDetails}
                  />
                )}

                {/* Step 2: Difficulty Level */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Difficulty Level Distribution
                      </h2>
                      <p className="text-gray-600">
                        Set the percentage distribution of questions by difficulty level
                      </p>
                    </div>

                    <div className="space-y-8">
                      {(["easy", "medium", "hard"] as const).map((level) => (
                        <div key={level}>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-700 capitalize">
                              {level}
                            </label>
                            <span className="text-lg font-semibold text-blue-600">
                              {difficultyLevel[level]}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={difficultyLevel[level]}
                            onChange={(e) =>
                              updateDifficulty(level, parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            style={{
                              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${difficultyLevel[level]}%, #e5e7eb ${difficultyLevel[level]}%, #e5e7eb 100%)`,
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Total Percentage:
                        </span>
                        <span
                          className={`text-lg font-semibold ${totalPercentage === 100
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                        >
                          {totalPercentage}%
                        </span>
                      </div>
                      {totalPercentage !== 100 && (
                        <p className="text-xs text-red-600 mt-2">
                          Total must equal 100%
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Select Chapters & Subtopics */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Select Chapters & Subtopics
                      </h2>
                      <p className="text-gray-600">
                        Select chapters and choose which subtopics to include
                      </p>
                    </div>

                    {/* Chapter Selection List */}
                    <div className="space-y-3">
                      {isFetchingChapters ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4">
                          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                          <div className="text-lg font-medium">Fetching available chapters...</div>
                          <p className="text-sm text-gray-400">This will take only a moment</p>
                        </div>
                      ) : (
                        chapters.map((chapter) => {
                          const isChapterSelected = selectedChapters.includes(chapter.id);

                          return (
                            <div
                              key={chapter.id}
                              className="border border-gray-300 rounded-lg overflow-hidden"
                            >
                              {/* Chapter Checkbox Header */}
                              <div
                                className={`p-4 cursor-pointer transition-colors ${isChapterSelected
                                  ? "bg-blue-50 border-l-4 border-l-blue-600"
                                  : "bg-white hover:bg-gray-50"
                                  }`}
                                onClick={() => toggleChapter(chapter.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isChapterSelected
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-gray-300"
                                      }`}
                                  >
                                    {isChapterSelected && (
                                      <Check className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">
                                      {chapter.name}
                                    </h4>
                                  </div>
                                </div>
                              </div>

                              {/* Subtopics (shown when chapter is selected, default ticked) */}
                              {isChapterSelected && (
                                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
                                  {chapter.subtopics.map((subtopic) => {
                                    const isSubtopicSelected = selectedSubtopics.some(
                                      (st) =>
                                        st.chapterId === chapter.id &&
                                        st.subtopicId === subtopic.id
                                    );

                                    return (
                                      <div
                                        key={subtopic.id}
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSubtopic(chapter.id, subtopic.id);
                                        }}
                                      >
                                        <div
                                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${isSubtopicSelected
                                            ? "bg-blue-600 border-blue-600"
                                            : "border-gray-300"
                                            }`}
                                        >
                                          {isSubtopicSelected && (
                                            <Check className="h-2.5 w-2.5 text-white" />
                                          )}
                                        </div>
                                        <span className="text-sm text-gray-700">
                                          {subtopic.name}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Question Types by Chapter */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Question Types by Chapter
                      </h2>
                      <p className="text-gray-600">
                        Configure question types, number of questions, and marks for each selected chapter
                      </p>
                    </div>

                    {/* Overall Total Summary at Top */}
                    {(() => {
                      const { totalQuestions, totalMarks } = calculateOverallTotals();
                      return (
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Total Questions:
                              </span>
                              <span className="ml-2 text-lg font-semibold text-blue-600">
                                {totalQuestions}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                Total Marks:
                              </span>
                              <span className="ml-2 text-lg font-semibold text-blue-600">
                                {totalMarks}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Chapters with Question Types */}
                    <div className="space-y-6">
                      {selectedChapters.map((chapterId) => {
                        const chapter = chapters.find(
                          (ch) => ch.id === chapterId
                        );
                        const chapterQuestions = chapterQuestionTypes.find(
                          (ch) => ch.chapterId === chapterId
                        );
                        const { totalQuestions: chQuestions, totalMarks: chMarks } =
                          chapterQuestions
                            ? calculateChapterTotals(chapterId)
                            : { totalQuestions: 0, totalMarks: 0 };

                        if (!chapter || !chapterQuestions) return null;

                        return (
                          <div
                            key={chapterId}
                            className="border border-gray-300 rounded-lg p-6 bg-gray-50"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              {chapter.name}
                            </h3>

                            {/* Question Types List */}
                            <div className="space-y-3">
                              {chapterQuestions.questions.map((question) => (
                                <div
                                  key={question.id}
                                  className="flex gap-3 items-start p-4 bg-white rounded-lg border border-gray-200"
                                >
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Question Type
                                      </label>
                                      <select
                                        value={question.type}
                                        onChange={(e) =>
                                          updateQuestionType(
                                            chapterId,
                                            question.id,
                                            "type",
                                            e.target.value
                                          )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                                      >
                                        <option value="">Select Type</option>
                                        {questionTypeOptions.map((type) => (
                                          <option key={type} value={type}>
                                            {type}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Questions
                                      </label>
                                      <input
                                        type="number"
                                        value={question.numberOfQuestions}
                                        onChange={(e) =>
                                          updateQuestionType(
                                            chapterId,
                                            question.id,
                                            "numberOfQuestions",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter number"
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Marks per Question
                                      </label>
                                      <input
                                        type="number"
                                        value={question.marksPerQuestion}
                                        onChange={(e) =>
                                          updateQuestionType(
                                            chapterId,
                                            question.id,
                                            "marksPerQuestion",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter marks"
                                        min="1"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                      />
                                    </div>
                                  </div>
                                  {chapterQuestions.questions.length > 1 && (
                                    <button
                                      onClick={() =>
                                        removeQuestionType(chapterId, question.id)
                                      }
                                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      type="button"
                                    >
                                      <X className="h-5 w-5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Add Question Type Button */}
                            <button
                              onClick={() => addQuestionType(chapterId)}
                              type="button"
                              className="mt-4 flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                            >
                              <Plus className="h-5 w-5" />
                              <span>Add Question Type</span>
                            </button>

                            {/* Chapter Totals */}
                            {(chQuestions > 0 || chMarks > 0) && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">
                                      Chapter Questions:{" "}
                                    </span>
                                    <span className="font-semibold text-blue-600">
                                      {chQuestions}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Chapter Marks: </span>
                                    <span className="font-semibold text-blue-600">
                                      {chMarks}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep === 4 ? (
                    <>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handlePrevious}
                          className="flex items-center gap-2 px-6 py-2 rounded-lg transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300"
                          type="button"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Previous</span>
                        </button>
                        {/* <button
                            onClick={() => {
                              // Link to advanced step - can be implemented later
                              console.log("Go to advanced step");
                            }}
                            className="flex items-center gap-2 px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                            type="button"
                          >
                            <span>Go to Advanced Step</span>
                            <ChevronRight className="h-4 w-4" />
                          </button> */}
                      </div>
                      <button
                        onClick={handleGeneratePaper}
                        disabled={!validateStep4() || isLoading}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${!validateStep4() || isLoading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        type="button"
                      >
                        <span>{isLoading ? "Generating..." : "Generate Question Paper"}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${currentStep === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        type="button"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </button>

                      <div className="text-sm text-gray-600">
                        Step {currentStep} of 4
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={
                          (currentStep === 1 && !validateStep1()) ||
                          (currentStep === 2 && isFetchingChapters) ||
                          (currentStep === 3 && !validateStep3()) ||
                          currentStep === 4
                        }
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${(currentStep === 1 && !validateStep1()) ||
                          (currentStep === 2 && isFetchingChapters) ||
                          (currentStep === 3 && !validateStep3()) ||
                          currentStep === 4
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        type="button"
                      >
                        {isFetchingChapters && currentStep === 2 ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Fetching...</span>
                          </>
                        ) : (
                          <>
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


