import { useEffect, useState } from "react";

import { fetchHealth } from "./api/health";
import "./App.css";

type ApiStatus = "checking" | "available" | "unavailable";

const statusContent = {
  checking: {
    title: "Checking connection",
    description: "Contacting the study planner API.",
  },
  available: {
    title: "API available",
    description: "The client and server are communicating successfully.",
  },
  unavailable: {
    title: "API unavailable",
    description: "Start the local API and refresh this page to try again.",
  },
} satisfies Record<
  ApiStatus,
  {
    title: string;
    description: string;
  }
>;

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();

    async function checkApi() {
      try {
        await fetchHealth(controller.signal);
        setApiStatus("available");
      } catch {
        if (!controller.signal.aborted) {
          setApiStatus("unavailable");
        }
      }
    }

    void checkApi();

    return () => {
      controller.abort();
    };
  }, []);

  const currentStatus = statusContent[apiStatus];

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Study Planner home">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <span>Study Planner</span>
        </a>

        <span className="version-label">Foundation release</span>
      </header>

      <main className="landing-layout">
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow">Collaborative Study Planner</p>

          <h1 id="page-title">
            Plan the work.
            <span>Make progress visible.</span>
          </h1>

          <p className="hero-copy">
            One focused place for assignments, priorities, deadlines, and
            shared study plans.
          </p>

          <ul className="feature-list" aria-label="Planned features">
            <li>Workspaces</li>
            <li>Task tracking</li>
            <li>Shared progress</li>
          </ul>
        </section>

        <aside className="status-card" aria-labelledby="status-title">
          <div className="status-label">
            <span
              className={`status-dot status-dot--${apiStatus}`}
              aria-hidden="true"
            />
            <span>System check</span>
          </div>

          <h2 id="status-title">{currentStatus.title}</h2>

          <p
            className="status-description"
            role={apiStatus === "unavailable" ? "alert" : "status"}
            aria-live="polite"
          >
            {currentStatus.description}
          </p>

          <dl className="status-details">
            <div>
              <dt>Environment</dt>
              <dd>Local development</dd>
            </div>
            <div>
              <dt>Endpoint</dt>
              <dd>
                <code>/api/health</code>
              </dd>
            </div>
          </dl>
        </aside>
      </main>

      <footer className="site-footer">
        Built for students who want a clearer view of what comes next.
      </footer>
    </div>
  );
}

export default App;