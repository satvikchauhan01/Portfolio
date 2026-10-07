/*
 * Portfolio content.
 *
 * Everything that changes over time lives in this file: projects, experience,
 * skills, certificates. main.js renders it. Edit here, not in index.html.
 *
 * Every statement below was checked against the project repositories, the
 * certificates or the resume. Keep it that way: if a claim cannot be traced
 * to a source, leave it out.
 */
window.PORTFOLIO = {
  /* ------------------------------------------------------------------ */
  /* Featured projects. Order here is the order on the page.            */
  /* ------------------------------------------------------------------ */
  projects: [
    {
      id: 'opspilot',
      when: 'Aug – Sep 2026',
      index: '01',
      hue: 'blue',
      hot: 'orange',
      name: 'OpsPilot',
      title: 'AI incident-response copilot for Kubernetes',
      summary:
        'OpsPilot turns Alertmanager alerts into incidents, investigates them with a Gemini agent that queries Prometheus, Loki, Tempo and the Kubernetes API, and proposes a fix. Nothing runs until a responder approves it.',
      problem:
        'During an incident the evidence is spread across metrics, logs, traces and recent deploys. Responders spend the first minutes correlating it by hand before they can decide what to try.',
      built:
        'An Express and MongoDB server that groups related alerts using the service dependency graph, keeps every cluster change on one timeline, and runs an investigation agent with read-only tools. A React console streams the investigation, the fix and its verification over Server-Sent Events.',
      interesting:
        'Every hypothesis cites the exact query and result behind it. Runbooks and past incidents are embedded locally and retrieved with Atlas Vector Search. Fixes run as a service account that can only patch Deployments in one namespace, and each step lands in a hash-chained audit log.',
      stack: ['Node.js', 'Gemini', 'Atlas Vector Search', 'Kubernetes', 'Prometheus', 'Loki', 'Tempo', 'OpenTelemetry'],
      links: { github: 'https://github.com/satvikchauhan01/OpsPilot' },
      figure: {
        type: 'pipeline',
        title: 'How OpsPilot handles an incident',
        caption: 'Read left to right: from the first alert to a verified fix. The orange step is the approval gate. Nothing in the cluster is changed until a person signs off.',
        steps: [
          { t: 'Alert', icon: 'bell', d: 'Alertmanager webhook' },
          { t: 'Correlation', icon: 'merge', d: 'Grouped by dependency graph' },
          { t: 'Evidence', icon: 'layers', d: 'Metrics, logs, traces, changes' },
          { t: 'Investigation', icon: 'search', d: 'Gemini agent with runbook retrieval' },
          { t: 'Root cause', icon: 'target', d: 'Ranked, cited hypotheses' },
          { t: 'Approval', icon: 'user-check', d: 'A responder signs off', accent: true },
          { t: 'Remediation', icon: 'wrench', d: 'Roll back, restart or scale' },
          { t: 'Verification', icon: 'check-circle', d: 'Three minutes against metrics' }
        ],
        rails: [
          { k: 'Data it reads', v: 'Prometheus, Loki, Tempo and the Kubernetes API, through read-only tools' },
          { k: 'What it remembers', v: 'Markdown runbooks and resolved incidents, embedded locally, searched with Atlas Vector Search' },
          { k: 'Safety limits', v: 'Scoped executor service account, three allowed actions, append-only audit log chained by hash' }
        ]
      },
      study: {
        solution:
          'OpsPilot sits next to the observability stack. Alertmanager posts alerts to it; the server normalises them, groups related alerts into one incident using the service dependency graph, and merges them with every tracked cluster change (deploys, scaling, config changes, restarts, Kubernetes warnings) into a single timeline. It estimates which service the failure started in and which services it reaches. A Gemini agent then investigates and ranks root-cause hypotheses. From the top hypothesis and the matching runbook section OpsPilot proposes one action. Once a responder approves, the executor applies it and OpsPilot watches the incident\'s metrics before calling the fix verified.',
        architecture: [
          { k: 'Demo workload', v: 'A four-service shop (gateway, checkout, inventory, payments) with a load generator, instrumented with prom-client metrics and OpenTelemetry traces and logs.' },
          { k: 'Observability', v: 'OpenTelemetry Collector, Prometheus, Alertmanager, Loki, Tempo, Grafana and kube-state-metrics, deployed with Kustomize.' },
          { k: 'Server', v: 'Express on Node.js 22 with modules for alert ingestion, correlation, change tracking, investigation, knowledge, remediation and audit. State lives in MongoDB Atlas.' },
          { k: 'Knowledge', v: 'Runbooks and resolved incidents, embedded on the server with transformers.js and searched by meaning with Atlas Vector Search.' },
          { k: 'Console', v: 'React app fed by Server-Sent Events: charts synced with the timeline, a dependency map, the investigation step by step, rollout and verification, a runbook library and the audit log.' }
        ],
        decisions: [
          { t: 'Read-only investigation with cited evidence', d: 'The agent can query Prometheus, Loki, Tempo and Kubernetes but cannot change anything. Each claim carries the query and result it came from, so a responder can check the reasoning instead of trusting it.' },
          { t: 'A small, fixed action catalog', d: 'Three actions only: roll back, rolling restart, or scale between 1 and 6 replicas. Each proposal states its reason and the runbook section behind it.' },
          { t: 'Least-privilege execution', d: 'Approved fixes run as a dedicated service account that can only read and patch Deployments in the shop\'s namespace.' },
          { t: 'Verify before closing', d: 'After a fix, OpsPilot watches error rate, latency, memory and saturation for three minutes before marking it verified.' },
          { t: 'Local embeddings', d: 'Runbooks and incidents are embedded in-process, so retrieval does not depend on an external embedding API. Only runbook files that changed are embedded again.' }
        ],
        stack: [
          { k: 'Server', v: ['Node.js 22', 'Express 5', 'Mongoose', 'Zod', 'pino'] },
          { k: 'AI', v: ['Gemini API', 'transformers.js', 'MongoDB Atlas Vector Search'] },
          { k: 'Kubernetes', v: ['@kubernetes/client-node', 'Kustomize', 'minikube'] },
          { k: 'Observability', v: ['Prometheus', 'Alertmanager', 'Loki', 'Tempo', 'OpenTelemetry Collector', 'Grafana'] },
          { k: 'Console', v: ['React 19', 'TanStack Query', 'D3', 'Vite'] }
        ],
        outcomeTitle: 'Results',
        outcome: [
          'Evaluation in the repository (docs/evaluation.md): four injected failure scenarios, with the correct root cause required to rank first in at least 4 of 5 runs. Results: bad deploy 4/5, memory leak 4/5, slow dependency 5/5, traffic spike 4/4, which is 17 of 19 runs overall.',
          'Runs against a four-service demo shop on a local minikube cluster, where each failure scenario can be injected on demand.'
        ]
      }
    },

    {
      id: 'canaryshield',
      when: 'Sep 2026',
      index: '02',
      hue: 'amber',
      hot: 'rose',
      name: 'CanaryShield',
      title: 'Feature flags and canary releases with automatic rollback',
      status: 'Hackathon project',
      summary:
        'CanaryShield releases a feature to a small slice of users, compares the canary\'s error rate with the stable version\'s in Prometheus, and rolls the flag back on its own when the canary breaches its threshold.',
      problem:
        'A normal deploy reaches every user at once. If it is broken, everyone is hit before anyone notices, and rolling back needs a person.',
      built:
        'The Go platform API for flags, targeting and rollout state, backed by PostgreSQL with Redis as cache and pub/sub. A guardian loop checks Prometheus every 5 seconds and rolls a breaching flag back to 0%, opening an incident that records who was exposed.',
      interesting:
        'Users are bucketed with sha256(flagKey:salt:userId) mod 10000, so rollouts are sticky and only ever add users. Evaluation reads an immutable in-memory snapshot with no I/O on the request path. The guardian never acts on missing data.',
      stack: ['Go', 'PostgreSQL', 'Redis', 'Prometheus', 'React', 'TypeScript', 'Docker Compose'],
      links: { github: 'https://github.com/satvikchauhan01/CanaryShield' },
      credit: 'Built with Krish, who owned the dashboard and the demo shop. I owned the backend: platform API, guardian, load generator and infrastructure.',
      figure: {
        type: 'rollout',
        title: 'A canary rollout, and what stops a bad one',
        caption: 'Top: the real incident page after an automatic rollback (dashboard UI by Krish). Below: 10% of users are on the new version while the guardian watches its error rate.',
        studyCaption: 'A rollout at 10%. Most users stay on the stable version while the guardian watches the new one.',
        shot: {
          src: 'assets/img/projects/canaryshield-incident.webp',
          w: 1440, h: 900,
          label: 'CanaryShield · Incident detail',
          alt: 'CanaryShield incident page: canary error rate 12.99% against a 7% threshold, 10% of traffic exposed, 230 users exposed, rolled back in 5 seconds.'
        },
        stable: 90,
        canary: 10,
        steps: ['5%', '10%', '25%', '50%', '100%'],
        active: 1,
        rails: [
          { k: 'The guardian', v: 'Checks the new version\'s error rate in Prometheus every 5 seconds' },
          { k: 'If healthy', v: 'An operator advances the rollout to the next step' },
          { k: 'If it fails twice', v: 'Flag set back to 0% and an incident opened, with no one involved', accent: true }
        ]
      },
      shots: [
        { src: 'assets/img/projects/canaryshield-rollout.webp', w: 1440, h: 900, label: 'Rollout control center', alt: 'Rollout control center showing planned steps of 5, 10, 25, 50 and 100 percent, with roll back and kill switch controls.' },
        { src: 'assets/img/projects/canaryshield-overview.webp', w: 1440, h: 900, label: 'Release overview', alt: 'Release overview dashboard listing feature flags, open incidents and three automatic rollbacks.' },
        { src: 'assets/img/projects/canaryshield-chaos.webp', w: 1440, h: 900, label: 'Chaos testing', alt: 'Chaos testing page used to inject failures into the new payment flow.' }
      ],
      study: {
        solution:
          'The platform serves a new version to 5% of users, then 10, 25, 50 and 100%. At each step the guardian compares the canary\'s error rate against a threshold. If the canary stays above it for consecutive checks, the guardian sets the flag to 0% and opens an incident that records how much traffic and how many users were exposed and how long the rollback took.',
        architecture: [
          { k: 'Platform API', v: 'Go service that owns flags, rollout state, targeting and evaluation, and runs the guardian and the live event stream.' },
          { k: 'PostgreSQL', v: 'Source of truth for flags, rules, rollout events, incidents and the audit log. Every change is one transaction.' },
          { k: 'Redis', v: 'Compiled flag cache, change notifications over pub/sub, guardian health records and HyperLogLog exposure counts.' },
          { k: 'Prometheus', v: 'Scrapes the demo shop\'s payment metrics every 5 seconds; queried by the guardian and by the dashboard charts.' },
          { k: 'Demo shop and load generator', v: 'QuickCart, a shop whose checkout is released through CanaryShield, and a Go load generator that simulates shoppers.' }
        ],
        decisions: [
          { t: 'Deterministic bucketing', d: 'A user\'s bucket is sha256(flagKey:salt:userId) mod 10000. The same user always gets the same answer with no per-user storage, raising the percentage only adds users, and each flag has its own salt so the same users are not in every canary.' },
          { t: 'Evaluation without I/O', d: 'Requests are answered from an immutable in-memory snapshot behind an atomic pointer. Exposure tracking goes through a buffered queue flushed to Redis in the background, so it never slows a response.' },
          { t: 'Fail safe to stable', d: 'Every uncertain case serves the old version: an unknown, draft, killed or rolled-back flag, failed targeting, a missing user ID, or a platform that does not answer within 50 ms.' },
          { t: 'Never act on missing data', d: 'If Prometheus is down or returns nothing, the guardian skips the tick instead of rolling back.' },
          { t: 'No stale overwrites', d: 'The guardian\'s rollback only succeeds if the flag is still at the version it checked, so it cannot undo a newer human decision.' },
          { t: 'PostgreSQL is the truth, Redis is a cache', d: 'Everything in Redis can be rebuilt. If Redis goes down, instances keep serving their last snapshot and a reconciler repairs it.' }
        ],
        stack: [
          { k: 'Platform', v: ['Go 1.25', 'chi', 'pgx', 'go-redis', 'Prometheus client'] },
          { k: 'Data', v: ['PostgreSQL 16', 'Redis 7'] },
          { k: 'Dashboard and shop', v: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'TanStack Query', 'Recharts'] },
          { k: 'Demo server', v: ['Node.js', 'Express', 'prom-client'] },
          { k: 'Infrastructure', v: ['Docker Compose', 'Prometheus'] }
        ],
        outcome: [
          'A working end-to-end demo: start a rollout, inject failures into the canary, and the guardian rolls the flag back and opens an incident without anyone touching it.',
          'With a 5-second scrape and a 5-second tick, the architecture notes put detection and rollback at roughly 15 to 30 seconds.',
          'Bucketing, the rollout state machine, targeting operators and evaluation order are unit-tested in Go.',
          'Limits: one environment, a single shared admin token, and the guardian decides on error rate only. Latency is charted but not enforced.'
        ]
      }
    },

    {
      id: 'library-tracker',
      when: 'Mar – Apr 2026',
      index: '03',
      hue: 'teal',
      hot: 'rose',
      name: 'Personal Library Tracker',
      title: 'Full-stack reading platform with real-time social features and AI search',
      status: 'Live',
      summary:
        'Library Nest is a MERN application for tracking reading, with friends, a live activity feed and 1:1 chat over Socket.IO, Gemini-powered summaries and diary Q&A, and Razorpay subscriptions.',
      problem:
        'A reading tracker stops being CRUD once it has accounts, private journals, payments and live features. Each one brings a failure mode: stolen sessions, duplicate webhooks, leaked private entries.',
      built:
        'An Express API with Zod validation, RBAC and rate limiting, a React client, Socket.IO rooms for presence, activity and chat, cron jobs for reminders and digests, and a Docker, Nginx and GitHub Actions delivery path.',
      interesting:
        'Refresh tokens rotate on every use, and replaying a revoked one invalidates the whole token family. Razorpay webhooks are verified on the raw body and deduplicated by event ID. The diary sits behind a second PIN-verified boundary that also gates its RAG endpoint.',
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Gemini', 'Razorpay', 'Docker'],
      links: {
        github: 'https://github.com/satvikchauhan01/PersonalLibraryTracker',
        live: 'https://personal-library-tracker-lac.vercel.app'
      },
      figure: {
        type: 'layers',
        title: 'How a request moves through the app',
        caption: 'Top: the live sign-in screen. Below: the checks every request passes before it reaches the data. The highlighted PIN gate is a second lock that protects the diary.',
        studyCaption: 'The checks every request passes before it reaches the data, and what happens when a stolen refresh token is used again.',
        shot: {
          src: 'assets/img/projects/library-signin.webp',
          w: 1200, h: 750,
          label: 'Library Tracker · Sign in',
          alt: 'Sign-in screen of the deployed Personal Library Tracker, with email and password fields.'
        },
        stepsIn: 'study',
        layers: [
          { k: 'Client', items: ['React SPA', 'Socket.IO client', 'Access token held in memory'] },
          { k: 'API', chain: true, items: ['Helmet and CORS', 'Rate limit', 'Zod validation', 'JWT and RBAC', { t: 'Diary PIN gate', accent: true }, 'Controllers'] },
          { k: 'Data', items: ['MongoDB', 'Hashed refresh-token families', 'Embeddings stored on documents'] },
          { k: 'Services', items: ['Gemini', 'Razorpay', 'Cloudinary', 'Resend', 'Sentry'] }
        ],
        stepsLabel: 'What happens when a stolen login token is reused',
        steps: [
          { t: 'Login', d: 'Password checked with Argon2id' },
          { t: 'Tokens issued', d: '15-minute JWT, 30-day httpOnly cookie' },
          { t: 'Refresh', d: 'Old token revoked, new pair issued' },
          { t: 'Replay', d: 'A revoked token is presented again' },
          { t: 'Family revoked', d: 'Every session for that user ends', accent: true }
        ]
      },
      study: {
        solution:
          'Books move through a status lifecycle with page-level progress, session logs, streaks and a 365-day heatmap. On top of that sit a friends system with a live activity feed and 1:1 chat, a PIN-locked diary, Gemini features with a free-tier quota, and a paid tier billed through Razorpay subscriptions.',
        architecture: [
          { k: 'Client', v: 'React 18 with Tailwind CSS and Recharts. The access token is kept in memory and refreshed automatically.' },
          { k: 'API', v: 'Express (ESM) with Helmet, CORS, rate limiting, Zod validation, JWT auth with user and admin roles, and OpenAPI docs served by Swagger UI.' },
          { k: 'Real time', v: 'Socket.IO with a JWT handshake and per-user rooms. Activity events fan out only to confirmed friends; chat has typing indicators and read receipts.' },
          { k: 'Data', v: 'MongoDB with Mongoose. Compound unique indexes prevent duplicate books; refresh tokens are stored as SHA-256 hashes.' },
          { k: 'Jobs', v: 'node-cron reminders and a weekly digest sent through Resend.' },
          { k: 'Integrations', v: 'Gemini, Razorpay, Cloudinary, Resend, Sentry and the Google Books API.' }
        ],
        decisions: [
          { t: 'Token rotation with reuse detection', d: 'A 15-minute access token in memory and a 30-day httpOnly refresh cookie. Every refresh rotates the pair; replaying a revoked token invalidates every active token for that user.' },
          { t: 'Argon2id with a migration path', d: 'Passwords are hashed with Argon2id. Legacy bcrypt hashes are upgraded transparently on the next login.' },
          { t: 'The diary is its own security boundary', d: 'A 4 to 6 digit PIN with a separate salt and hash issues a time-bounded diary token. While locked, entries cannot be read, edited or used in AI queries; the API answers 423 Locked.' },
          { t: 'Idempotent payment webhooks', d: 'The HMAC SHA-256 signature is checked over the raw request body, and each Razorpay event ID is recorded so a repeated delivery is acknowledged but never processed twice.' },
          { t: 'Retrieval without a vector database', d: 'Gemini embeddings are stored on book and diary documents and ranked by cosine similarity in the application. This powers similar-book suggestions and "Ask your diary", which answers with the source entries cited.' },
          { t: 'Graceful degradation', d: 'Gemini, Razorpay, Cloudinary, Resend and Sentry are all optional. Without a key the affected routes return a clear 503 or validation error and the rest of the API keeps working.' },
          { t: 'Isolated tests', d: 'Backend tests run against mongodb-memory-server with no shared state. Playwright covers the critical path from registration to a subscription upgrade.' }
        ],
        stack: [
          { k: 'Frontend', v: ['React 18', 'React Router', 'Tailwind CSS', 'Recharts', 'Socket.IO client'] },
          { k: 'Backend', v: ['Node.js', 'Express', 'Mongoose', 'Zod', 'Socket.IO', 'node-cron'] },
          { k: 'Security', v: ['Argon2id', 'JWT', 'Helmet', 'express-rate-limit'] },
          { k: 'AI', v: ['Gemini API', 'Embeddings', 'RAG'] },
          { k: 'Services', v: ['Razorpay', 'Cloudinary', 'Resend', 'Sentry', 'Google Books API'] },
          { k: 'Testing', v: ['Vitest', 'Supertest', 'mongodb-memory-server', 'React Testing Library', 'Playwright'] },
          { k: 'Delivery', v: ['Docker Compose', 'Nginx', 'GitHub Actions', 'Vercel', 'Render'] }
        ],
        outcome: [
          'Deployed: the React client on Vercel and the API on Render.',
          'CI runs ESLint, the Vitest suite against an in-memory MongoDB and a production build on every push to main. Deployment triggers only after CI passes.'
        ]
      }
    },

    {
      id: 'fault-localization',
      when: 'Jul – Aug 2026',
      index: '04',
      hue: 'violet',
      hot: 'rose',
      name: 'Fault Localization Engine',
      title: 'Event-driven fault detection and localization for a power distribution grid',
      status: 'Simulated grid',
      summary:
        'Ingests pole-level telemetry, derives the state of every pole, and localizes an outage to the span, transformer or feeder that failed. It runs against a simulated network of about 4,000 poles.',
      problem:
        'Pole sensors report power loss one device at a time. Turning thousands of those reports into one answer, the span that failed, means handling duplicates, reordering, silent legacy devices and poles with no sensor at all.',
      built:
        'A Fastify API that writes telemetry to a PostgreSQL inbox and returns 202 immediately, a worker that claims rows with FOR UPDATE SKIP LOCKED and runs the pole-state machine and localization, and a React and Leaflet map for operators.',
      interesting:
        'Localization is pure functions over an in-memory topology, so it is tested without a database. Where topology records are missing, a degree-constrained minimum spanning tree infers them from GPS distance, and the confidence engine downgrades any incident that relies on inferred edges.',
      stack: ['Node.js', 'Fastify', 'PostgreSQL', 'Prisma', 'React', 'Leaflet', 'Docker Compose'],
      links: { github: 'https://github.com/satvikchauhan01/Fault_Localization_Engine' },
      figure: {
        type: 'topology',
        title: 'How a fault is located on the grid',
        caption: 'Green poles have power and red poles are dark. The fault is the first span where a live pole feeds a dark one. Below: the path each sensor reading takes to get there.',
        stepsLabel: 'Path of a sensor reading',
        steps: [
          { t: 'Telemetry', d: 'POST /telemetry, 202 Accepted' },
          { t: 'Inbox', d: 'PostgreSQL queue table' },
          { t: 'Worker', d: 'SKIP LOCKED, power_lost first' },
          { t: 'Pole state', d: '90 s debounce, 32 min timeout' },
          { t: 'Localization', d: 'Frontier, rollup, range', accent: true },
          { t: 'Incident', d: 'One outage, one ticket' },
          { t: 'Verification', d: 'Restoration confirmed by telemetry' }
        ]
      },
      study: {
        solution:
          'Sensors on poles post heartbeats and power events. The API validates each message and writes it to an inbox table, and does nothing else on that path. A worker drains the inbox and updates each pole\'s state. When a pole is confirmed dark it runs localization for that transformer\'s subtree and classifies the result as a span, transformer, feeder or range fault with a confidence level and reasons. Each outage maps to exactly one ticket. After a crew marks a ticket resolved, a verifier confirms from telemetry that every monitored pole is live again.',
        architecture: [
          { k: 'API', v: 'Fastify routes for telemetry ingestion, incidents, map data and tickets. Payloads are validated with shared Zod schemas.' },
          { k: 'Inbox', v: 'A PostgreSQL table used as the queue. Rows are claimed with FOR UPDATE SKIP LOCKED, power-loss events first, so a feeder-wide burst is processed ahead of routine heartbeats.' },
          { k: 'Worker', v: 'The ingestion loop, a 5-second sweeper for debounce completion and heartbeat timeouts, and a 15-second restoration verifier.' },
          { k: 'Localization', v: 'Pure functions: pole-state machine, frontier detection, transformer and feeder rollup at 90%, range expansion across unmonitored poles, and a confidence rules engine.' },
          { k: 'Topology', v: 'Recorded parent links where they exist; elsewhere inferred with a degree-constrained minimum spanning tree over haversine distances.' },
          { k: 'Dashboard', v: 'React and Leaflet: an incident list, the network map and a detail pane. Topology loads once; pole states and incidents are polled.' },
          { k: 'Simulator', v: 'Generates the synthetic network and injects faults through the real HTTP endpoint. The localization engine has no access to its ground truth.' }
        ],
        decisions: [
          { t: 'PostgreSQL as the queue', d: 'Ingestion is decoupled from processing without adding a broker. If the worker crashes mid-transaction the row stays pending and is retried. SKIP LOCKED means more workers can be added without code changes.' },
          { t: 'Pure-function localization', d: 'Frontier detection, rollups and range expansion take arrays and maps and return incidents. Only the orchestrator touches the database, which keeps the core logic unit-testable and free of lock contention.' },
          { t: 'Debounce and timeout as separate paths', d: 'An explicit power-loss event is confirmed after a 90-second debounce. Legacy firmware never sends one, so it is detected by 32 minutes of silence, and those incidents are marked low confidence.' },
          { t: 'Inferred topology with honest confidence', d: 'The spanning tree caps each pole at four children and flags an edge as ambiguous when another parent is within 15% of the chosen distance. Incidents that depend on inferred edges are downgraded to medium or low confidence.' },
          { t: 'One outage, one ticket', d: 'Incident sync runs under a transaction-scoped advisory lock and merges overlapping incidents into one survivor, so a fault that escalates from span to feeder never leaves duplicate tickets.' },
          { t: 'Silence only counts while listening', d: 'The sweeper tracks when the worker started listening, so a restart or a sleeping host does not time out the whole network at once.' }
        ],
        stack: [
          { k: 'Backend', v: ['Node.js', 'Fastify', 'Prisma', 'PostgreSQL 16', 'Zod'] },
          { k: 'Frontend', v: ['React 18', 'Vite', 'Tailwind CSS', 'react-leaflet'] },
          { k: 'Testing', v: ['Vitest', '270+ unit and integration tests'] },
          { k: 'Delivery', v: ['Docker Compose', 'Nginx'] }
        ],
        outcome: [
          'Ingestion benchmark on a local Docker stack: 500 requests per second sustained for 10 seconds with zero failures, and a 5,000-message burst accepted in 5.51 seconds (907 requests per second).',
          'That figure covers HTTP acceptance and the inbox insert. It does not include end-to-end time from telemetry to an incident on the dashboard.',
          'Limits: runs on synthetic data from the built-in simulator with a single worker process, and inferred topology can be wrong where lines do not follow straight-line distance.'
        ]
      }
    }
  ],

  /* ------------------------------------------------------------------ */
  /* Secondary projects: compact rows under the featured four.          */
  /* ------------------------------------------------------------------ */
  more: [
    {
      index: '05',
      hue: 'orange',
      shot: {
        src: 'assets/img/projects/hop-home.webp',
        w: 1280, h: 900,
        label: 'hop/ · Home',
        alt: 'Home page of the hop/ URL shortener: a single field to paste a long URL and a Shorten button.'
      },
      name: 'hop/',
      title: 'Serverless URL shortener',
      summary: 'Short links with custom aliases, expiry and click analytics, running entirely on Cloudflare Workers, D1 and Pages. Redirects answer before the click is recorded, and CI runs 171 Worker tests and 36 frontend tests on every push.',
      stack: ['Cloudflare Workers', 'Hono', 'D1', 'React', 'GitHub Actions'],
      links: {
        github: 'https://github.com/satvikchauhan01/Serverless-URL-Shortener',
        live: 'https://hop-frontend.pages.dev'
      }
    },
    {
      index: '06',
      hue: 'green',
      logos: ['Next.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
      name: 'MedAssist',
      title: 'Telemedicine appointment platform',
      summary: 'Appointment booking with doctor slot management, separate patient and doctor dashboards, Razorpay payments, email verification and a nearby-facilities map built on the Google Maps Places API.',
      stack: ['Next.js', 'TypeScript', 'NextAuth', 'MongoDB', 'Razorpay'],
      links: { github: 'https://github.com/satvikchauhan01/MedAssist' }
    }
  ],

  /* ------------------------------------------------------------------ */
  /* Experience. Add roles here; newest first.                          */
  /* ------------------------------------------------------------------ */
  experience: [
    // Fill this in and uncomment to show an internship. Leave nothing empty:
    // {
    //   org: 'Scaler AI Labs',
    //   role: '',            // exact title
    //   type: 'Internship',
    //   hue: 'orange',
    //   dates: '',           // e.g. 'Jul 2026 – Present'
    //   location: '',        // optional
    //   points: ['', '']     // 2 to 4 concrete contributions
    // },
    {
      org: 'Lovely Professional University',
      role: 'B.Tech, Computer Science and Engineering',
      type: 'Education',
      hue: 'blue',
      dates: 'Aug 2023 – May 2027 (expected)',
      location: 'Phagwara, Punjab',
      grade: 'CGPA 8.61',
      points: ['Final year of the programme.']
    },
    {
      org: 'CipherSchools',
      role: 'Full-stack development training',
      type: 'Training',
      hue: 'teal',
      dates: 'Jun 2025 – Jul 2025',
      location: '',
      points: [
        'Completed a 70-hour full-stack programme covering MongoDB, Express, React and Node.js.',
        'Built CRUD applications and REST APIs with authentication, routing and state management.'
      ]
    },
    {
      org: 'Nav Jeevan Mission School',
      role: 'Intermediate (Class XII)',
      type: 'Education',
      hue: 'violet',
      dates: 'Apr 2021 – Mar 2022',
      location: 'Deoria, Uttar Pradesh',
      grade: '83%',
      points: []
    },
    {
      org: 'Nav Jeevan Mission School',
      role: 'Matriculation (Class X)',
      type: 'Education',
      hue: 'amber',
      dates: 'Apr 2019 – Mar 2020',
      location: 'Deoria, Uttar Pradesh',
      grade: '96%',
      points: []
    }
  ],

  /* ------------------------------------------------------------------ */
  /* Skills. Only technologies used in the projects or on the resume.   */
  /* ------------------------------------------------------------------ */
  skills: [
    { k: 'Languages', hue: 'orange', v: ['JavaScript', 'TypeScript', 'Go', 'C++', 'Java', 'Python', 'C', 'SQL'] },
    { k: 'Backend', hue: 'blue', v: ['Node.js', 'Express', 'Fastify', 'REST APIs', 'WebSockets', 'Server-Sent Events', 'JWT', 'OAuth'] },
    { k: 'Frontend', hue: 'violet', v: ['React', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS'] },
    { k: 'Databases', hue: 'teal', v: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Prisma'] },
    { k: 'Cloud and DevOps', hue: 'amber', v: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Prometheus', 'Grafana', 'Cloudflare Workers'] },
    { k: 'AI', hue: 'rose', v: ['Gemini API', 'RAG', 'Embeddings', 'Vector search'] },
    { k: 'Testing and tools', hue: 'green', v: ['Vitest', 'Playwright', 'Supertest', 'Git', 'Linux'] }
  ],

  /* At-a-glance tiles in the About section. Every number is on the resume. */
  stats: [
    { n: '8.61', k: 'CGPA', d: 'B.Tech CSE, Lovely Professional University', hue: 'blue' },
    { n: '250+', k: 'DSA problems', d: 'Solved on LeetCode and GeeksforGeeks', hue: 'teal' },
    { n: '5\u2605', k: 'C++ on HackerRank', d: 'Gold badge, Sep 2025', hue: 'amber' },
    { n: '2nd', k: 'Code-Off Duty Hackathon', d: 'Runner-up, Apr 2025', hue: 'rose' }
  ],

  /* Each card shows `thumb`; clicking it opens the full `img` in the lightbox. */
  certificates: [
    { t: 'AWS Academy Cloud Foundations', by: 'AWS Academy', d: 'Apr 2025', img: 'assets/img/certs/cert-aws.png', thumb: 'assets/img/certs/thumb-aws.webp' },
    { t: 'Computational Theory: Language Principle and Finite Automata Theory', by: 'Infosys Springboard', d: 'Aug 2025', img: 'assets/img/certs/cert-infosys.png', thumb: 'assets/img/certs/thumb-infosys.webp' },
    { t: 'Full-Stack Development', by: 'CipherSchools', d: 'Jul 2025', img: 'assets/img/certs/cert-cipher.png', thumb: 'assets/img/certs/thumb-cipher.webp' },
    { t: 'The Bits and Bytes of Computer Networking', by: 'Google, via Coursera', d: 'Sep 2024', img: 'assets/img/certs/cert-google.png', thumb: 'assets/img/certs/thumb-google.webp' },
    { t: 'Introduction to Hardware and Operating Systems', by: 'IBM, via Coursera', d: 'Sep 2024', img: 'assets/img/certs/cert-ibm.png', thumb: 'assets/img/certs/thumb-ibm.webp' }
  ],

  /* Technology name -> logo file in assets/icons/. Names without an entry show a coloured dot. */
  logos: {
    'JavaScript': 'javascript', 'TypeScript': 'typescript', 'Go': 'go', 'Python': 'python', 'Java': 'java', 'C++': 'cplusplus', 'C': 'c',
    'Node.js': 'nodejs', 'Express': 'express', 'Fastify': 'fastify', 'WebSockets': 'socketio', 'Socket.IO': 'socketio',
    'React': 'react', 'Next.js': 'nextjs', 'Tailwind CSS': 'tailwindcss', 'HTML': 'html5', 'CSS': 'css3',
    'MongoDB': 'mongodb', 'Atlas Vector Search': 'mongodb', 'PostgreSQL': 'postgresql', 'MySQL': 'mysql', 'Redis': 'redis', 'Prisma': 'prisma',
    'AWS': 'aws', 'Docker': 'docker', 'Docker Compose': 'docker', 'Kubernetes': 'kubernetes',
    'GitHub Actions': 'githubactions', 'Prometheus': 'prometheus', 'Cloudflare Workers': 'cloudflareworkers',
    'Grafana': 'grafana', 'Loki': 'grafana', 'Tempo': 'grafana', 'OpenTelemetry': 'opentelemetry',
    'Vitest': 'vitest', 'Playwright': 'playwright', 'Git': 'git', 'Linux': 'linux'
  }
};
