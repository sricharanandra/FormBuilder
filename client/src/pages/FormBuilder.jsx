import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { animate, utils, stagger } from "animejs";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import {
  PlusIcon,
  EyeIcon,
  Cog6ToothIcon,
  TrashIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  CubeTransparentIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import ImageUpload from "../components/ImageUpload";

function FormBuilder() {
  const { id: formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "Untitled Form",
    description: "",
    questions: [],
    settings: {
      allowMultipleSubmissions: false,
      showProgressBar: true,
      randomizeQuestions: false,
    },
    isPublished: false,
    headerImage: null,
  });
  const [activeTab, setActiveTab] = useState("questions");
  const [saving, setSaving] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (formId && formId !== "new") {
      fetchForm();
    }

    // Page entrance animations
    animate(".builder-header", {
      opacity: [0, 1],
      translateY: [-50, 0],
      duration: 1000,
      easing: "out-expo",
      delay: 200,
    });

    animate(".builder-sidebar", {
      opacity: [0, 1],
      translateX: [-100, 0],
      duration: 800,
      easing: "out-expo",
      delay: 400,
    });

    animate(".builder-main", {
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 800,
      easing: "out-expo",
      delay: 600,
    });

    // Mouse parallax
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 150;
      const y = (e.clientY - window.innerHeight / 2) / 150;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.FORMS}/${formId}`);
      setForm(response.data);
    } catch (error) {
      console.error("Error fetching form:", error);
    }
  };

  const saveForm = async () => {
    setSaving(true);
    try {
      const url =
        formId && formId !== "new"
          ? `${API_ENDPOINTS.FORMS}/${formId}`
          : API_ENDPOINTS.FORMS;

      const method = formId && formId !== "new" ? "put" : "post";
      const response = await axios[method](url, form);

      if (formId === "new") {
        navigate(`/builder/${response.data._id}`);
      }
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setSaving(false);
    }
  };

  const publishForm = async () => {
    // If form hasn't been saved yet, save it first
    if (!formId || formId === "new") {
      try {
        setSaving(true);
        const response = await axios.post(API_ENDPOINTS.FORMS, form);
        const newFormId = response.data._id;

        // Update the URL without navigation
        window.history.replaceState(null, "", `/builder/${newFormId}`);

        // Now publish the newly saved form
        const publishedForm = { ...form, isPublished: true };
        await axios.put(`${API_ENDPOINTS.FORMS}/${newFormId}`, publishedForm);

        setForm(publishedForm);
        alert("Form saved and published successfully! 🎉");
      } catch (error) {
        console.error("Error saving/publishing form:", error);
        alert("Error publishing form. Please try again.");
      } finally {
        setSaving(false);
      }
      return;
    }

    // If form exists, just toggle publish status
    try {
      setSaving(true);
      const updatedForm = { ...form, isPublished: !form.isPublished };

      const response = await axios.put(
        `${API_ENDPOINTS.FORMS}/${formId}`,
        updatedForm
      );

      if (response.status === 200) {
        setForm(updatedForm);

        if (updatedForm.isPublished) {
          alert("Form published successfully! 🎉");
        } else {
          alert("Form unpublished successfully");
        }
      }
    } catch (error) {
      console.error("Error publishing form:", error);
      alert("Error publishing form. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      title: "New Question",
      required: false,
      data: getDefaultQuestionData(type),
    };

    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    // Animate new question
    setTimeout(() => {
      animate(".question-item:last-child", {
        opacity: [0, 1],
        scale: [0.8, 1],
        translateY: [30, 0],
        duration: 500,
        easing: "out-back",
      });
    }, 50);
  };

  const getDefaultQuestionData = (type) => {
    switch (type) {
      case "categorize":
        return {
          categories: ["Category 1", "Category 2"],
          items: [
            { text: "Item 1", belongsTo: "Category 1" },
            { text: "Item 2", belongsTo: "Category 2" },
          ],
        };
      case "cloze":
        return {
          sentence: "This is a sample sentence.",
          blanks: [],
        };
      case "comprehension":
        return {
          passage: "Enter your reading passage here...",
          mcqs: [
            {
              question: "Sample question?",
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0,
            },
          ],
        };
      default:
        return {};
    }
  };

  const updateQuestion = (questionId, updates) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (questionId) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>

        {/* Floating orbs */}
        <div
          className="absolute top-1/3 left-1/5 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${
              mousePosition.y * 0.3
            }px)`,
          }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl opacity-30"
          style={{
            transform: `translate(${mousePosition.x * -0.4}px, ${
              mousePosition.y * -0.4
            }px)`,
          }}
        ></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            transform: `translate(${mousePosition.x * 0.1}px, ${
              mousePosition.y * 0.1
            }px)`,
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="builder-header relative z-50 border-b border-white/10 backdrop-blur-xl bg-black/20 opacity-0">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="text-xl font-light text-white bg-transparent border-none outline-none focus:bg-white/10 focus:shadow-sm rounded-xl px-3 py-2 transition-all"
                    placeholder="Form Title"
                  />
                  <p className="text-sm text-white/50 font-light">
                    {form.questions.length} questions
                  </p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={async () => {
                  // If form hasn't been saved, save it first
                  if (!formId || formId === "new") {
                    try {
                      setSaving(true);
                      const response = await axios.post(
                        API_ENDPOINTS.FORMS,
                        form
                      );
                      const newFormId = response.data._id;

                      // Update the URL without navigation
                      window.history.replaceState(
                        null,
                        "",
                        `/builder/${newFormId}`
                      );

                      // Navigate to preview
                      navigate(`/form/${newFormId}`);
                    } catch (error) {
                      console.error("Error saving form:", error);
                      alert("Error saving form. Please try again.");
                    } finally {
                      setSaving(false);
                    }
                  } else {
                    navigate(`/form/${formId}`);
                  }
                }}
                disabled={saving}
                className="flex items-center space-x-2 text-white/60 hover:text-white px-6 py-3 rounded-2xl hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <EyeIcon className="w-5 h-5" />
                <span className="font-light">
                  {saving ? "Saving..." : "Preview"}
                </span>
              </button>
              <button
                onClick={saveForm}
                disabled={saving}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-medium transition-all disabled:opacity-50 backdrop-blur-xl border border-white/10"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={publishForm}
                disabled={saving}
                className={`px-6 py-3 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg ${
                  form.isPublished
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/25"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/25"
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    {form.isPublished && (
                      <CheckCircleIcon className="w-5 h-5" />
                    )}
                    <span>{form.isPublished ? "Published" : "Publish"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="builder-sidebar w-80 p-8 border-r border-white/10 opacity-0">
          <div className="sticky top-8">
            <h3 className="text-xl font-light text-white mb-8 flex items-center space-x-3">
              <PlusIcon className="w-6 h-6 text-purple-400" />
              <span>Add Questions</span>
            </h3>

            <div className="space-y-4">
              {[
                {
                  type: "categorize",
                  icon: CubeTransparentIcon,
                  title: "Categorize",
                  desc: "Drag items into categories",
                },
                {
                  type: "cloze",
                  icon: DocumentDuplicateIcon,
                  title: "Fill in Blanks",
                  desc: "Drag words to fill blanks",
                },
                {
                  type: "comprehension",
                  icon: PencilSquareIcon,
                  title: "Comprehension",
                  desc: "Reading passage with MCQs",
                },
              ].map((questionType) => (
                <button
                  key={questionType.type}
                  onClick={() => addQuestion(questionType.type)}
                  className="w-full text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all group backdrop-blur-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                      <questionType.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white group-hover:text-purple-300 transition-colors">
                        {questionType.title}
                      </p>
                      <p className="text-sm text-white/50 font-light">
                        {questionType.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="builder-main flex-1 p-8 opacity-0">
          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-white/10">
              <nav className="flex space-x-8 px-2">
                <button
                  onClick={() => setActiveTab("questions")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                    activeTab === "questions"
                      ? "border-purple-500 text-purple-400"
                      : "border-transparent text-white/60 hover:text-white hover:border-white/30"
                  }`}
                >
                  Questions ({form.questions.length})
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                    activeTab === "settings"
                      ? "border-purple-500 text-purple-400"
                      : "border-transparent text-white/60 hover:text-white hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>Settings</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "questions" ? (
            <div className="space-y-6">
              {/* Form Header */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Form Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe what this form is for..."
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none backdrop-blur-xl"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Header Image
                    </label>
                    <ImageUpload
                      onImageUpload={(url) =>
                        setForm((prev) => ({ ...prev, headerImage: url }))
                      }
                      currentImage={form.headerImage}
                    />
                  </div>
                </div>
              </div>

              {/* Questions */}
              {form.questions.length === 0 ? (
                <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <DocumentDuplicateIcon className="w-10 h-10 text-purple-400/50" />
                  </div>
                  <h3 className="text-2xl font-thin text-white mb-3">
                    No questions yet
                  </h3>
                  <p className="text-white/60 mb-8 font-light">
                    Start building your form by adding questions from the
                    sidebar
                  </p>
                </div>
              ) : (
                form.questions.map((question, index) => (
                  <div key={question.id} className="question-item">
                    <QuestionEditor
                      question={question}
                      index={index}
                      onUpdate={(updates) =>
                        updateQuestion(question.id, updates)
                      }
                      onDelete={() => deleteQuestion(question.id)}
                    />
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
              <h3 className="text-2xl font-thin text-white mb-8">
                Form Settings
              </h3>

              <div className="space-y-8">
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="text-lg font-medium text-white">
                      Multiple Submissions
                    </h4>
                    <p className="text-white/60 text-sm font-light">
                      Allow users to submit multiple responses
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          allowMultipleSubmissions:
                            !prev.settings.allowMultipleSubmissions,
                        },
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.settings.allowMultipleSubmissions
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        form.settings.allowMultipleSubmissions
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="text-lg font-medium text-white">
                      Progress Bar
                    </h4>
                    <p className="text-white/60 text-sm font-light">
                      Show completion progress to users
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          showProgressBar: !prev.settings.showProgressBar,
                        },
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.settings.showProgressBar
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        form.settings.showProgressBar
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <h4 className="text-lg font-medium text-white">
                      Randomize Questions
                    </h4>
                    <p className="text-white/60 text-sm font-light">
                      Show questions in random order
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          randomizeQuestions: !prev.settings.randomizeQuestions,
                        },
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.settings.randomizeQuestions
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        form.settings.randomizeQuestions
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Question Editor Component
function QuestionEditor({ question, index, onUpdate, onDelete }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-medium shadow-lg">
            {index + 1}
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={question.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="text-xl font-light text-white bg-transparent border-none outline-none focus:bg-white/5 rounded-xl px-3 py-2 w-full transition-all"
              placeholder="Question title"
            />
            <div className="flex items-center space-x-4 mt-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-light border border-purple-500/30">
                {question.type}
              </span>
              <label className="flex items-center space-x-2 text-sm text-white/60">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                />
                <span>Required</span>
              </label>
            </div>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="p-3 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Question Type Specific Content */}
      <QuestionTypeEditor question={question} onUpdate={onUpdate} />
    </div>
  );
}

// Question Type Editor Component
function QuestionTypeEditor({ question, onUpdate }) {
  const updateData = (newData) => {
    onUpdate({
      data: { ...question.data, ...newData },
    });
  };

  if (question.type === "categorize") {
    return <CategorizeEditor question={question} updateData={updateData} />;
  }

  if (question.type === "cloze") {
    return <ClozeEditor question={question} updateData={updateData} />;
  }

  if (question.type === "comprehension") {
    return <ComprehensionEditor question={question} updateData={updateData} />;
  }

  return null;
}

// Categorize Editor - Original Spec
function CategorizeEditor({ question, updateData }) {
  const categories = question.data?.categories || [];
  const items = question.data?.items || [];

  const addCategory = () => {
    const newCategories = [...categories, `Category ${categories.length + 1}`];
    updateData({ categories: newCategories });
  };

  const updateCategory = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    updateData({ categories: newCategories });
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    updateData({ categories: newCategories });
  };

  const addItem = () => {
    const newItems = [
      ...items,
      { text: `Item ${items.length + 1}`, belongsTo: categories[0] || "" },
    ];
    updateData({ items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateData({ items: newItems });
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    updateData({ items: newItems });
  };

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-3">
          Categories:
        </label>
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={category}
                onChange={(e) => updateCategory(index, e.target.value)}
                className="flex-1 p-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all backdrop-blur-xl"
                placeholder={`Category ${index + 1}`}
              />
              {categories.length > 2 && (
                <button
                  onClick={() => removeCategory(index)}
                  className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addCategory}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center space-x-2 p-3 hover:bg-purple-400/10 rounded-xl transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Items Section */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-3">
          Items:
        </label>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(index, "text", e.target.value)}
                className="flex-1 p-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all backdrop-blur-xl"
                placeholder={`Item ${index + 1}`}
              />
              <select
                value={item.belongsTo}
                onChange={(e) => updateItem(index, "belongsTo", e.target.value)}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all backdrop-blur-xl"
              >
                {categories.map((category, catIndex) => (
                  <option key={catIndex} value={category} className="bg-black">
                    {category}
                  </option>
                ))}
              </select>
              {items.length > 2 && (
                <button
                  onClick={() => removeItem(index)}
                  className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addItem}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center space-x-2 p-3 hover:bg-purple-400/10 rounded-xl transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Cloze Editor - Original Spec with underlining
function ClozeEditor({ question, updateData }) {
  const [sentence, setSentence] = useState(question.data?.sentence || "");
  const [selectedText, setSelectedText] = useState("");

  const handleSentenceChange = (e) => {
    const newSentence = e.target.value;
    setSentence(newSentence);
    updateData({ sentence: newSentence });
  };

  const handleTextSelect = (e) => {
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selected = sentence.substring(start, end);
      setSelectedText(selected);
    }
  };

  const addBlankFromSelection = () => {
    if (selectedText.trim()) {
      const currentBlanks = question.data?.blanks || [];
      const newBlanks = [
        ...currentBlanks,
        { id: Date.now(), text: selectedText.trim() },
      ];
      updateData({ blanks: newBlanks });
      setSelectedText("");
    }
  };

  const removeBlanks = (blankId) => {
    const currentBlanks = question.data?.blanks || [];
    const newBlanks = currentBlanks.filter((blank) => blank.id !== blankId);
    updateData({ blanks: newBlanks });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Sentence:
        </label>
        <textarea
          value={sentence}
          onChange={handleSentenceChange}
          onMouseUp={handleTextSelect}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all backdrop-blur-xl"
          rows="3"
          placeholder="Type your sentence here. Select text to create blanks."
        />
        {selectedText && (
          <button
            onClick={addBlankFromSelection}
            className="mt-2 text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center space-x-2 p-2 hover:bg-purple-400/10 rounded-xl transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Make "{selectedText}" a blank</span>
          </button>
        )}
      </div>

      {question.data?.blanks && question.data.blanks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-white/70 mb-3">
            Blank Words:
          </label>
          <div className="space-y-2">
            {question.data.blanks.map((blank, index) => (
              <div
                key={blank.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <span className="text-white">{blank.text}</span>
                <button
                  onClick={() => removeBlanks(blank.id)}
                  className="text-red-400 hover:bg-red-400/10 p-1 rounded transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Comprehension Editor - Simple MCQ Structure
function ComprehensionEditor({ question, updateData }) {
  const passage = question.data?.passage || "";
  const mcqs = question.data?.mcqs || [];

  const handlePassageChange = (e) => {
    updateData({ passage: e.target.value, mcqs });
  };

  const addMCQ = () => {
    const newMCQ = {
      id: Date.now(),
      question: "",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
    };
    updateData({ passage, mcqs: [...mcqs, newMCQ] });
  };

  const updateMCQ = (index, field, value) => {
    const newMcqs = [...mcqs];
    newMcqs[index] = { ...newMcqs[index], [field]: value };
    updateData({ passage, mcqs: newMcqs });
  };

  const updateMCQOption = (mcqIndex, optionIndex, value) => {
    const newMcqs = [...mcqs];
    newMcqs[mcqIndex].options[optionIndex] = value;
    updateData({ passage, mcqs: newMcqs });
  };

  const removeMCQ = (index) => {
    const newMcqs = mcqs.filter((_, i) => i !== index);
    updateData({ passage, mcqs: newMcqs });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Reading Passage:
        </label>
        <textarea
          value={passage}
          onChange={handlePassageChange}
          className="w-full p-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all backdrop-blur-xl"
          rows="6"
          placeholder="Enter the reading passage here..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-white/70">
            Multiple Choice Questions:
          </label>
          <button
            onClick={addMCQ}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center space-x-2 p-2 hover:bg-purple-400/10 rounded-xl transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add MCQ</span>
          </button>
        </div>

        <div className="space-y-4">
          {mcqs.map((mcq, index) => (
            <div
              key={mcq.id}
              className="p-4 bg-white/5 rounded-2xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-white">Question {index + 1}</h5>
                <button
                  onClick={() => removeMCQ(index)}
                  className="text-red-400 hover:bg-red-400/10 p-1 rounded transition-all"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                value={mcq.question}
                onChange={(e) => updateMCQ(index, "question", e.target.value)}
                placeholder="Enter your question..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 mb-3"
              />

              <div className="space-y-2">
                {mcq.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`correct-${mcq.id}`}
                      checked={mcq.correctAnswer === optIndex}
                      onChange={() =>
                        updateMCQ(index, "correctAnswer", optIndex)
                      }
                      className="text-emerald-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        updateMCQOption(index, optIndex, e.target.value)
                      }
                      className="flex-1 p-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm"
                      placeholder={`Option ${String.fromCharCode(
                        65 + optIndex
                      )}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FormBuilder;
