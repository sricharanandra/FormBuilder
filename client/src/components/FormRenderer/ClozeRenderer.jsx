import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Draggable Word Component
function DraggableWord({ id, word, isUsed }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: isUsed,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isUsed ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-4 py-2 rounded-xl text-white font-medium cursor-grab transition-all ${
        isUsed
          ? "bg-gray-600/50 cursor-not-allowed"
          : "bg-purple-500/30 hover:bg-purple-500/50 border border-purple-500/50"
      }`}
    >
      {word}
    </div>
  );
}

// Droppable Blank Component
function DroppableBlank({ id, word, blankIndex }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const style = {
    backgroundColor: isOver ? "rgba(168, 85, 247, 0.2)" : undefined,
    borderColor: isOver ? "rgba(168, 85, 247, 0.8)" : undefined,
  };

  return (
    <span
      ref={setNodeRef}
      style={style}
      className={`inline-block mx-2 px-4 py-2 min-w-[100px] text-center rounded-lg border-2 border-dashed transition-all ${
        word
          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
          : "bg-white/10 border-white/30 text-white/50"
      }`}
    >
      {word || `____`}
    </span>
  );
}

function ClozeRenderer({ question, onAnswer }) {
  const [answers, setAnswers] = useState({});
  const [availableWords, setAvailableWords] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    if (question.data?.blanks) {
      const initialAnswers = {};
      const words = [];

      question.data.blanks.forEach((blank, index) => {
        const blankId = `blank_${index}`;
        initialAnswers[blankId] = "";
        words.push({
          id: `word_${index}`,
          text: blank.text,
          isUsed: false,
        });
      });

      setAnswers(initialAnswers);
      // Shuffle the words for better UX
      setAvailableWords(words.sort(() => Math.random() - 0.5));
    }
  }, [question]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const wordId = active.id;
    const blankId = over.id;

    // Check if dropping on a blank
    if (blankId.startsWith("blank_")) {
      const word = availableWords.find((w) => w.id === wordId);

      if (word && !word.isUsed) {
        // Update answers
        const newAnswers = { ...answers };

        // If blank already has a word, make that word available again
        const oldWord = Object.values(availableWords).find(
          (w) => w.text === newAnswers[blankId] && w.isUsed
        );

        newAnswers[blankId] = word.text;

        // Update word availability
        const newAvailableWords = availableWords.map((w) => {
          if (w.id === wordId) {
            return { ...w, isUsed: true };
          }
          if (oldWord && w.id === oldWord.id) {
            return { ...w, isUsed: false };
          }
          return w;
        });

        setAnswers(newAnswers);
        setAvailableWords(newAvailableWords);
        onAnswer(newAnswers);
      }
    }
  };

  const renderSentenceWithBlanks = () => {
    if (!question.data?.sentence || !question.data?.blanks) {
      return <p className="text-white">No sentence provided</p>;
    }

    let sentence = question.data.sentence;
    const blanks = question.data.blanks || [];

    // Create a mapping of words to blank IDs
    const wordToBlankId = {};
    blanks.forEach((blank, index) => {
      wordToBlankId[blank.text] = `blank_${index}`;
    });

    // Replace all blank words with placeholder tokens
    let processedSentence = sentence;
    blanks.forEach((blank, index) => {
      // Try both [word] and word patterns
      const patterns = [
        new RegExp(`\\[${blank.text}\\]`, "g"),
        new RegExp(`\\b${blank.text}\\b`, "g"),
      ];

      for (const pattern of patterns) {
        if (pattern.test(processedSentence)) {
          processedSentence = processedSentence.replace(
            pattern,
            `__BLANK_${index}__`
          );
          break; // Only replace with the first matching pattern
        }
      }
    });

    // Split the sentence by blank tokens and build the components
    const tokens = processedSentence.split(/(__BLANK_\d+__)/);
    const parts = [];

    tokens.forEach((token, index) => {
      if (token.match(/^__BLANK_(\d+)__$/)) {
        const blankIndex = parseInt(token.match(/^__BLANK_(\d+)__$/)[1]);
        const blankId = `blank_${blankIndex}`;

        parts.push(
          <DroppableBlank
            key={blankId}
            id={blankId}
            word={answers[blankId]}
            blankIndex={blankIndex}
          />
        );
      } else if (token.trim()) {
        parts.push(<span key={`text_${index}`}>{token}</span>);
      }
    });

    return <div className="text-lg leading-relaxed text-white">{parts}</div>;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {question.title && (
          <h3 className="text-xl font-medium text-white mb-4">
            {question.title}
          </h3>
        )}

        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <div className="mb-4">
            <h4 className="text-lg font-medium text-white/80 mb-3">
              Drag words to fill the blanks:
            </h4>
          </div>
          {renderSentenceWithBlanks()}
        </div>

        {/* Available words to drag */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <h5 className="text-sm font-medium text-white/60 mb-3">
            Available words:
          </h5>
          <SortableContext
            items={availableWords.map((w) => w.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-3">
              {availableWords.map((word) => (
                <DraggableWord
                  key={word.id}
                  id={word.id}
                  word={word.text}
                  isUsed={word.isUsed}
                />
              ))}
            </div>
          </SortableContext>
        </div>

        {/* Progress indicator */}
        <div className="text-center text-white/60 text-sm">
          {
            Object.values(answers).filter((answer) => answer.trim() !== "")
              .length
          }{" "}
          of {Object.keys(answers).length} blanks filled
        </div>
      </div>
    </DndContext>
  );
}

export default ClozeRenderer;
