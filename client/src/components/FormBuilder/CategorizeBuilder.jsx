import { useState } from 'react';

function CategorizeBuilder({ question, onUpdate }) {
    const [categories, setCategories] = useState(question.data.categories || ['Category 1', 'Category 2']);
    const [items, setItems] = useState(question.data.items || []);

    // Update parent component whenever data changes
    const updateQuestion = (newData) => {
        onUpdate({
            ...question,
            data: { ...question.data, ...newData }
        });
    };

    const addCategory = () => {
        const newCategories = [...categories, `Category ${categories.length + 1}`];
        setCategories(newCategories);
        updateQuestion({ categories: newCategories, items });
    };

    const updateCategory = (index, value) => {
        const newCategories = [...categories];
        newCategories[index] = value;
        setCategories(newCategories);
        updateQuestion({ categories: newCategories, items });
    };

    const removeCategory = (index) => {
        const newCategories = categories.filter((_, i) => i !== index);
        setCategories(newCategories);
        updateQuestion({ categories: newCategories, items });
    };

    const addItem = () => {
        const newItems = [...items, { text: `Item ${items.length + 1}`, belongsTo: categories[0] || '' }];
        setItems(newItems);
        updateQuestion({ categories, items: newItems });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
        updateQuestion({ categories, items: newItems });
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        updateQuestion({ categories, items: newItems });
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

            {/* Categories Section */}
            <div>
                <h4 className="text-md font-medium mb-3">Categories:</h4>
                {categories.map((category, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">{index + 1}.</span>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => updateCategory(index, e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={() => removeCategory(index)}
                            className="text-red-500 hover:text-red-700 px-2"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    onClick={addCategory}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                >
                    + Add Category
                </button>
            </div>

            {/* Items Section */}
            <div>
                <h4 className="text-md font-medium mb-3">Items:</h4>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">{index + 1}.</span>
                        <input
                            type="text"
                            placeholder="Item text"
                            value={item.text}
                            onChange={(e) => updateItem(index, 'text', e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
                        />
                        <select
                            value={item.belongsTo}
                            onChange={(e) => updateItem(index, 'belongsTo', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700 px-2"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    onClick={addItem}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                >
                    + Add Item
                </button>
            </div>
        </div>
    );
}

export default CategorizeBuilder;
