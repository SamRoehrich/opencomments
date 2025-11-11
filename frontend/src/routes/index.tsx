import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const handleCommentClick = async (e) => {
    const data = await fetch("http://localhost:3001/api/comment/create", {
      method: "POST",
      body: JSON.stringify({
        url: window.location.pathname,
        description: "from the client",
        cordinates: JSON.stringify([e.pageX, e.pageY]),
        resolved: false,
      }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="relative py-20 px-6 text-center overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="relative max-w-5xl mx-auto h-full">
          <div className="flex items-center justify-center gap-6 mb-6">
            <h1 className="text-6xl md:text-7xl font-black text-white [letter-spacing:-0.08em]">
              <span className="text-gray-300">Feedback made</span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                easy
              </span>
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
            You need a design review. How do you do it? Slack, Linear, Google
            Meet?
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            What if you just left your feedback directly on the page?
          </p>
        </div>
      </section>
      <button onClick={handleCommentClick}>Make your first comment</button>
    </div>
  );
}
