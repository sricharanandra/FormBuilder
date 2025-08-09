import { useState, useRef, useEffect } from 'react';

function ClozeBuilder({ question, onUpdate }) {
    const [sentence, setSentence] = useState(question.data.sentence || '');
    const [blanks, setBlanks] = useState(question.data.blanks || []);
    const textareaRef = useRef(null);

    // Initialize with default data if empty
    useEffect(() => {
        if (!sentence && question.data.sentence) {
            setSentence(question.data.sentence);
            // Parse brackets from default sentence
            parseBracketsFromSentence(question.data.sentence);
        }
    }, [question.data.sentence]);

    const updateQuestion = (newData) => {
        onUpdate({
            ...question,
            data: { ...question.data, ...newData }
        });
    };

    // Parse [word] brackets from sentence
    const parseBracketsFromSentence = (text) => {
        const bracketMatches = text.match(/\[([^\]]+)\]/g);
        if (bracketMatches) {
            const newBlanks = bracketMatches.map((match, index) => ({
                text: match.replace(/[\[\]]/g, ''),
                id: `blank_${index}_${Date.now()}`
            }));
            setBlanks(newBlanks);
            updateQuestion({
                sentence: text,
                blanks: newBlanks
            });
        }
    };

    // Handle text selection and underline
    const handleTextSelect = () => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start !== end) {
            const selectedText = sentence.substring(start, end);

            // Check if this text is already a blank
            const existingBlank = blanks.find(blank => blank.text === selectedText);
            if (!existingBlank) {
                const newBlanks = [...blanks, {
                    text: selectedText,
                    id: `${selectedText}_${Date.now()}`,
                    position: start
                }];
                setBlanks(newBlanks);
                updateQuestion({ sentence, blanks: newBlanks });
            }
        }
    };

    const removeBlank = (blankId) => {
        const newBlanks = blanks.filter(blank => blank.id !== blankId);
        setBlanks(newBlanks);
        updateQuestion({ sentence, blanks: newBlanks });
    };

    const handleSentenceChange = (e) => {
        const newSentence = e.target.value;
        setSentence(newSentence);

        // Auto-detect brackets [word] and create blanks
        parseBracketsFromSentence(newSentence);

        // Remove blanks that no longer exist in the sentence
        const validBlanks = blanks.filter(blank =>
            newSentence.includes(blank.text) || newSentence.includes(`[${blank.text}]`)
        );
        setBlanks(validBlanks);
        updateQuestion({ sentence: newSentence, blanks: validBlanks });
    };

    // Create preview with blanks
    const createPreview = () => {
        let preview = sentence;
        blanks.forEach(blank => {
            // Replace both [word] and word with blanks
            preview = preview.replace(new RegExp(`\\[${blank.text}\\]`, 'g'), '____');
            preview = preview.replace(new RegExp(`\\b${blank.text}\\b`, 'g'), '____');
        });
        return preview;
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

            {/* Preview */}
            {blanks.length > 0 && (
                <div className="bg-gray-50 p-4 rounded">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                    <p className="text-lg">{createPreview()}</p>
                </div>
            )}

            {/* Sentence Editor */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sentence (use [word] for blanks or select text):
                </label>
                <textarea
                    ref={textareaRef}
                    value={sentence}
                    onChange={handleSentenceChange}
                    onMouseUp={handleTextSelect}
                    placeholder="Type your sentence here. Use [word] to create blanks, or select text to make blanks..."
                    className="w-full border border-gray-300 rounded px-3 py-2 h-32 focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Tips: Use [word] brackets for automatic blanks, or highlight text to create blanks
                </p>
            </div>

            {/* Blanks/Options */}
            {blanks.length > 0 && (
                <div>
                    <h4 className="text-md font-medium mb-3">Fillable Options:</h4>
                    <div className="space-y-2">
                        {blanks.map((blank) => (
                            <div key={blank.id} className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                                    {blank.text}
                                </span>
                                <button
                                    onClick={() => removeBlank(blank.id)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClozeBuilder;
