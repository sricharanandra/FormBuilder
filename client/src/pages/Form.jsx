import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { animate, utils, stagger } from "animejs";
import axios from "axios";
import { API_ENDPOINTS, UPLOAD_URL } from "../config/api";
import CategorizeRenderer from "../components/FormRenderer/CategorizeRenderer";
import ClozeRenderer from "../components/FormRenderer/ClozeRenderer";
import ComprehensionRenderer from "../components/FormRenderer/ComprehensionRenderer";
import {
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  ShareIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

function Form() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchForm();

    // Page entrance animations
    animate(".form-preview-hero", {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      easing: "out-expo",
      delay: 300,
    });

    animate(".form-preview-question", {
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.95, 1],
      duration: 800,
      easing: "out-expo",
      delay: stagger(150, { start: 600 }),
    });

    // Mouse parallax
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 100;
      const y = (e.clientY - window.innerHeight / 2) / 100;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [formId]);

  const fetchForm = async () => {
    try {
      console.log("Fetching form with ID:", formId);
      const response = await axios.get(`${API_ENDPOINTS.FORMS}/${formId}`);
      console.log("Form data received:", response.data);
      setForm(response.data);

      // Initialize answers
      const initialAnswers = {};
      if (response.data.questions && response.data.questions.length > 0) {
        response.data.questions.forEach((question) => {
          initialAnswers[question.id || question._id] = "";
        });
      }
      console.log("Initial answers:", initialAnswers);
      setAnswers(initialAnswers);
    } catch (error) {
      console.error("Error fetching form:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${UPLOAD_URL}${
      imagePath.startsWith("/") ? imagePath : `/${imagePath}`
    }`;
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    animate(".preview-submit-button", {
      scale: [1, 0.95, 1],
      duration: 200,
      easing: "out-quad",
    });

    try {
      await axios.post(API_ENDPOINTS.RESPONSES, {
        formId,
        answers: Object.keys(answers).map((questionId) => ({
          questionId,
          answer,
        })),
      });
      navigate("/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const renderQuestion = (question, index) => {
    const questionId = question.id || question._id;
    console.log("Rendering question:", questionId, question.type, question);

    switch (question.type) {
      case "categorize":
        return (
          <CategorizeRenderer
            key={questionId}
            question={question}
            onAnswer={(answer) => handleAnswer(questionId, answer)}
          />
        );
      case "cloze":
        return (
          <ClozeRenderer
            key={questionId}
            question={question}
            onAnswer={(answer) => handleAnswer(questionId, answer)}
          />
        );
      case "comprehension":
        return (
          <ComprehensionRenderer
            key={questionId}
            question={question}
            onAnswer={(answer) => handleAnswer(questionId, answer)}
          />
        );
      default:
        console.warn("Unknown question type:", question.type);
        return (
          <div key={questionId} className="text-center py-8 text-white/60">
            <p>Unknown question type: {question.type}</p>
            <pre className="text-xs mt-4 bg-white/5 p-4 rounded text-left overflow-auto">
              {JSON.stringify(question, null, 2)}
            </pre>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-spin">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-light text-white mb-4">
              Loading form...
            </h2>
            <p className="text-white/60 font-light">Preparing your preview</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-3xl font-light text-white mb-4">
              Form not found
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-medium hover:scale-105 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>

        {/* Floating orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-30"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${
              mousePosition.y * 0.3
            }px)`,
          }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl opacity-30"
          style={{
            transform: `translate(${mousePosition.x * -0.2}px, ${
              mousePosition.y * -0.2
            }px)`,
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <EyeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-light bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
                  Form Preview
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all">
                <ShareIcon className="w-5 h-5" />
              </button>
              <button className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all">
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="form-preview-hero text-center mb-16">
          {form.headerImage && (
            <div className="mb-8">
              <img
                src={getImageUrl(form.headerImage)}
                alt="Form header"
                className="w-full max-w-2xl mx-auto rounded-3xl shadow-2xl object-cover border border-white/10"
                style={{ maxHeight: "300px" }}
              />
            </div>
          )}

          <h1 className="text-5xl md:text-6xl font-thin tracking-tight mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {form.title}
            </span>
          </h1>

          {form.description && (
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              {form.description}
            </p>
          )}

          <div className="flex items-center justify-center space-x-8 text-white/50">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="w-5 h-5" />
              <span className="font-light">
                {form.questions?.length || 0} questions
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5" />
              <span className="font-light">
                ~{Math.ceil((form.questions?.length || 0) * 1.5)} min
              </span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-12">
          {form.questions && form.questions.length > 0 ? (
            form.questions.map((question, index) => (
              <div
                key={question.id || question._id}
                className="form-preview-question bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-medium shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-light text-white mb-2">
                        {question.title}
                      </h2>
                      <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-xl text-sm font-light border border-purple-500/30">
                          {question.type}
                        </span>
                        {question.required && (
                          <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-xl text-sm font-light border border-rose-500/30">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {question.image && (
                    <div className="mb-6">
                      <img
                        src={getImageUrl(question.image)}
                        alt="Question illustration"
                        className="w-full max-w-lg mx-auto rounded-2xl shadow-lg object-cover border border-white/10"
                        style={{ maxHeight: "400px" }}
                      />
                    </div>
                  )}
                </div>

                {/* Question preview content */}
                <div className="question-content">
                  {renderQuestion(question, index)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <DocumentTextIcon className="w-16 h-16 text-purple-400/50" />
              </div>
              <h3 className="text-3xl font-thin text-white mb-4">
                No questions available
              </h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto font-light text-lg leading-relaxed">
                This form doesn't have any questions yet.
              </p>
            </div>
          )}
        </div>

        {/* Preview Actions */}
        <div className="text-center pt-16">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12">
            <div className="mb-8">
              <EyeIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-3xl font-light text-white mb-4">
                Interactive Form Preview
              </h3>
              <p className="text-white/70 font-light">
                You can interact with the questions above or fill the form
                properly
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="preview-submit-button group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-10 py-5 rounded-2xl font-medium shadow-2xl hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-1 disabled:opacity-50"
              >
                <span className="flex items-center space-x-3">
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Preview</span>
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={() => navigate(`/fill/${formId}`)}
                className="group bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-10 py-5 rounded-2xl font-medium shadow-2xl hover:shadow-purple-500/25 transition-all transform hover:-translate-y-1"
              >
                <span className="flex items-center space-x-3">
                  <span>Fill Form Properly</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="group bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-medium transition-all transform hover:-translate-y-1 border border-white/20 hover:border-white/30"
              >
                <span className="flex items-center space-x-3">
                  <span>Back to Dashboard</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Form;
