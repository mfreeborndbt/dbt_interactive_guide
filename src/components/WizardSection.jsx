import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import CanvasSection from './CanvasSection'

/* ===================================================
   Design tokens (matches existing app)
   =================================================== */
const NAVY = '#111827'
const GREEN = '#059669'
const GREEN_LIGHT = '#f0fdf4'
const RED = '#dc2626'
const RED_LIGHT = '#fef2f2'
const BLUE = '#3b82f6'
const BLUE_LIGHT = '#eff6ff'
const AMBER = '#d97706'

const fadeSlide = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.3 },
}

/* ===================================================
   Tabs & descriptions
   =================================================== */
const topics = [
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'scope', label: 'Scope' },
  { key: 'tokens', label: 'Token efficiency' },
  { key: 'visual', label: 'Visual outputs' },
]

const topicDescs = {
  intelligence: 'dbt Wizard understands the right validation checks and always routes to the right tool. It self-validates before showing you anything.',
  scope: 'dbt Wizard can troubleshoot failed jobs and read from production after making changes, so it can confirm work will hold up in other environments.',
  tokens: "dbt's native metadata engine retrieves exactly what the agent needs before it writes a single line, so you get more accurate output while spending fewer tokens.",
  visual: 'With Wizard, the same model can be read as SQL or as a Canvas -- so anyone can understand what the logic does, not just people who read SQL.',
}

/* ===================================================
   Toggle (kept from original)
   =================================================== */
function Toggle({ value, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-xl p-1" role="radiogroup" aria-label="Comparison mode">
      <button
        role="radio"
        aria-checked={value === 'without'}
        onClick={() => onChange('without')}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          value === 'without' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Without dbt Wizard
      </button>
      <button
        role="radio"
        aria-checked={value === 'with'}
        onClick={() => onChange('with')}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          value === 'with' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        With dbt Wizard
      </button>
    </div>
  )
}

/* ===================================================
   Play button
   =================================================== */
function PlayButton({ playing, hasPlayed, onPlay }) {
  return (
    <button
      onClick={onPlay}
      disabled={playing}
      className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
        playing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
    >
      {playing ? 'Running...' : hasPlayed ? 'Run again' : 'Run simulation'}
    </button>
  )
}

/* ===================================================
   Shared animation helpers
   =================================================== */
function SectionLabel({ children }) {
  return <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{children}</p>
}

const STEP_DELAY = 1200
const STEP_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

