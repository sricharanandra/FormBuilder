import { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

function ComprehensionRenderer({ question, onAnswer }) {
    const [selectedAnswers, setSelectedAnswers] = useState({});

    useEffect(() => {
        if (question.data?.mcqs) {
            const initialAnswers = {};
            question.data.mcqs.forEach((mcq, index) => {
                initialAnswers[`mcq_${index}`] = null;
            });
            setSelectedAnswers(initialAnswers);
        }
    }, [question]);

    const handleAnswerSelect = (mcqIndex, optionIndex) => {
        const newAnswers = {
            ...selectedAnswers,
            [`mcq_${mcqIndex}`]: optionIndex
        };
        setSelectedAnswers(newAnswers);
        onAnswer(newAnswers);
    };

    const getOptionLabel = (index) => {
        return String.fromCharCode(65 + index); // A, B, C, D...
    };

    if (!question.data?.passage || !question.data?.mcqs) {
        return (
            <div className="text-center py-8 text-white/60">
                <p>No comprehension content available</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {question.title && (
                <h3 className="text-xl font-medium text-white mb-4">{question.title}</h3>
            )}

            {/* Reading Passage */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h4 className="text-lg font-medium text-white/80 mb-4">Reading Passage</h4>
                <div className="prose prose-invert max-w-none">
                    <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                        {question.data.passage}
                    </div>
                </div>
            </div>

            {/* Multiple Choice Questions */}
            <div className="space-y-6">
                <h4 className="text-lg font-medium text-white/80">Questions</h4>

                {question.data.mcqs.map((mcq, mcqIndex) => (
                    <div key={mcqIndex} className="bg-white/5 rounded-2xl border border-white/10 p-6">
                        <div className="mb-4">
                            <h5 className="text-lg font-medium text-white mb-4">
                                {mcqIndex + 1}. {mcq.question}
                            </h5>
                        </div>

                        <div className="space-y-3">
                            {mcq.options.map((option, optionIndex) => {
                                const isSelected = selectedAnswers[`mcq_${mcqIndex}`] === optionIndex;

                                return (
                                    <label
                                        key={optionIndex}
                                        className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected
                                                ? 'bg-purple-500/20 border border-purple-500/50'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected
                                                ? 'border-purple-500 bg-purple-500'
                                                : 'border-white/30'
                                            }`}>
                                            {isSelected && (
                                                <CheckCircleIcon className="w-4 h-4 text-white" />
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-3 flex-1">
                                            <span className={`font-medium ${isSelected ? 'text-purple-300' : 'text-white/60'
                                                }`}>
                                                {getOptionLabel(optionIndex)}.
                                            </span>
                                            <span className="text-white">{option}</span>
                                        </div>

                                        <input
                                            type="radio"
                                            name={`mcq_${mcqIndex}`}
                                            value={optionIndex}
                                            checked={isSelected}
                                            onChange={() => handleAnswerSelect(mcqIndex, optionIndex)}
                                            className="sr-only"
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress indicator */}
            <div className="text-center text-white/60 text-sm">
                {Object.values(selectedAnswers).filter(answer => answer !== null).length} of {question.data.mcqs.length} questions answered
            </div>
        </div>
    );
}

export default ComprehensionRenderer;
