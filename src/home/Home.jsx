import './Home.css'
import useTypewriter from './UseTypewriter.jsx'
import { useNavigate } from 'react-router-dom'
import houseflyLogo from '../assets/housefly-logo.png'
import houseflyText from '../assets/housefly-text.png'
import { getCurrentUser } from '../auth/auth.js'
import { Button } from '@headlessui/react';
import BackgroundCubes from '../background/BackgroundCubes.jsx'

export function ContentCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function Home() {
  const navigate = useNavigate()
  const user = getCurrentUser();
  return (
    <>
      <div className="relative min-h-screen bg-slate-50 mt-16">
        <BackgroundCubes />
      <main className="py-45 relative z-10">
        <div className='home-container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
          {/* Hero */}
          <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-900 to-blue-600 text-white shadow-xl">
            <div className="grid gap-8 px-6 py-10 sm:px-8 sm:py-8 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-100">
                  {new Date().toDateString()}
                </div>

                <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                  {useTypewriter(`Welcome${user ? `, ${user.name.split(' ')[0]}` : ''}!`, 45)}
                </h1>
                <p className="mt-4 max-w-xl text-base sm:text-lg text-blue-100/90">
                  All the property info you need in one place. <br />
                  Research smarter, plan better, buy with confidence.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-100">
                    Explore Events
                  </button>
                  <button className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15">
                    Host an Event
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-blue-100">Events This Week</p>
                  <p className="mt-2 text-4xl font-black">128</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-blue-100">Active Suburbs</p>
                  <p className="mt-2 text-4xl font-black">43</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold text-blue-100">Active Homes</p>
                  <p className="mt-2 text-4xl font-black">1.4k</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section header */}
          <div className="mt-10">
            <PageHeader
              title="Why Housefly?"
              subtitle="A cleaner way to browse housing events, check location insights, and keep track of listings that matter."
            />
          </div>

          {/* Feature cards */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <ContentCard>
              <h3 className="text-lg font-bold text-slate-900">Explore by area</h3>
              <p className="mt-2 text-sm text-slate-600">
                Browse events near you with a location-first experience that feels fast and simple.
              </p>
            </ContentCard>

            <ContentCard>
              <h3 className="text-lg font-bold text-slate-900">Map-based discovery</h3>
              <p className="mt-2 text-sm text-slate-600">
                See where inspections and housing events are happening at a glance.
              </p>
            </ContentCard>

            <ContentCard>
              <h3 className="text-lg font-bold text-slate-900">Analytics for organisers</h3>
              <p className="mt-2 text-sm text-slate-600">
                Track engagement, attendance, and event performance in one place.
              </p>
            </ContentCard>
          </div>

          {/* Secondary section */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <ContentCard>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Featured Events
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="h-32 rounded-xl bg-slate-200" />
                    <h3 className="mt-3 font-bold text-slate-900">
                      Example Housing Event
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      North Sydney • Saturday 11:00 AM
                    </p>
                  </div>
                ))}
              </div>
            </ContentCard>

            <ContentCard>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Quick Actions
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition"
                  onClick={() => navigate("/map")}
                >
                  View Map
                </button>
                <button
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => navigate("/analytics")}
                >
                  See Analytics
                </button>
                <button
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => { window.scrollTo(0, 0); navigate("/register"); }}
                >
                  Create Account
                </button>
              </div>
            </ContentCard>
          </div>
        </div>
      </main>
    </div>
    </>
  )
}

export default Home