function stepStyle(visible) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity 0.4s ${STEP_EASE}, transform 0.4s ${STEP_EASE}`,
  }
}

/* ===================================================
   SECTION 1 -- Intelligence
   =================================================== */

const INTEL_PROMPT = '"Add a not_null test to the customer_id column on stg_orders"'

/* --- Intelligence Simulator --- */
function IntelSimulator({ mode, runId, onDone }) {
  const [step, setStep] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const withSteps = [
    { type: 'action', label: 'Querying project metadata for stg_orders...' },
    { type: 'query', label: 'select * from stg_orders where customer_id is null limit 5' },
    {
      type: 'table',
      label: 'Results',
      rows: [
        { order_id: '10491', customer_id: 'NULL', order_date: '2024-03-11', amount: '42.00' },
        { order_id: '10517', customer_id: 'NULL', order_date: '2024-03-12', amount: '18.50' },
      ],
    },
    { type: 'bad-row', label: '2 null customer_id rows found in dev data. Fixing source before adding test.' },
    {
      type: 'sql',
      label: 'Fix SQL',
      code: "-- stg_orders.sql\nwhere customer_id is not null  -- filter bad source rows",
    },
    {
      type: 'yaml',
      label: 'YAML scaffold',
      code: 'models:\n  - name: stg_orders\n    columns:\n      - name: customer_id\n        tests:\n          - not_null',
      status: 'pending',
    },
    { type: 'confirm', label: 'Test values confirmed', values: ['not_null on customer_id'], color: 'green' },
    { type: 'action', label: 'dbt build --select stg_orders...' },
    { type: 'validate', label: 'All tests pass. 0 null rows remain.', pass: true },
    {
      type: 'takeaway',
      text: 'dbt Wizard checked the data first, found nulls, fixed the source filter, then added the test. The test passes on the first try.',
    },
  ]

  const withoutSteps = [
    { type: 'action', label: 'Reading stg_orders.sql...' },
    {
      type: 'yaml',
      label: 'YAML scaffold',
      code: 'models:\n  - name: stg_orders\n    columns:\n      - name: customer_id\n        tests:\n          - not_null',
      status: 'guessed',
    },
    { type: 'confirm', label: 'Guessed values (unverified)', values: ['not_null on customer_id'], color: 'amber' },
    { type: 'validate', label: 'FAILED: 2 rows with null customer_id', pass: false },
    {
      type: 'takeaway',
      text: 'Without project context or data access, the agent added the test without checking whether the data would pass. The test fails immediately.',
    },
  ]

  const steps = mode === 'with' ? withSteps : withoutSteps

  useEffect(() => {
    setStep(0)
    if (runId === 0) return
    let i = 0
    const iv = setInterval(() => {
      i += 1
      if (i >= steps.length) {
        clearInterval(iv)
        onDoneRef.current?.()
        return
      }
      setStep(i)
    }, STEP_DELAY)
    // show first step immediately
    setStep(0)
    return () => clearInterval(iv)
  }, [runId, mode, steps.length])

  if (runId === 0) {
    return <div className="py-8 text-center text-xs text-gray-300">Press "Run simulation" to begin</div>
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2">
      <SectionLabel>{mode === 'with' ? 'dbt Wizard' : 'Generic agent'}</SectionLabel>
      {steps.map((s, i) => {
        const visible = i <= step
        return (
          <div key={`${mode}-${i}`} style={stepStyle(visible)}>
            {s.type === 'action' && (
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                <span className="text-blue-500">{'>'}</span> {s.label}
              </div>
            )}
            {s.type === 'query' && (
              <div className="bg-gray-900 text-green-400 font-mono text-[10px] px-3 py-2 rounded-lg">
                {s.label}
              </div>
            )}
            {s.type === 'table' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-gray-50 text-left text-[9px] text-gray-400 uppercase tracking-wider">
                      {Object.keys(s.rows[0]).map((k) => (
                        <th key={k} className="px-2 py-1 font-semibold">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.rows.map((row, ri) => (
                      <tr key={ri} className="border-t border-gray-100">
                        {Object.entries(row).map(([k, v]) => (
                          <td
                            key={k}
                            className={`px-2 py-1 font-mono ${v === 'NULL' ? 'text-red-500 font-semibold' : 'text-gray-700'}`}
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {s.type === 'bad-row' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800 font-medium animate-pulse">
                <span>!</span> {s.label}
              </div>
            )}
            {s.type === 'sql' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-[10px] text-gray-700 whitespace-pre">
                {s.code}
              </div>
            )}
            {s.type === 'yaml' && (
              <div
                className={`border rounded-lg px-3 py-2 font-mono text-[10px] whitespace-pre ${
                  s.status === 'guessed'
                    ? 'bg-amber-50/50 border-amber-200 text-amber-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
                style={
                  s.status === 'pending'
                    ? { animation: 'pulse 2s ease-in-out infinite' }
                    : undefined
                }
              >
                {s.code}
              </div>
            )}
            {s.type === 'confirm' && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-medium border ${
                s.color === 'green'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <span>{s.color === 'green' ? '\u2713' : '?'}</span>
                <span>{s.label}: {s.values.join(', ')}</span>
              </div>
            )}
            {s.type === 'validate' && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold border ${
                s.pass
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
              style={!s.pass ? { animation: 'pulse 2s ease-in-out infinite' } : undefined}
              >
                <span>{s.pass ? '\u2713' : '\u2717'}</span>
                <span>{s.label}</span>
              </div>
            )}
            {s.type === 'takeaway' && (
              <div className="border-t border-gray-100 pt-3 mt-2">
                <p className="text-xs text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* --- Intelligence Content --- */
function IntelligenceContent({ mode, runId, onDone }) {
  return (
    <div>
      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-[10px] text-gray-400 font-medium mb-0.5">Prompt</p>
        <p className="text-xs text-gray-700 font-medium italic">{INTEL_PROMPT}</p>
      </div>
      <IntelSimulator mode={mode} runId={runId} onDone={onDone} />
    </div>
  )
}

/* ===================================================
   SECTION 2 -- Scope
   =================================================== */

const SCOPE_WITHOUT_POINTS = [
  'No concept of production. You cannot see what is running live or what the production data looks like.',
  'No visibility into failed jobs or tests. A broken run in another environment stays invisible until someone flags it.',
  'No way to know how a change behaves elsewhere. Passing in dev does not mean it passes in production.',
]

/* --- Scope "With" Simulator --- */
function ScopeSimulator({ scenario, runId, onDone }) {
  const [step, setStep] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const debugSteps = [
    { type: 'action', label: 'Fetching failed job run #4821...' },
    { type: 'error', label: 'Job #4821 FAILED -- 1 of 23 models errored' },
    { type: 'action', label: 'Identifying errored model...' },
    { type: 'detail', label: 'fct_order_items: ambiguous column reference "order_date"' },
    { type: 'action', label: 'Tracing root cause through lineage...' },
    { type: 'detail', label: 'order_date now exists in both stg_orders and stg_payments after recent join change' },
    { type: 'fix', before: 'select order_date', after: 'select orders.order_date' },
    {
      type: 'takeaway',
      text: 'dbt Wizard detected the failure, pinpointed the ambiguous column, traced the root cause through lineage, and proposed a qualified fix. No one had to report the problem.',
    },
  ]

  const refactorSteps = [
    { type: 'action', label: 'Refactoring int_accounts: moving customer_status from CASE to source...' },
    { type: 'action', label: 'dbt parse passed. Compiling int_accounts...' },
    { type: 'action', label: 'Compiled successfully. Running dbt compare...' },
    { type: 'compare', label: 'Row count', prod: '48,210', dev: '48,210', match: true },
    {
      type: 'compare-table',
      rows: [
        { status: 'active', prod: '31,402', dev: '31,402' },
        { status: 'prospect', prod: '12,118', dev: '12,118' },
        { status: 'churned', prod: '4,690', dev: '4,690' },
      ],
    },
    { type: 'detail', label: 'Mismatch: 0 rows. customer_status values match across environments.' },
    { type: 'action', label: 'Running downstream tests...' },
    { type: 'validate', label: 'All 6 downstream tests pass', pass: true },
    { type: 'action', label: 'Re-comparing with production after downstream builds...' },
    {
      type: 'takeaway',
      text: 'dbt Wizard compared dev output against the last production run, confirmed row counts and column values match, and validated downstream tests. The refactor is safe to ship.',
    },
  ]

  const steps = scenario === 'debug' ? debugSteps : refactorSteps

  useEffect(() => {
    setStep(0)
    if (runId === 0) return
    let i = 0
    const iv = setInterval(() => {
      i += 1
      if (i >= steps.length) {
        clearInterval(iv)
        onDoneRef.current?.()
        return
      }
      setStep(i)
    }, STEP_DELAY)
    setStep(0)
    return () => clearInterval(iv)
  }, [runId, scenario, steps.length])

  if (runId === 0) {
    return <div className="py-8 text-center text-xs text-gray-300">Press "Run simulation" to begin</div>
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2">
      <SectionLabel>dbt Wizard</SectionLabel>
      {steps.map((s, i) => {
        const visible = i <= step
        return (
          <div key={`with-${scenario}-${i}`} style={stepStyle(visible)}>
            {s.type === 'action' && (
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                <span className="text-blue-500">{'>'}</span> {s.label}
              </div>
            )}
            {s.type === 'error' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-700 font-semibold animate-pulse">
                <span>{'\u2717'}</span> {s.label}
              </div>
            )}
            {s.type === 'detail' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-800 font-medium">
                <span>!</span> {s.label}
              </div>
            )}
            {s.type === 'fix' && (
              <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono text-[10px] space-y-0.5">
                <div className="text-red-600 bg-red-50 px-1 rounded">- {s.before}</div>
                <div className="text-green-700 bg-green-50 px-1 rounded">+ {s.after}</div>
              </div>
            )}
            {s.type === 'compare' && (
              <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg text-[10px]">
                <span className="text-gray-500 font-medium">{s.label}:</span>
                <span className="font-medium text-gray-700">Prod {s.prod}</span>
                <span className="text-gray-300">|</span>
                <span className="font-medium text-gray-700">Dev {s.dev}</span>
                {s.match && (
                  <span className="text-green-600 font-semibold text-[9px] bg-green-50 px-1.5 py-0.5 rounded">Match</span>
                )}
              </div>
            )}
            {s.type === 'compare-table' && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-gray-50 text-left text-[9px] text-gray-400 uppercase tracking-wider">
                      <th className="px-2 py-1 font-semibold">Status</th>
                      <th className="px-2 py-1 font-semibold text-right">Prod</th>
                      <th className="px-2 py-1 font-semibold text-right">Dev</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {s.rows.map((r) => (
                      <tr key={r.status} className="border-t border-gray-100">
                        <td className="px-2 py-1 font-mono">{r.status}</td>
                        <td className="px-2 py-1 text-right">{r.prod}</td>
                        <td className="px-2 py-1 text-right">{r.dev}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {s.type === 'validate' && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold border ${
                s.pass ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <span>{s.pass ? '\u2713' : '\u2717'}</span> {s.label}
              </div>
            )}
            {s.type === 'takeaway' && (
              <div className="border-t border-gray-100 pt-3 mt-2">
                <p className="text-xs text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* --- Scope "Without" Simulator --- */
function ScopeWithoutSimulator({ scenario, runId, onDone }) {
  const [step, setStep] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const debugSteps = [
    { type: 'action', label: 'Reading fct_order_items.sql...' },
    { type: 'action', label: 'SQL looks correct locally. No errors found.' },
    { type: 'action', label: 'Attempting to compile... (no warehouse connection)' },
    { type: 'detail', label: 'Cannot access production metadata or run results' },
    {
      type: 'takeaway',
      text: 'The generic agent cannot see the failed job, cannot access run logs, and has no lineage context. Someone has to manually investigate the failure and paste error messages into the chat.',
    },
  ]

  const refactorSteps = [
    { type: 'action', label: 'Editing int_accounts.sql: swapping CASE for source column...' },
    { type: 'action', label: 'SQL looks correct syntactically.' },
    { type: 'action', label: 'Cannot run dbt compare (no production access).' },
    { type: 'detail', label: 'No way to verify output matches production' },
    { type: 'action', label: 'Suggesting: "You should test this manually."' },
    { type: 'action', label: 'Cannot check downstream models (no lineage graph).' },
    {
      type: 'slack',
      from: 'Maya (Finance)',
      text: 'Hey, the customer_status numbers in our dashboard look different today. Did something change?',
    },
  ]

  const steps = scenario === 'debug' ? debugSteps : refactorSteps

  useEffect(() => {
    setStep(0)
    if (runId === 0) return
    let i = 0
    const iv = setInterval(() => {
      i += 1
      if (i >= steps.length) {
        clearInterval(iv)
        onDoneRef.current?.()
        return
      }
      setStep(i)
    }, STEP_DELAY)
    setStep(0)
    return () => clearInterval(iv)
  }, [runId, scenario, steps.length])

  if (runId === 0) {
    return <div className="py-8 text-center text-xs text-gray-300">Press "Run simulation" to begin</div>
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2">
      <SectionLabel>Generic agent</SectionLabel>
      {steps.map((s, i) => {
        const visible = i <= step
        return (
          <div key={`without-${scenario}-${i}`} style={stepStyle(visible)}>
            {s.type === 'action' && (
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                <span className="text-gray-400">{'>'}</span> {s.label}
              </div>
            )}
            {s.type === 'detail' && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-700 font-medium">
                <span>{'\u2717'}</span> {s.label}
              </div>
            )}
            {s.type === 'slack' && (
              <div className="border border-amber-200 bg-amber-50 rounded-lg px-3 py-2 mt-1">
                <p className="text-[9px] text-amber-500 font-semibold mb-1">Slack message</p>
                <p className="text-[10px] text-gray-700">
                  <span className="font-semibold">{s.from}:</span> {s.text}
                </p>
              </div>
            )}
            {s.type === 'takeaway' && (
              <div className="border-t border-gray-100 pt-3 mt-2">
                <p className="text-xs text-gray-600 leading-relaxed">{s.text}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const SCOPE_SCENARIOS = [
  { key: 'debug', label: 'Debug a failed job' },
  { key: 'refactor', label: 'Refactor and compare' },
]

const SCOPE_PROMPTS = {
  debug: '"Job #4821 failed overnight. What went wrong and can you fix it?"',
  refactor: '"Refactor int_accounts to pull customer_status from the source instead of deriving it. Make sure nothing breaks."',
}

/* --- Scope Content --- */
function ScopeContent({ mode, runId, onDone }) {
  const [scenario, setScenario] = useState('debug')

  // Reset scenario state on mode change
  const prevModeRef = useRef(mode)
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode
    }
  }, [mode])

  return (
    <div>
      {/* Scenario toggle */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-gray-400 font-medium">Scenario:</span>
        <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
          {SCOPE_SCENARIOS.map((sc) => (
            <button
              key={sc.key}
              onClick={() => setScenario(sc.key)}
              className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${
                scenario === sc.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-[10px] text-gray-400 font-medium mb-0.5">Prompt</p>
        <p className="text-xs text-gray-700 font-medium italic">{SCOPE_PROMPTS[scenario]}</p>
      </div>

      {/* Simulator */}
      {mode === 'with' ? (
        <ScopeSimulator scenario={scenario} runId={runId} onDone={onDone} />
      ) : (
        <ScopeWithoutSimulator scenario={scenario} runId={runId} onDone={onDone} />
      )}
    </div>
  )
}

/* ===================================================
   SECTION 3 -- Token efficiency
   =================================================== */

const GENERIC_STEPS = [
  { action: 'read', file: 'dbt_project.yml' },
  { action: 'read', file: 'models/schema.yml' },
  { action: 'read', file: 'models/stg_orders.sql' },
  { action: 'read', file: 'models/stg_customers.sql' },
  { action: 'read', file: 'models/stg_payments.sql' },
  { action: 'grep', file: '"churn" across 47 files -- 0 results' },
  { action: 'read', file: 'models/stg_subscriptions.sql' },
  { action: 'read', file: 'models/stg_invoices.sql' },
  { action: 'read', file: 'models/int_enriched.sql' },
  { action: 'read', file: 'models/int_customer_orders.sql' },
  { action: 'compile', file: 'int_customer_orders.sql -- checking refs...' },
  { action: 'read', file: 'models/fct_orders.sql' },
  { action: 'read', file: 'models/fct_revenue.sql' },
  { action: 'read', file: 'models/fct_subscriptions.sql' },
  { action: 'grep', file: '"segment" across 47 files -- 3 results' },
  { action: 'read', file: 'models/dim_products.sql' },
  { action: 'read', file: 'models/dim_customers.sql' },
  { action: 'read', file: 'models/dim_dates.sql' },
  { action: 'read', file: 'models/dim_regions.sql' },
  { action: 'read', file: 'tests/schema.yml' },
  { action: 'read', file: 'tests/fct_orders_tests.yml' },
  { action: 'read', file: 'tests/int_enriched_tests.yml' },
  { action: 'compile', file: 'fct_subscriptions.sql -- resolving columns...' },
  { action: 'read', file: 'macros/utils.sql' },
  { action: 'read', file: 'macros/date_spine.sql' },
  { action: 'read', file: 'macros/churn_logic.sql' },
  { action: 'compile', file: 'draft query -- syntax check...' },
  { action: 'error', file: 'column "customer_segment" not found -- retrying' },
  { action: 'read', file: 'models/dim_customers.sql (re-read)' },
  { action: 'grep', file: '"customer_segment" across 47 files -- 1 result' },
  { action: 'read', file: 'snapshots/scd_customers.sql' },
  { action: 'read', file: 'models/dim_channels.sql' },
  { action: 'compile', file: 'draft query v2 -- syntax check...' },
  { action: 'read', file: 'packages.yml' },
  { action: 'read', file: 'models/marts/fct_churn.sql' },
  { action: 'compile', file: 'final query -- validating...' },
]

const METADATA_RESULTS = [
  {
    label: 'Source models',
    detail: 'stg_orders, stg_customers, stg_subscriptions, dim_regions',
    role: 'Identifies every upstream model the new query needs to reference',
  },
  {
    label: 'Grain',
    detail: 'customer_id + month (calendar_spine)',
    role: 'Sets the correct aggregation level so churn is computed per customer per month',
  },
  {
    label: 'Join path',
    detail: 'stg_orders -> stg_customers -> dim_regions (via region_id)',
    role: 'Determines the shortest valid join path so no extra tables are pulled in',
  },
  {
    label: 'Freshness & tests',
    detail: 'All sources fresh. 4 not_null, 2 unique, 1 accepted_values test defined',
    role: 'Confirms data is current and existing test coverage before generating new SQL',
  },
]

const METADATA_TABLES = [
  { id: 'stg_orders', x: 20, y: 10 },
  { id: 'stg_customers', x: 20, y: 55 },
  { id: 'stg_subscriptions', x: 20, y: 100 },
  { id: 'dim_regions', x: 180, y: 55 },
  { id: 'fct_churn', x: 320, y: 55 },
]

function MetadataGraph() {
  const edges = [
    ['stg_orders', 'fct_churn'],
    ['stg_customers', 'dim_regions'],
    ['stg_customers', 'fct_churn'],
    ['stg_subscriptions', 'fct_churn'],
    ['dim_regions', 'fct_churn'],
  ]

  const nodeW = 130
  const nodeH = 22

  function nodeCenter(id) {
    const n = METADATA_TABLES.find((t) => t.id === id)
    return { x: n.x + nodeW / 2, y: n.y + nodeH / 2 }
  }

  return (
    <svg viewBox="0 0 470 130" className="w-full" style={{ maxHeight: 100 }}>
      {edges.map(([from, to]) => {
        const a = nodeCenter(from)
        const b = nodeCenter(to)
        const mx = (a.x + b.x) / 2
        return (
          <path
            key={`${from}-${to}`}
            d={`M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`}
            stroke="#d1d5db"
            strokeWidth="1.2"
            fill="none"
          />
        )
      })}
      {METADATA_TABLES.map((n) => (
        <g key={n.id}>
          <rect x={n.x} y={n.y} width={nodeW} height={nodeH} rx="4" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" />
          <text x={n.x + nodeW / 2} y={n.y + nodeH / 2 + 4} textAnchor="middle" fontSize="9" fill="#374151" fontFamily="monospace">
            {n.id}
          </text>
        </g>
      ))}
    </svg>
  )
}

const TOKEN_PROMPT = '"Can you build a model with monthly churn rate by customer segment, broken down by region"'

function TokenUsage({ mode, runId, onDone }) {
  const prefersReduced = useReducedMotion()
  const [visibleFiles, setVisibleFiles] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showExplainer, setShowExplainer] = useState(false)
  const [pulseExplainer, setPulseExplainer] = useState(false)
  const scrollRef = useRef(null)
  const timeoutsRef = useRef([])
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setVisibleFiles(0)
    setShowResult(false)
    setShowExplainer(false)
    setPulseExplainer(false)

    if (runId === 0) return

    if (mode === 'without') {
      const fileDelay = prefersReduced ? 0 : 180
      GENERIC_STEPS.forEach((_, i) => {
        const t = setTimeout(() => {
          setVisibleFiles(i + 1)
          if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }, fileDelay * (i + 1))
        timeoutsRef.current.push(t)
      })
      const resultT = setTimeout(() => {
        setShowResult(true)
        onDoneRef.current?.()
      }, fileDelay * (GENERIC_STEPS.length + 1) + 800)
      timeoutsRef.current.push(resultT)
    } else {
      const lookupDelay = prefersReduced ? 0 : 250
      METADATA_RESULTS.forEach((_, i) => {
        const t = setTimeout(() => setVisibleFiles(i + 1), lookupDelay * (i + 1))
        timeoutsRef.current.push(t)
      })
      const resultT = setTimeout(() => {
        setShowResult(true)
        setPulseExplainer(true)
        onDoneRef.current?.()
      }, lookupDelay * (METADATA_RESULTS.length + 1) + 400)
      timeoutsRef.current.push(resultT)
      // Stop pulse after a few seconds
      const pulseT = setTimeout(() => setPulseExplainer(false), lookupDelay * (METADATA_RESULTS.length + 1) + 3400)
      timeoutsRef.current.push(pulseT)
    }

    return () => timeoutsRef.current.forEach(clearTimeout)
  }, [runId, mode, prefersReduced])

  const hasContent = runId > 0

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <SectionLabel>Token usage</SectionLabel>

      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-[10px] text-gray-400 font-medium mb-0.5">Prompt</p>
        <p className="text-xs text-gray-700 font-medium italic">{TOKEN_PROMPT}</p>
      </div>

      {!hasContent ? (
        <div className="py-4 text-center text-xs text-gray-300">Press &quot;Run simulation&quot; to see how tokens are consumed</div>
      ) : (
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">
            {mode === 'without' ? 'Generic agent' : 'dbt Wizard'}
          </p>
          <p className="text-[10px] text-gray-400 mb-2">
            {mode === 'without'
              ? 'Reads files one by one to reconstruct context'
              : 'Queries the native metadata engine in a single call'}
          </p>
          <div
            ref={scrollRef}
            className={`space-y-1 overflow-y-auto ${mode === 'without' ? 'max-h-56' : ''} mb-4`}
          >
            {mode === 'without' ? (
              GENERIC_STEPS.slice(0, visibleFiles).map((step, i) => {
                const actionColor =
                  step.action === 'read' ? 'text-red-400' :
                  step.action === 'grep' ? 'text-amber-500' :
                  step.action === 'compile' ? 'text-blue-500' :
                  step.action === 'error' ? 'text-red-600 font-semibold' :
                  'text-gray-400'
                return (
                  <div key={`${step.action}-${i}`} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                    <span className={`shrink-0 ${actionColor}`}>{step.action}</span>
                    <span className={`truncate ${step.action === 'error' ? 'text-red-500' : ''}`}>{step.file}</span>
                  </div>
                )
              })
            ) : (
              METADATA_RESULTS.slice(0, visibleFiles).map((item) => (
                <div key={item.label} className="flex items-start gap-1.5 text-[10px] py-1">
                  <span className="text-green-500 text-xs font-bold mt-0.5 shrink-0">{'\u2713'}</span>
                  <div>
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className="text-gray-400 ml-1.5">{item.detail}</span>
                    <p className="text-[9px] text-gray-400 italic">{item.role}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] text-gray-400 font-medium">Tokens consumed</p>
                <p className={`text-lg font-bold tabular-nums ${mode === 'without' ? 'text-red-600' : 'text-green-700'}`}>
                  {mode === 'without' ? '~48k' : '~3.2k'}
                </p>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                <motion.div
                  className={`h-full rounded-full ${mode === 'without' ? 'bg-red-400' : 'bg-green-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: mode === 'without' ? '100%' : '6.7%' }}
                  transition={{ duration: prefersReduced ? 0 : 0.8, ease: 'easeOut' }}
                />
              </div>
              {mode === 'without' ? (
                <div className="border border-red-200 bg-red-50/50 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-red-700 font-semibold">~48k tokens to get context</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="border border-green-200 bg-green-50/50 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-green-800 font-semibold">~3.2k tokens -- 93% fewer</p>
                      </div>
                      <p className="text-[10px] font-semibold text-green-700">Cheaper and more accurate</p>
                    </div>
                  </div>

                  {/* See how this works button */}
                  <button
                    onClick={() => setShowExplainer((v) => !v)}
                    className={`text-[10px] font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                      showExplainer
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : pulseExplainer
                          ? 'bg-green-50 border-green-300 text-green-700 animate-pulse'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {showExplainer ? 'Hide details' : 'See how this works'}
                  </button>

                  {showExplainer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border border-gray-200 rounded-lg p-3 space-y-3">
                        <div>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Metadata graph (relevant subset)</p>
                          <MetadataGraph />
                        </div>
                        <p className="text-[10px] text-gray-600 leading-relaxed">
                          Instead of reading every file, dbt Wizard queries the project metadata graph for the models, grain, join paths, and test coverage relevant to the prompt. The metadata engine returns structured results, not raw file contents, so the context window stays small and precise.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

function TokenContent({ mode, runId, onDone }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`tokens-${mode}`} {...fadeSlide}>
        <TokenUsage mode={mode} runId={runId} onDone={onDone} />
      </motion.div>
    </AnimatePresence>
  )
}

/* ===================================================
   SECTION 4 -- Visual outputs
   =================================================== */

const VISUAL_PROMPT = '"Create a model called fct_customer_orders that shows total spend and order count per customer for completed orders. Add a lifetime_value column as total spend times 1.2."'

function OutputSqlPane() {
  const KW = 'text-blue-600'
  const FN = 'text-purple-600'
  const STR = 'text-emerald-600'
  const CMT = 'text-gray-400'
  const TXT = 'text-gray-800'
  const JJ = 'text-orange-600'
  return (
    <div className="p-4 font-mono text-xs leading-relaxed">
      <div><span className={CMT}>-- fct_customer_orders.sql</span></div>
      <div><span className={JJ}>{'{{ '}</span><span className={FN}>config</span>(<span className={FN}>materialized</span>=<span className={STR}>&apos;table&apos;</span>)<span className={JJ}>{' }}'}</span></div>
      <div className="h-2" />
      <div><span className={KW}>select</span></div>
      <div><span className={TXT}>    o.customer_id,</span></div>
      <div><span className={KW}>    sum</span><span className={TXT}>(o.amount) </span><span className={KW}>as</span><span className={TXT}> total_spend,</span></div>
      <div><span className={KW}>    count</span><span className={TXT}>(o.order_id) </span><span className={KW}>as</span><span className={TXT}> order_count,</span></div>
      <div><span className={KW}>    sum</span><span className={TXT}>(o.amount) * </span><span className={STR}>1.2</span><span className={TXT}> </span><span className={KW}>as</span><span className={TXT}> lifetime_value</span></div>
      <div className="h-2" />
      <div><span className={KW}>from</span> <span className={JJ}>{'{{ '}</span><span className={FN}>ref</span>(<span className={STR}>&apos;stg_orders&apos;</span>)<span className={JJ}>{' }}'}</span><span className={TXT}> o</span></div>
      <div><span className={KW}>left join</span> <span className={JJ}>{'{{ '}</span><span className={FN}>ref</span>(<span className={STR}>&apos;stg_customers&apos;</span>)<span className={JJ}>{' }}'}</span><span className={TXT}> c</span></div>
      <div><span className={TXT}>    </span><span className={KW}>on</span><span className={TXT}> o.customer_id = c.customer_id</span></div>
      <div className="h-2" />
      <div><span className={KW}>where</span><span className={TXT}> o.status = </span><span className={STR}>&apos;completed&apos;</span></div>
      <div className="h-2" />
      <div><span className={KW}>group by</span><span className={TXT}> o.customer_id</span></div>
    </div>
  )
}

/* --- Visual Simulator --- */
function VisualSimulator({ mode, runId, onDone }) {
  const [step, setStep] = useState(0)
  const [outputView, setOutputView] = useState('sql')
  const [pulseToggle, setPulseToggle] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const steps = [
    { type: 'action', label: mode === 'with' ? 'Generating fct_customer_orders with project context...' : 'Generating fct_customer_orders from prompt...' },
    { type: 'output', label: 'Output ready' },
    {
      type: 'takeaway',
      text: mode === 'with'
        ? 'dbt Wizard generates the SQL and also lets you view the same model as a Canvas, so non-SQL users can read and understand the logic.'
        : 'A generic agent outputs SQL, but there is no visual representation. Team members who do not read SQL cannot verify the logic.',
    },
  ]

  useEffect(() => {
    setStep(0)
    setOutputView('sql')
    setPulseToggle(false)
    if (runId === 0) return
    let i = 0
    const iv = setInterval(() => {
      i += 1
      if (i >= steps.length) {
        clearInterval(iv)
        if (mode === 'with') {
          setPulseToggle(true)
          setTimeout(() => setPulseToggle(false), 3000)
        }
        onDoneRef.current?.()
        return
      }
      setStep(i)
    }, STEP_DELAY)
    setStep(0)
    return () => clearInterval(iv)
  }, [runId, mode, steps.length])

  if (runId === 0) {
    return <div className="py-8 text-center text-xs text-gray-300">Press "Run simulation" to begin</div>
  }

  return (
    <div className="space-y-2">
      {/* Step 0: action */}
      <div style={stepStyle(step >= 0)}>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
          <span className="text-blue-500">{'>'}</span> {steps[0].label}
        </div>
      </div>

      {/* Step 1: output panel */}
      <div style={stepStyle(step >= 1)}>
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Output</span>
              <span className="text-xs font-mono font-semibold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">fct_customer_orders.sql</span>
            </div>
            {mode === 'with' && (
              <div className={`inline-flex bg-gray-100 rounded-lg p-0.5 ${pulseToggle ? 'ring-2 ring-green-400 ring-opacity-60 animate-pulse' : ''}`}>
                <button
                  onClick={() => setOutputView('sql')}
                  className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${
                    outputView === 'sql' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  SQL
                </button>
                <button
                  onClick={() => { setOutputView('canvas'); setPulseToggle(false) }}
                  className={`px-3 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${
                    outputView === 'canvas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Canvas
                </button>
              </div>
            )}
          </div>
          <AnimatePresence mode="wait">
            {(mode === 'without' || outputView === 'sql') ? (
              <motion.div key="sql-out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <OutputSqlPane />
              </motion.div>
            ) : (
              <motion.div key="canvas-out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="p-4">
                <CanvasSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Step 2: takeaway */}
      <div style={stepStyle(step >= 2)}>
        <div className="border-t border-gray-100 pt-3 mt-2">
          <p className="text-xs text-gray-600 leading-relaxed">{steps[2].text}</p>
        </div>
      </div>
    </div>
  )
}

/* --- Visual Outputs Content --- */
function VisualOutputsContent({ mode, runId, onDone }) {
  return (
    <div>
      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
        <p className="text-[10px] text-gray-400 font-medium mb-0.5">Prompt</p>
        <p className="text-xs text-gray-700 font-medium italic">{VISUAL_PROMPT}</p>
      </div>
      <VisualSimulator mode={mode} runId={runId} onDone={onDone} />
    </div>
  )
}

/* ===================================================
   Main export
   =================================================== */
export default function WizardSection() {
  const [activeTopic, setActiveTopic] = useState('intelligence')
  const [mode, setMode] = useState('without')
  const [playing, setPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [runId, setRunId] = useState(0)

  // Reset playing state when tab or mode changes
  const handleTopicChange = (key) => {
    setActiveTopic(key)
    setMode('without')
    setPlaying(false)
    setHasPlayed(false)
    setRunId(0)
  }
  const handleModeChange = (m) => {
    setMode(m)
    setPlaying(false)
    setHasPlayed(false)
    setRunId(0)
  }
  const handlePlay = () => {
    setRunId((r) => r + 1)
    setPlaying(true)
    setHasPlayed(true)
  }
  const handleDone = () => {
    setPlaying(false)
  }

  return (
    <div>
      {/* Topic tabs + toggle + play button */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="inline-flex bg-gray-100 rounded-xl p-1" role="tablist" aria-label="Wizard comparison topics">
          {topics.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTopic === t.key}
              aria-controls={`panel-${t.key}`}
              onClick={() => handleTopicChange(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTopic === t.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Toggle value={mode} onChange={handleModeChange} />
          <PlayButton playing={playing} hasPlayed={hasPlayed} onPlay={handlePlay} />
        </div>
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={activeTopic}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="text-sm text-gray-500 mb-5"
        >
          {topicDescs[activeTopic]}
        </motion.p>
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTopic === 'intelligence' && (
          <motion.div key="intelligence" id="panel-intelligence" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <IntelligenceContent mode={mode} runId={runId} onDone={handleDone} />
          </motion.div>
        )}
        {activeTopic === 'scope' && (
          <motion.div key="scope" id="panel-scope" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <ScopeContent mode={mode} runId={runId} onDone={handleDone} />
          </motion.div>
        )}
        {activeTopic === 'tokens' && (
          <motion.div key="tokens" id="panel-tokens" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <TokenContent mode={mode} runId={runId} onDone={handleDone} />
          </motion.div>
        )}
        {activeTopic === 'visual' && (
          <motion.div key="visual" id="panel-visual" role="tabpanel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <VisualOutputsContent mode={mode} runId={runId} onDone={handleDone} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
