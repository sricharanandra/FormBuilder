import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { animate, utils, stagger } from "animejs";
import {
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckIcon,
  CubeTransparentIcon,
  AcademicCapIcon,
  ChartBarIcon,
  StarIcon,
  BoltIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

function LandingPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Page load animation
    setIsLoaded(true);

    // Hero entrance animation
    animate(".hero-title", {
      opacity: [0, 1],
      translateY: [50, 0],
      scale: [0.8, 1],
      duration: 1200,
      easing: "out-expo",
      delay: 300,
    });

    animate(".hero-subtitle", {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      easing: "out-expo",
      delay: 600,
    });

    animate(".hero-cta", {
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.9, 1],
      duration: 800,
      easing: "out-back",
      delay: 900,
    });

    // Floating elements animation
    animate(".floating-element", {
      translateY: [-20, 20],
      duration: 3000,
      easing: "in-out-sine",
      direction: "alternate",
      loop: true,
      delay: stagger(200),
    });

    // Mouse movement parallax
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains("features-section")) {
              animate(".feature-card", {
                opacity: [0, 1],
                translateY: [60, 0],
                scale: [0.8, 1],
                duration: 800,
                easing: "out-expo",
                delay: stagger(150),
              });
            }

            if (entry.target.classList.contains("stats-section")) {
              animate(".stat-item", {
                opacity: [0, 1],
                scale: [0, 1],
                duration: 600,
                easing: "out-back",
                delay: stagger(100),
              });

              // Number counting animation - simplified for v4
              const statNumbers = utils.$(".stat-number");
              statNumbers.forEach((el, index) => {
                const targetValue = parseInt(el.getAttribute("data-count"));
                let currentValue = 0;
                const increment = targetValue / 60; // 60 frames for smooth animation

                const counter = setInterval(() => {
                  currentValue += increment;
                  if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(counter);
                  }
                  el.textContent = Math.floor(currentValue);
                }, 33); // ~30fps
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (statsRef.current) observer.observe(statsRef.current);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const handleCTAClick = () => {
    animate(".hero-cta button", {
      scale: [1, 0.95, 1],
      duration: 200,
      easing: "out-quad",
      onComplete: () => navigate("/dashboard"),
    });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>

        {/* Floating orbs */}
        <div className="floating-element absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="floating-element absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="floating-element absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        ></div>
      </div>

      {/* Ultra-minimal Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-lg"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-light tracking-wide">
                Form Builder
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-12">
              <a
                href="#features"
                className="text-white/80 hover:text-white transition-colors tracking-wide"
              >
                Features
              </a>
              <a
                href="#showcase"
                className="text-white/80 hover:text-white transition-colors tracking-wide"
              >
                Showcase
              </a>
              <button
                onClick={() => navigate("/dashboard")}
                className="relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative">Enter</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating badge */}
          <div className="hero-subtitle mb-8 opacity-0">
            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
              <SparklesIcon className="w-5 h-5 text-purple-400" />
              <span className="text-sm tracking-wide">
                Next-generation form builder
              </span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Main title */}
          <h1 className="hero-title text-7xl md:text-9xl font-thin tracking-tight mb-8 opacity-0">
            <span className="block">Forms</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-xl md:text-2xl text-white/70 mb-16 max-w-3xl mx-auto font-light tracking-wide leading-relaxed opacity-0">
            Create interactive experiences that captivate and convert.
            <br className="hidden md:block" />
            Powerful by nature. Beautiful by design.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-8 opacity-0">
            <button
              onClick={handleCTAClick}
              className="group relative px-12 py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full text-lg font-medium overflow-hidden transition-all hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative flex items-center space-x-3">
                <span>Start Creating</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button className="group flex items-center space-x-4 px-8 py-6 text-white/80 hover:text-white transition-colors">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <PlayIcon className="w-6 h-6 ml-1" />
              </div>
              <div className="text-left">
                <div className="font-medium">Watch Demo</div>
                <div className="text-sm text-white/60">2 min overview</div>
              </div>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="stats-section relative py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-item text-center opacity-0">
              <div className="text-4xl md:text-6xl font-thin mb-2">
                <span
                  className="stat-number bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  data-count="50"
                >
                  50
                </span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  k+
                </span>
              </div>
              <div className="text-white/60 tracking-wide">Forms Created</div>
            </div>
            <div className="stat-item text-center opacity-0">
              <div className="text-4xl md:text-6xl font-thin mb-2">
                <span
                  className="stat-number bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                  data-count="2"
                >
                  2
                </span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  M+
                </span>
              </div>
              <div className="text-white/60 tracking-wide">Responses</div>
            </div>
            <div className="stat-item text-center opacity-0">
              <div className="text-4xl md:text-6xl font-thin mb-2">
                <span
                  className="stat-number bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
                  data-count="98"
                >
                  98
                </span>
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  %
                </span>
              </div>
              <div className="text-white/60 tracking-wide">Satisfaction</div>
            </div>
            <div className="stat-item text-center opacity-0">
              <div className="text-4xl md:text-6xl font-thin mb-2">
                <span
                  className="stat-number bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent"
                  data-count="150"
                >
                  150
                </span>
                <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                  +
                </span>
              </div>
              <div className="text-white/60 tracking-wide">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className="features-section relative py-32 px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-thin mb-8 tracking-tight">
              <span className="text-white">Crafted for</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Perfection
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Every detail designed to deliver exceptional experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CubeTransparentIcon,
                title: "Intuitive Design",
                description:
                  "Drag, drop, and watch magic happen. No learning curve, just pure creativity.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: BoltIcon,
                title: "Lightning Fast",
                description:
                  "Built for speed. Your forms load instantly, your users stay engaged.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: HeartIcon,
                title: "Loved by Users",
                description:
                  "Conversion rates that make you smile. Experiences that users remember.",
                gradient: "from-rose-500 to-orange-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 opacity-0"
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-light mb-4 text-white group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-white/70 leading-relaxed font-light">
                    {feature.description}
                  </p>

                  {/* Hover glow effect */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity -z-10`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="relative py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-thin mb-8 tracking-tight text-white">
              See the Difference
            </h2>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                      <span className="text-white/80">
                        Real-time collaboration
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                      <span className="text-white/80">Advanced analytics</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span className="text-white/80">Smart integrations</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                      <span className="text-white/80">Mobile optimized</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-6 backdrop-blur-xl border border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-light text-white">
                        Form Builder
                      </h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/30">
                        <div className="text-sm text-purple-300 mb-1">
                          🎯 Interactive Elements
                        </div>
                        <div className="text-xs text-purple-200/70">
                          Drag & drop interface
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 rounded-xl border border-cyan-500/30">
                        <div className="text-sm text-cyan-300 mb-1">
                          ⚡ Real-time Preview
                        </div>
                        <div className="text-xs text-cyan-200/70">
                          Instant feedback
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-thin mb-8 tracking-tight">
              <span className="text-white">Ready to create</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                something beautiful?
              </span>
            </h2>

            <p className="text-xl text-white/70 mb-12 font-light leading-relaxed">
              Join thousands of creators who've already transformed their
              workflow
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="group px-12 py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full text-lg font-medium hover:scale-105 transition-all"
              >
                <span className="flex items-center space-x-3">
                  <span>Start Your Journey</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <div className="text-white/60 text-sm font-light">
                ✨ No credit card required • 🎯 Free forever plan
              </div>
            </div>

            {/* Floating elements around CTA */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl floating-element"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-xl floating-element"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-8 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-lg"></div>
              <span className="text-2xl font-light tracking-wide">
                Form Builder
              </span>
            </div>

            <div className="text-white/40 text-sm font-light">
              © 2024 Form Builder. Crafted with passion for creators worldwide.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
