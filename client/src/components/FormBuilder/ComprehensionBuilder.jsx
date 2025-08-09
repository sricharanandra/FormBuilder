import { useState } from 'react';

function ComprehensionBuilder({ question, onUpdate }) {
    const [passage, setPassage] = useState(question.data.passage || '');
    const [mcqs, setMcqs] = useState(question.data.mcqs || []);

    const updateQuestion = (newData) => {
        onUpdate({
            ...question,
            data: { ...question.data, ...newData }
        });
    };

    const handlePassageChange = (e) => {
        const newPassage = e.target.value;
        setPassage(newPassage);
        updateQuestion({ passage: newPassage, mcqs });
    };

    const addMCQ = () => {
        const newMCQ = {
            id: Date.now().toString(),
            question: '',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0
        };
        const newMcqs = [...mcqs, newMCQ];
        setMcqs(newMcqs);
        updateQuestion({ passage, mcqs: newMcqs });
    };

    const updateMCQ = (mcqIndex, field, value) => {
        const newMcqs = [...mcqs];
        newMcqs[mcqIndex][field] = value;
        setMcqs(newMcqs);
        updateQuestion({ passage, mcqs: newMcqs });
    };

    const updateMCQOption = (mcqIndex, optionIndex, value) => {
        const newMcqs = [...mcqs];
        newMcqs[mcqIndex].options[optionIndex] = value;
        setMcqs(newMcqs);
        updateQuestion({ passage, mcqs: newMcqs });
    };

    const removeMCQ = (mcqIndex) => {
        const newMcqs = mcqs.filter((_, index) => index !== mcqIndex);
        setMcqs(newMcqs);
        updateQuestion({ passage, mcqs: newMcqs });
    };

    return (
        <div className="space-y-6">
            <div>
                <input
                    type="text"
                    placeholder="Question title (optional)"
                    value={question.title}
                    onChange={(e) => onUpdate({ ...question, title: e.target.value })}
                    className="w-full text-lg font-medium border-b border-gray-300 focus:border-blue-500 outline-none pb-2"
                />
            </div>

            {/* Passage Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reading Passage:
                </label>
                <textarea
                    value={passage}
                    onChange={handlePassageChange}
                    placeholder="Enter the reading passage here..."
                    className="w-full border border-gray-300 rounded px-3 py-2 h-40 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* MCQ Questions */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium">Multiple Choice Questions:</h4>
                    <button
                        onClick={addMCQ}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                        + Add MCQ
                    </button>
                </div>

                {mcqs.map((mcq, mcqIndex) => (
                    <div key={mcq.id} className="border border-gray-200 rounded p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium">Question {mcqIndex + 1}</h5>
                            <button
                                onClick={() => removeMCQ(mcqIndex)}
                                className="text-red-500 hover:text-red-700 text-sm"
                            >
                                Remove
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Enter your question..."
                            value={mcq.question}
                            onChange={(e) => updateMCQ(mcqIndex, 'question', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
                        />

                        <div className="space-y-2">
                            {mcq.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`correct-${mcq.id}`}
                                        checked={mcq.correctAnswer === optionIndex}
                                        onChange={() => updateMCQ(mcqIndex, 'correctAnswer', optionIndex)}
                                        className="text-green-600"
                                    />
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateMCQOption(mcqIndex, optionIndex, e.target.value)}
                                        className="flex-1 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
                                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {mcqs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No questions added yet.</p>
                        <button
                            onClick={addMCQ}
                            className="text-blue-600 hover:text-blue-800 mt-2"
                        >
                            Add your first MCQ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ComprehensionBuilder;
