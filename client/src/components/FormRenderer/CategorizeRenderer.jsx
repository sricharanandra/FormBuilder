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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item Component
function SortableItem({ id, children, category }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-white/10 rounded-xl border border-white/20 cursor-grab hover:bg-white/20 transition-all text-white"
    >
      {children}
    </div>
  );
}

// Droppable Category Component
function DroppableCategory({ category, items }) {
  const { isOver, setNodeRef } = useDroppable({
    id: category,
  });

  const style = {
    backgroundColor: isOver ? "rgba(168, 85, 247, 0.1)" : undefined,
    borderColor: isOver ? "rgba(168, 85, 247, 0.5)" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="min-h-[200px] p-4 bg-white/5 rounded-2xl border-2 border-dashed border-white/20 transition-all"
    >
      <h3 className="text-lg font-medium text-white mb-4 text-center">
        {category}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <SortableItem key={item.id} id={item.id} category={category}>
            {item.text}
          </SortableItem>
        ))}
      </div>
    </div>
  );
}

function CategorizeRenderer({ question, onAnswer }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (question.data) {
      const shuffledItems = [...(question.data.items || [])].map(
        (item, index) => ({
          ...item,
          id: `item-${index}`,
          currentCategory: null, // Start with no category assigned
        })
      );
      setItems(shuffledItems);
      setCategories(question.data.categories || []);
    }
  }, [question]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeItem = items.find((item) => item.id === active.id);
    const overCategory = over.id.toString();

    if (activeItem && categories.includes(overCategory)) {
      const updatedItems = items.map((item) =>
        item.id === active.id
          ? { ...item, currentCategory: overCategory }
          : item
      );

      setItems(updatedItems);

      // Send answer to parent
      const answer = updatedItems.reduce((acc, item) => {
        if (item.currentCategory) {
          acc[item.text] = item.currentCategory;
        }
        return acc;
      }, {});

      onAnswer(answer);
    }
  };

  const getItemsForCategory = (category) => {
    return items.filter((item) => item.currentCategory === category);
  };

  const getUnassignedItems = () => {
    return items.filter((item) => !item.currentCategory);
  };

  return (
    <div className="space-y-6">
      {question.title && (
        <h3 className="text-xl font-medium text-white mb-4">
          {question.title}
        </h3>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Unassigned Items Pool */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-white/80 mb-3">
            Drag items to categories:
          </h4>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <SortableContext
              items={getUnassignedItems().map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getUnassignedItems().map((item) => (
                  <SortableItem key={item.id} id={item.id}>
                    {item.text}
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <DroppableCategory
              key={category}
              category={category}
              items={getItemsForCategory(category)}
            />
          ))}
        </div>
      </DndContext>

      {/* Progress indicator */}
      <div className="mt-4 text-center text-white/60 text-sm">
        {items.filter((item) => item.currentCategory).length} of {items.length}{" "}
        items categorized
      </div>
    </div>
  );
}

export default CategorizeRenderer;
