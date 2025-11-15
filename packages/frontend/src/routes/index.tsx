import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Zap, Eye, CheckCircle2, ArrowRight, Github, Twitter } from "lucide-react";
import { OpenCommentsWidget } from "../components/OpenCommentsWidget";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="min-h-screen bg-white">
      <OpenCommentsWidget apiUrl="http://localhost:3001" />
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">OpenComments</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How it Works</a>
            <a href="https://github.com/SamRoehrich/opencomments" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Contextual feedback made simple</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Leave feedback
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              directly on the page
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            No more screenshots, Slack threads, or confusing email chains.
            <br />
            Comment directly on any element, anywhere.
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            OpenComments lets you and your team leave contextual feedback on any website or web app. 
            See exactly what needs to be changed, right where it matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#get-started" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#demo" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition"
            >
              <Eye className="w-5 h-5" />
              See it in action
            </a>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 relative">
            <div className="rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="flex-1 text-center text-sm text-gray-500">example.com</div>
              </div>
              <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-gray-600">Interactive demo coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need for better feedback
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make design reviews and feedback collection effortless
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contextual Comments</h3>
              <p className="text-gray-600">
                Click anywhere on the page to leave a comment. No need to describe where - we know exactly what you're referring to.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visual Screenshots</h3>
              <p className="text-gray-600">
                Every comment automatically captures a screenshot of the page, so you never lose context.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Threaded Discussions</h3>
              <p className="text-gray-600">
                Have conversations right where they matter. Reply to comments and keep all feedback organized.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Lightweight Widget</h3>
              <p className="text-gray-600">
                One small widget is all you need. No complex setup, no heavy dependencies. Just works.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Environment Filtering</h3>
              <p className="text-gray-600">
                Organize feedback by environment. See production issues separate from staging feedback.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Resolve & Track</h3>
              <p className="text-gray-600">
                Mark comments as resolved and keep track of what's been fixed. Never lose track of feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes. No complex setup required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Add the Widget</h3>
              <p className="text-gray-600">
                Include our lightweight widget on your page. One script tag, that's it.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Click to Comment</h3>
              <p className="text-gray-600">
                Click anywhere on your page to leave feedback. We capture the context automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborate</h3>
              <p className="text-gray-600">
                Team members can see and reply to comments. Resolve issues as you fix them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="get-started" className="py-20 px-6 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to improve your feedback process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start collecting contextual feedback today. It's free and takes less than a minute to set up.
          </p>
          <a 
            href="https://github.com/SamRoehrich/opencomments" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            View on GitHub
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">OpenComments</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://github.com/SamRoehrich/opencomments" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2025 OpenComments. Open source feedback tool for the web.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
