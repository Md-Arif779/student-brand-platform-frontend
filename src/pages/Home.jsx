
import { Link } from "react-router-dom";

const opportunities = [
  {
    category: "Content Creation",
    title: "Create content. Build your portfolio.",
    description:
      "Collaborate with brands and showcase your creativity.",
    icon: "✦",
    color: "bg-blue-50 text-blue-700",
  },
  {
    category: "Campus Ambassador",
    title: "Represent brands on campus.",
    description:
      "Connect with communities and grow your professional network.",
    icon: "◈",
    color: "bg-violet-50 text-violet-700",
  },
  {
    category: "Video & Creative Work",
    title: "Turn your skills into opportunities.",
    description:
      "Explore creative projects that match your interests.",
    icon: "▶",
    color: "bg-amber-50 text-amber-700",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Join as a student or register your brand on the platform.",
  },
  {
    number: "02",
    title: "Discover opportunities",
    description:
      "Find relevant GIGs, connect with people, and get selected.",
  },
  {
    number: "03",
    title: "Collaborate and grow",
    description:
      "Complete projects, earn from your work, and build your reputation.",
  },
];

function Home() {
  return (
    <div className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative isolate bg-slate-950">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:px-8 lg:py-32">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-200">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Where student talent meets brands
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your talent deserves
              <span className="block text-blue-400">
                real opportunities.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Discover creative projects, collaborate with brands,
              gain real-world experience, and turn your skills into
              meaningful achievements.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup/student"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
              >
                Join as a Student
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/signup/brand"
                className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-6 py-3.5 font-semibold text-white transition hover:border-slate-400 hover:bg-white/5"
              >
                Join as a Brand
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <span>✓ Student opportunities</span>
              <span>✓ Brand collaborations</span>
              <span>✓ Skill development</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm text-slate-400">
                    Opportunity discovery
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-white">
                    Find your next GIG
                  </h2>
                </div>

                <span className="rounded-xl bg-blue-500/15 px-3 py-2 text-xl text-blue-300">
                  ✦
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
                      ◈
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-blue-300">
                        CAMPUS AMBASSADOR
                      </span>
                      <h3 className="mt-1 font-semibold text-white">
                        Represent a brand
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        Connect with your campus community.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-xl text-emerald-300">
                      ▶
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-emerald-300">
                        CREATIVE PROJECT
                      </span>
                      <h3 className="mt-1 font-semibold text-white">
                        Create engaging content
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        Put your creativity into practice.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-600 p-5">
                  <p className="text-sm text-blue-100">
                    Ready to take the next step?
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">
                      Start your journey today.
                    </p>
                    <Link
                      to="/signup"
                      className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                    >
                      Join now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-16 hidden rounded-xl border border-white/10 bg-slate-900 px-4 py-3 shadow-xl sm:block">
              <p className="text-xs text-slate-400">
                Your next chapter
              </p>
              <p className="mt-1 font-semibold text-white">
                Starts with one GIG.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Explore possibilities
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Make your skills count
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Find different ways to work with brands, develop
              practical skills, and grow your experience.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {opportunities.map((item) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${item.color}`}
                >
                  {item.icon}
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-wider text-blue-700">
                  {item.category}
                </p>

                <h3 className="mt-3 text-xl font-bold leading-snug text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>

                <Link
                  to="/signup"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition group-hover:gap-3"
                >
                  Explore opportunities <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* For students and brands */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div
            id="for-students"
            className="rounded-3xl bg-blue-700 p-8 sm:p-10"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              For students
            </span>

            <h2 className="mt-4 text-3xl font-bold text-white">
              Turn your potential into experience.
            </h2>

            <p className="mt-4 leading-7 text-blue-100">
              Build your profile, discover brand collaborations,
              demonstrate your skills, and develop a track record
              through real projects.
            </p>

            <Link
              to="/signup/student"
              className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Create Student Account →
            </Link>
          </div>

          <div
            id="for-brands"
            className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-700">
              For brands
            </span>

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              Connect with the next generation.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Reach student communities, find creative talent,
              and manage collaborations through a dedicated platform.
            </p>

            <Link
              to="/signup/brand"
              className="mt-8 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Create Brand Account →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Simple process
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              A straightforward path from joining the platform
              to building meaningful collaborations.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-5xl font-bold tracking-tight text-blue-100">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-950 px-6 py-14 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Your next opportunity starts here.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Join a platform designed to bring student creativity
            and brand opportunities together.
          </p>

          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-500"
          >
            Get Started Today <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
