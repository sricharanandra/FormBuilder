import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { animate, utils, stagger } from "animejs";
import {
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  HomeIcon,
  PlusIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

function FormSuccess() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Page entrance animations
    animate(".success-icon", {
      opacity: [0, 1],
      scale: [0, 1],
      rotate: [0, 360],
      duration: 1000,
      easing: "out-back",
      delay: 300,
    });

    animate(".success-title", {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: "out-expo",
      delay: 600,
    });

    animate(".success-message", {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: "out-expo",
      delay: 800,
    });

    animate(".success-actions", {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      easing: "out-expo",
      delay: 1000,
    });

    // Floating success elements
    animate(".floating-success", {
      translateY: [-10, 10],
      duration: 2000,
      easing: "in-out-sine",
      direction: "alternate",
      loop: true,
      delay: stagger(300),
    });

    // Mouse parallax
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 100;
      const y = (e.clientY - window.innerHeight / 2) / 100;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-teal-900/20"></div>

        {/* Floating orbs */}
        <div
          className="floating-success absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl opacity-40"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${
              mousePosition.y * 0.3
            }px)`,
          }}
        ></div>
        <div
          className="floating-success absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl opacity-40"
          style={{
            transform: `translate(${mousePosition.x * -0.2}px, ${
              mousePosition.y * -0.2
            }px)`,
          }}
        ></div>
        <div
          className="floating-success absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl opacity-40"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${
              mousePosition.y * 0.4
            }px)`,
          }}
        ></div>

        {/* Success particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating-success absolute w-2 h-2 bg-emerald-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            transform: `translate(${mousePosition.x * 0.1}px, ${
              mousePosition.y * 0.1
            }px)`,
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-light bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-wide">
                Form Builder
              </span>
            </div>

            <div className="text-emerald-400 text-sm font-light">
              Submission Successful ✨
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="max-w-4xl mx-auto px-8 text-center">
          {/* Success Icon */}
          <div className="success-icon mb-12 opacity-0">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/25 mx-auto">
                <CheckCircleIcon className="w-16 h-16 text-white" />
              </div>

              {/* Success rings */}
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-ping"></div>
              <div
                className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          {/* Success Title */}
          <div className="success-title mb-8 opacity-0">
            <h1 className="text-6xl md:text-7xl font-thin tracking-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Thank You!
              </span>
            </h1>

            <div className="flex items-center justify-center space-x-3 mb-6">
              <SparklesIcon className="w-8 h-8 text-emerald-400" />
              <h2 className="text-3xl font-light text-white">
                Form Submitted Successfully
              </h2>
              <SparklesIcon className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          {/* Success Message */}
          <div className="success-message mb-16 opacity-0">
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Your responses have been recorded and will be reviewed. We
              appreciate you taking the time to complete this form.
            </p>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-light text-white mb-6">
                What's Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <EyeIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-white/70 font-light text-sm">
                    Your responses will be reviewed
                  </p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <SparklesIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-white/70 font-light text-sm">
                    Data processed securely
                  </p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-white/70 font-light text-sm">
                    You may receive a follow-up
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="success-actions space-y-6 opacity-0">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/dashboard"
                className="group bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-10 py-5 rounded-2xl font-medium shadow-2xl hover:shadow-purple-500/25 transition-all transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="flex items-center space-x-3">
                  <EyeIcon className="w-5 h-5" />
                  <span>View Dashboard</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                to="/builder/new"
                className="group bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-medium transition-all transform hover:-translate-y-1 border border-white/20 hover:border-white/30"
              >
                <span className="flex items-center space-x-3">
                  <PlusIcon className="w-5 h-5" />
                  <span>Create New Form</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>

            <div className="pt-8">
              <Link
                to="/"
                className="group text-white/60 hover:text-white transition-colors font-light flex items-center justify-center space-x-2"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Floating success elements */}
      <div className="absolute bottom-8 left-8 floating-success">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
      </div>
      <div className="absolute top-8 right-8 floating-success">
        <div className="w-20 h-20 bg-teal-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}

export default FormSuccess;
