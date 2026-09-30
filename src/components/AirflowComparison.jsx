import { useState } from 'react'

const Kw = ({ children }) => <span className="text-blue-700 font-semibold">{children}</span>
const St = ({ children }) => <span className="text-green-700">{children}</span>
const Cm = ({ children }) => <span className="text-gray-400">{children}</span>
const Fn = ({ children }) => <span className="text-amber-700">{children}</span>
const Op = ({ children }) => <span className="text-purple-700">{children}</span>
const Hl = ({ children }) => <span className="bg-emerald-100/70 rounded-sm">{children}</span>
const Rl = ({ children }) => <span className="bg-red-100/70 rounded-sm">{children}</span>

function Legend() {
  return (
    <div className="flex items-center gap-4 text-[10px] text-gray-500">
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-sm bg-emerald-100/70 border border-emerald-200" />
        Transformation logic
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-sm bg-red-100/70 border border-red-200" />
        Orchestration logic
      </div>
    </div>
  )
}

function ViewToggle({ options, active, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
      {options.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
            active === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >{t.label}</button>
      ))}
    </div>
  )
}

export function AirflowOnly() {
  const [view, setView] = useState('script')
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <ViewToggle options={[{ key: 'script', label: 'Script' }, { key: 'dag', label: 'DAG view' }]} active={view} onChange={setView} />
        {view === 'script' && <Legend />}
      </div>

      {view === 'script' ? (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-[10.5px] leading-[1.6] overflow-y-auto max-h-[420px]">
        <pre className="text-gray-700">
<Kw>from</Kw> airflow <Kw>import</Kw> DAG{'\n'}
<Kw>from</Kw> airflow.providers.snowflake.operators.snowflake <Kw>import</Kw> SnowflakeOperator{'\n'}
<Kw>from</Kw> airflow.providers.http.operators.http <Kw>import</Kw> SimpleHttpOperator{'\n'}
<Kw>from</Kw> datetime <Kw>import</Kw> datetime{'\n'}
{'\n'}
<Kw>with</Kw> <Fn>DAG</Fn>(<St>'ecommerce_pipeline'</St>, start_date=<Fn>datetime</Fn>(<Op>2024</Op>,<Op>1</Op>,<Op>1</Op>), schedule=<St>'@daily'</St>, catchup=<Op>False</Op>) <Kw>as</Kw> dag:{'\n'}
{'\n'}
    <Cm># ── Step 1: Extract & load ─────────────────────────</Cm>{'\n'}
    extract_data = <Fn>SimpleHttpOperator</Fn>({'\n'}
        task_id=<St>'extract_data'</St>,{'\n'}
        http_conn_id=<St>'airbyte'</St>,{'\n'}
        endpoint=<St>'/api/v1/connections/sync'</St>,{'\n'}
        method=<St>'POST'</St>,{'\n'}
        headers={'{'}<St>'Authorization'</St>: <St>'Bearer '</St> + Variable.get(<St>'airbyte_key'</St>){'}'},{'\n'}
        data=<St>'{"{"}\"connectionId\": \"conn-abc123\"{"}"}'</St>,{'\n'}
    ){'\n'}
{'\n'}
    load_data = <Fn>SimpleHttpOperator</Fn>({'\n'}
        task_id=<St>'load_data'</St>,{'\n'}
        http_conn_id=<St>'airbyte'</St>,{'\n'}
        endpoint=<St>'/api/v1/jobs/get'</St>,{'\n'}
        response_check=<Kw>lambda</Kw> r: r.json()[<St>'status'</St>] == <St>'succeeded'</St>,{'\n'}
    ){'\n'}
{'\n'}
    <Hl><Cm># ── Step 2: 15 SQL transformations ─────────────────</Cm></Hl>{'\n'}
{'\n'}
    <Hl><Cm># ── Staging (4) ────────────────────────────────────</Cm></Hl>{'\n'}
    <Hl>stg_orders = <Fn>SnowflakeOperator</Fn>(task_id=<St>'stg_orders'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.stg_orders AS</St></Hl>{'\n'}
<Hl><St>        SELECT id AS order_id, user_id AS customer_id, order_date, status</St></Hl>{'\n'}
<Hl><St>        FROM raw.orders WHERE order_date {'>'} CURRENT_DATE - 730"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>stg_customers = <Fn>SnowflakeOperator</Fn>(task_id=<St>'stg_customers'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.stg_customers AS</St></Hl>{'\n'}
<Hl><St>        SELECT id AS customer_id, name, email, created_at AS signup_date</St></Hl>{'\n'}
<Hl><St>        FROM raw.customers"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>stg_payments = <Fn>SnowflakeOperator</Fn>(task_id=<St>'stg_payments'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.stg_payments AS</St></Hl>{'\n'}
<Hl><St>        SELECT id AS payment_id, order_id, amount/100 AS amount, method, status</St></Hl>{'\n'}
<Hl><St>        FROM raw.payments WHERE status = 'completed'"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>stg_products = <Fn>SnowflakeOperator</Fn>(task_id=<St>'stg_products'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.stg_products AS</St></Hl>{'\n'}
<Hl><St>        SELECT id AS product_id, name AS product_name, category, price</St></Hl>{'\n'}
<Hl><St>        FROM raw.products"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl><Cm># ── Intermediate (3) ───────────────────────────────</Cm></Hl>{'\n'}
    <Hl>int_orders_enriched = <Fn>SnowflakeOperator</Fn>(task_id=<St>'int_orders_enriched'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.int_orders_enriched AS</St></Hl>{'\n'}
<Hl><St>        SELECT o.order_id, o.customer_id, o.order_date, o.status,</St></Hl>{'\n'}
<Hl><St>               p.product_name, p.category, p.price</St></Hl>{'\n'}
<Hl><St>        FROM analytics.stg_orders o</St></Hl>{'\n'}
<Hl><St>        LEFT JOIN analytics.stg_products p ON o.order_id = p.product_id"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>int_customer_payments = <Fn>SnowflakeOperator</Fn>(task_id=<St>'int_customer_payments'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.int_customer_payments AS</St></Hl>{'\n'}
<Hl><St>        SELECT c.customer_id, c.name, c.email,</St></Hl>{'\n'}
<Hl><St>               SUM(p.amount) AS total_paid, COUNT(p.payment_id) AS payment_count</St></Hl>{'\n'}
<Hl><St>        FROM analytics.stg_customers c</St></Hl>{'\n'}
<Hl><St>        LEFT JOIN analytics.stg_payments p USING (customer_id)</St></Hl>{'\n'}
<Hl><St>        GROUP BY 1,2,3"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>int_order_payments = <Fn>SnowflakeOperator</Fn>(task_id=<St>'int_order_payments'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.int_order_payments AS</St></Hl>{'\n'}
<Hl><St>        SELECT o.order_id, o.customer_id, o.order_date, o.product_name,</St></Hl>{'\n'}
<Hl><St>               o.category, cp.total_paid, cp.payment_count</St></Hl>{'\n'}
<Hl><St>        FROM analytics.int_orders_enriched o</St></Hl>{'\n'}
<Hl><St>        LEFT JOIN analytics.int_customer_payments cp USING (customer_id)"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl><Cm># ── Dimensions & facts (3) ─────────────────────────</Cm></Hl>{'\n'}
    <Hl>dim_customers = <Fn>SnowflakeOperator</Fn>(task_id=<St>'dim_customers'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.dim_customers AS</St></Hl>{'\n'}
<Hl><St>        SELECT customer_id, name, email, total_paid, payment_count,</St></Hl>{'\n'}
<Hl><St>               CASE WHEN total_paid {'>'} 1000 THEN 'high'</St></Hl>{'\n'}
<Hl><St>                    WHEN total_paid {'>'} 100  THEN 'medium' ELSE 'low' END AS value_tier</St></Hl>{'\n'}
<Hl><St>        FROM analytics.int_customer_payments"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>dim_products = <Fn>SnowflakeOperator</Fn>(task_id=<St>'dim_products'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.dim_products AS</St></Hl>{'\n'}
<Hl><St>        SELECT product_id, product_name, category, price</St></Hl>{'\n'}
<Hl><St>        FROM analytics.stg_products"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>fct_orders = <Fn>SnowflakeOperator</Fn>(task_id=<St>'fct_orders'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.fct_orders AS</St></Hl>{'\n'}
<Hl><St>        SELECT order_id, customer_id, order_date, product_name,</St></Hl>{'\n'}
<Hl><St>               category, total_paid AS order_amount, payment_count</St></Hl>{'\n'}
<Hl><St>        FROM analytics.int_order_payments"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl><Cm># ── Marts (5) ──────────────────────────────────────</Cm></Hl>{'\n'}
    <Hl>revenue_by_customer = <Fn>SnowflakeOperator</Fn>(task_id=<St>'revenue_by_customer'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.revenue_by_customer AS</St></Hl>{'\n'}
<Hl><St>        SELECT d.customer_id, d.name, d.value_tier,</St></Hl>{'\n'}
<Hl><St>               SUM(f.order_amount) AS lifetime_revenue, COUNT(f.order_id) AS order_count</St></Hl>{'\n'}
<Hl><St>        FROM analytics.fct_orders f</St></Hl>{'\n'}
<Hl><St>        JOIN analytics.dim_customers d USING (customer_id) GROUP BY 1,2,3"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>monthly_revenue = <Fn>SnowflakeOperator</Fn>(task_id=<St>'monthly_revenue'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.monthly_revenue AS</St></Hl>{'\n'}
<Hl><St>        SELECT DATE_TRUNC('month', order_date) AS month,</St></Hl>{'\n'}
<Hl><St>               SUM(order_amount) AS revenue, COUNT(DISTINCT customer_id) AS customers</St></Hl>{'\n'}
<Hl><St>        FROM analytics.fct_orders GROUP BY 1"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>customer_lifetime_value = <Fn>SnowflakeOperator</Fn>(task_id=<St>'customer_lifetime_value'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.customer_lifetime_value AS</St></Hl>{'\n'}
<Hl><St>        SELECT d.customer_id, d.name, d.value_tier, r.lifetime_revenue,</St></Hl>{'\n'}
<Hl><St>               r.order_count, r.lifetime_revenue / NULLIF(r.order_count,0) AS avg_order_value</St></Hl>{'\n'}
<Hl><St>        FROM analytics.dim_customers d</St></Hl>{'\n'}
<Hl><St>        JOIN analytics.revenue_by_customer r USING (customer_id)"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>order_summary = <Fn>SnowflakeOperator</Fn>(task_id=<St>'order_summary'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.order_summary AS</St></Hl>{'\n'}
<Hl><St>        SELECT f.order_id, f.order_date, f.order_amount, d.product_name, d.category</St></Hl>{'\n'}
<Hl><St>        FROM analytics.fct_orders f</St></Hl>{'\n'}
<Hl><St>        JOIN analytics.dim_products d USING (product_id)"""</St>)</Hl>{'\n'}
{'\n'}
    <Hl>executive_dashboard = <Fn>SnowflakeOperator</Fn>(task_id=<St>'executive_dashboard'</St>, sql=<St>"""</St></Hl>{'\n'}
<Hl><St>        CREATE OR REPLACE TABLE analytics.executive_dashboard AS</St></Hl>{'\n'}
<Hl><St>        SELECT m.month, m.revenue, m.customers,</St></Hl>{'\n'}
<Hl><St>               SUM(c.lifetime_revenue) AS total_ltv, COUNT(DISTINCT o.order_id) AS total_orders</St></Hl>{'\n'}
<Hl><St>        FROM analytics.monthly_revenue m</St></Hl>{'\n'}
<Hl><St>        CROSS JOIN analytics.customer_lifetime_value c</St></Hl>{'\n'}
<Hl><St>        CROSS JOIN analytics.order_summary o GROUP BY 1,2,3"""</St>)</Hl>{'\n'}
{'\n'}
    <Cm># ── Step 3: Refresh dashboard ──────────────────────</Cm>{'\n'}
    refresh_dashboard = <Fn>SimpleHttpOperator</Fn>({'\n'}
        task_id=<St>'refresh_dashboard'</St>,{'\n'}
        http_conn_id=<St>'tableau'</St>,{'\n'}
        endpoint=<St>'/api/3.21/sites/site-id/datasources/ds-id/refresh'</St>,{'\n'}
        method=<St>'POST'</St>,{'\n'}
        headers={'{'}<St>'X-Tableau-Auth'</St>: Variable.get(<St>'tableau_token'</St>){'}'},{'\n'}
    ){'\n'}
{'\n'}
    <Rl><Cm># ── 21 manual dependency declarations ──────────────</Cm></Rl>{'\n'}
{'\n'}
    <Rl><Cm># Extract & load → staging</Cm></Rl>{'\n'}
    <Rl>extract_data  {'>>'}  load_data</Rl>{'\n'}
    <Rl>load_data  {'>>'}  [stg_orders, stg_customers, stg_payments, stg_products]</Rl>{'\n'}
{'\n'}
    <Rl><Cm># Staging → intermediate</Cm></Rl>{'\n'}
    <Rl>stg_orders  {'>>'}  int_orders_enriched</Rl>{'\n'}
    <Rl>stg_products  {'>>'}  int_orders_enriched</Rl>{'\n'}
    <Rl>stg_customers  {'>>'}  int_customer_payments</Rl>{'\n'}
    <Rl>stg_payments  {'>>'}  int_customer_payments</Rl>{'\n'}
    <Rl>int_orders_enriched  {'>>'}  int_order_payments</Rl>{'\n'}
    <Rl>int_customer_payments  {'>>'}  int_order_payments</Rl>{'\n'}
{'\n'}
    <Rl><Cm># Intermediate → dimensions & facts</Cm></Rl>{'\n'}
    <Rl>int_customer_payments  {'>>'}  dim_customers</Rl>{'\n'}
    <Rl>stg_products  {'>>'}  dim_products</Rl>{'\n'}
    <Rl>int_order_payments  {'>>'}  fct_orders</Rl>{'\n'}
{'\n'}
    <Rl><Cm># Facts & dims → marts</Cm></Rl>{'\n'}
    <Rl>fct_orders  {'>>'}  revenue_by_customer</Rl>{'\n'}
    <Rl>dim_customers  {'>>'}  revenue_by_customer</Rl>{'\n'}
    <Rl>fct_orders  {'>>'}  monthly_revenue</Rl>{'\n'}
    <Rl>dim_customers  {'>>'}  customer_lifetime_value</Rl>{'\n'}
    <Rl>revenue_by_customer  {'>>'}  customer_lifetime_value</Rl>{'\n'}
    <Rl>fct_orders  {'>>'}  order_summary</Rl>{'\n'}
    <Rl>dim_products  {'>>'}  order_summary</Rl>{'\n'}
    <Rl>monthly_revenue  {'>>'}  executive_dashboard</Rl>{'\n'}
    <Rl>customer_lifetime_value  {'>>'}  executive_dashboard</Rl>{'\n'}
    <Rl>order_summary  {'>>'}  executive_dashboard</Rl>{'\n'}
{'\n'}
    <Rl><Cm># Marts → dashboard</Cm></Rl>{'\n'}
    <Rl>executive_dashboard  {'>>'}  refresh_dashboard</Rl>
        </pre>
      </div>
      ) : (
        <AirflowOnlyDag />
      )}
    </div>
  )
}

export function AirflowWithDbt() {
  const [view, setView] = useState('script')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ViewToggle options={[{ key: 'script', label: 'Script' }, { key: 'dag', label: 'DAG view' }, { key: 'setup', label: 'Setup guide' }]} active={view} onChange={setView} />
        {view === 'script' && <Legend />}
      </div>

      {view === 'script' && (
        <>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-[10.5px] leading-[1.6]">
            <div className="text-gray-400 text-[9px] mb-2">airflow_pipeline.py</div>
            <pre className="text-gray-700">
<Kw>from</Kw> airflow <Kw>import</Kw> DAG{'\n'}
<Kw>from</Kw> fivetran_provider.operators.fivetran <Kw>import</Kw> FivetranOperator{'\n'}
<Kw>from</Kw> airflow_dbt_cloud.operators.dbt <Kw>import</Kw> DbtCloudRunJobOperator{'\n'}
<Kw>from</Kw> tableau_provider.operators.tableau <Kw>import</Kw> TableauRefreshOperator{'\n'}
<Kw>from</Kw> datetime <Kw>import</Kw> datetime{'\n'}
{'\n'}
<Kw>with</Kw> <Fn>DAG</Fn>(<St>'ecommerce_pipeline'</St>, start_date=<Fn>datetime</Fn>(<Op>2024</Op>,<Op>1</Op>,<Op>1</Op>), schedule=<St>'@daily'</St>, catchup=<Op>False</Op>) <Kw>as</Kw> dag:{'\n'}
{'\n'}
    extract = <Fn>FivetranOperator</Fn>(task_id=<St>'extract_data'</St>, connector_id=<St>'abc123'</St>){'\n'}
    load    = <Fn>FivetranOperator</Fn>(task_id=<St>'load_data'</St>, connector_id=<St>'abc123'</St>, wait_for_completion=<Op>True</Op>){'\n'}
    <Hl>transform = <Fn>DbtCloudRunJobOperator</Fn>(task_id=<St>'dbt_transform'</St>, job_id=<Op>67890</Op>, wait_for_termination=<Op>True</Op>)</Hl>{'\n'}
    refresh   = <Fn>TableauRefreshOperator</Fn>(task_id=<St>'refresh_dashboard'</St>, datasource_id=<St>'ds-id'</St>){'\n'}
{'\n'}
    <Rl>extract {'>>'}  load  {'>>'}  transform  {'>>'}  refresh</Rl>
            </pre>
          </div>
        </>
      )}
      {view === 'dag' && <AirflowDbtDag />}
      {view === 'setup' && <SetupGuide />}
    </div>
  )
}

const stepsMeta = [
  { num: 1, title: 'Create service token', where: 'dbt platform' },
  { num: 2, title: 'Get the job ID', where: 'dbt platform' },
  { num: 3, title: 'Add Airflow connection', where: 'Airflow' },
  { num: 4, title: 'Import provider & call job', where: 'Airflow DAG' },
  { num: 5, title: 'Add custom logic (optional)', where: 'Airflow DAG' },
]

function SetupGuide() {
  const [active, setActive] = useState(1)

  return (
    <div className="flex gap-4 min-h-[360px]">
      {/* Left stepper */}
      <div className="flex flex-col gap-1 w-56 flex-shrink-0">
        {stepsMeta.map((s, i) => (
          <div key={s.num}>
            <button
              onClick={() => setActive(s.num)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                active === s.num
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  active === s.num
                    ? 'bg-blue-600 text-white'
                    : s.num < active
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {s.num < active ? '\u2713' : s.num}
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-medium truncate ${active === s.num ? 'text-gray-900' : 'text-gray-600'}`}>{s.title}</p>
                  <p className="text-[10px] text-gray-400">{s.where}</p>
                </div>
              </div>
            </button>
            {i < stepsMeta.length - 1 && (
              <div className="ml-[22px] h-2 border-l-2 border-gray-200" />
            )}
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="flex-1 min-w-0">
        {active === 1 && <StepServiceToken />}
        {active === 2 && <StepJobId />}
        {active === 3 && <StepAirflowConnection />}
        {active === 4 && <StepImportProvider />}
        {active === 5 && <StepDownstreamLogic />}
      </div>
    </div>
  )
}

function MockInput({ label, value, className = '' }) {
  return (
    <div className={className}>
      <p className="text-[11px] text-gray-500 mb-1">{label}</p>
      <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white">{value}</div>
    </div>
  )
}

function CopyField({ label, value }) {
  return (
    <div>
      <p className="text-[11px] text-gray-500 mb-1">{label}</p>
      <div className="border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between bg-white">
        <span className="text-sm font-mono text-gray-800">{value}</span>
        <span className="text-[10px] text-gray-400 flex items-center gap-1 ml-3">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2"/></svg>
          Copy
        </span>
      </div>
    </div>
  )
}

function StepServiceToken() {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white h-full">
      <p className="text-base font-semibold text-gray-900 mb-4">New service token</p>
      <MockInput label="Token name" value="Airflow Data Eng Token" className="mb-4" />
      <p className="text-[11px] text-gray-400 mb-2">To learn more about dbt's permission sets, <span className="underline">check out the docs.</span></p>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 px-3 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
          <span>Permission set</span>
          <span>Project</span>
          <span>Environment write access</span>
        </div>
        <div className="grid grid-cols-3 px-3 py-2.5 items-center border-t border-gray-100">
          <div className="border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-800 inline-flex items-center gap-1 w-fit">
            Job Runner
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
          <div className="border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-800 inline-flex items-center gap-1 w-fit">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M21 21l-4.35-4.35"/></svg>
            Data Engineering |...
            <span className="text-gray-400 cursor-pointer">&times;</span>
          </div>
          <div className="text-xs text-gray-500 flex items-center justify-between">
            None
            <span className="text-gray-300 cursor-pointer">&times;</span>
          </div>
        </div>
      </div>
      <button className="mt-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1">
        + Add permission
      </button>
    </div>
  )
}

function StepAirflowConnection() {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white h-full">
      <p className="text-base font-semibold text-gray-900 mb-1">Add connection</p>
      <p className="text-xs text-gray-400 mb-4">Admin {'\u2192'} Connections {'\u2192'} +</p>
      <div className="space-y-3">
        <div>
          <p className="text-[11px] text-gray-500 mb-1">Connection type</p>
          <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white inline-flex items-center gap-1">
            dbt Cloud
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
        </div>
        <MockInput label="Connection ID" value="dbt_cloud_default" />
        <div>
          <p className="text-[11px] text-gray-500 mb-1">Account ID</p>
          <div className="border border-emerald-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-emerald-50/50 flex items-center gap-2">
            70437463654940
            <span className="text-[10px] text-emerald-600 ml-auto italic">from step 2</span>
          </div>
        </div>
        <div>
          <p className="text-[11px] text-gray-500 mb-1">Service token</p>
          <div className="border border-emerald-300 rounded-lg px-3 py-2 text-sm text-gray-400 bg-emerald-50/50 flex items-center gap-2">
            <span className="tracking-widest">{'*'.repeat(20)}</span>
            <span className="text-[10px] text-emerald-600 ml-auto italic">from step 1</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepJobId() {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] text-gray-400 mb-1">Orchestration / Environments / Production <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] font-medium ml-1">PROD</span></p>
          <p className="text-base font-semibold text-gray-900">Data Engineering | Scheduled Refresh</p>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
            <span>in 4h 40m</span>
            <span>Timeout 1 hour</span>
            <span>dbt State</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs flex-shrink-0">
          <span className="px-2.5 py-1.5 rounded-md bg-blue-50 border border-blue-300 text-blue-700 font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            API trigger
          </span>
          <span className="px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" strokeWidth="2"/></svg>
            Settings
          </span>
          <span className="px-2.5 py-1.5 rounded-md bg-gray-900 text-white font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Run now
          </span>
        </div>
      </div>

      <div className="border-2 border-blue-400 rounded-xl p-4 bg-blue-50/30">
        <p className="text-sm font-semibold text-gray-900 mb-3">Configuring an API trigger</p>
        <p className="text-xs text-gray-500 mb-4">Check the latest <span className="underline">API docs</span> for more information. You can create a <span className="underline">service token</span> to authenticate.</p>
        <div className="space-y-3">
          <CopyField label="Account ID" value="70437463654940" />
          <CopyField label="Job ID" value="70437463766272" />
        </div>
        <div className="mt-3">
          <p className="text-[11px] text-gray-500 mb-1">Example request</p>
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 font-mono text-[10px] leading-relaxed text-gray-600">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-semibold text-gray-800">POST</span>{'\n'}
                https://cloud.getdbt.com/api/v2/accounts/70437463654940/{'\n'}
                jobs/70437463766272/run/
              </div>
              <span className="text-[9px] text-gray-400 flex items-center gap-0.5 flex-shrink-0">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2"/></svg>
                Copy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepImportProvider() {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white h-full">
      <p className="text-base font-semibold text-gray-900 mb-1">Import the provider and call the job</p>
      <p className="text-xs text-gray-500 mb-4">In your Airflow DAG, import <code className="text-amber-700 bg-amber-50 px-1 rounded">DbtCloudRunJobOperator</code> from the dbt Cloud provider package and pass the job ID from step 2.</p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-[10.5px] leading-[1.6]">
        <pre className="text-gray-700">
<Kw>from</Kw> airflow_dbt_cloud.operators.dbt <Kw>import</Kw> DbtCloudRunJobOperator{'\n'}
{'\n'}
build = <Fn>DbtCloudRunJobOperator</Fn>({'\n'}
    task_id=<St>'dbt_transform'</St>,{'\n'}
    job_id=<Op>70437463766272</Op>,  <Cm># from step 2</Cm>{'\n'}
    wait_for_termination=<Op>True</Op>,{'\n'}
)
        </pre>
      </div>
    </div>
  )
}

function StepDownstreamLogic() {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white h-full">
      <div className="flex items-center gap-2 mb-1">
        <p className="text-base font-semibold text-gray-900">Add custom logic</p>
        <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">optional</span>
      </div>
      <p className="text-xs text-gray-500 mb-4">You can layer dbt with additional Airflow logic, like branching on success vs. failure or triggering downstream systems.</p>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-[10.5px] leading-[1.6]">
        <pre className="text-gray-700">
<Kw>from</Kw> airflow.operators.python <Kw>import</Kw> BranchPythonOperator{'\n'}
{'\n'}
<Kw>def</Kw> <Fn>check_result</Fn>(**ctx):{'\n'}
    result = ctx[<St>'ti'</St>].xcom_pull(task_ids=<St>'dbt_transform'</St>){'\n'}
    <Kw>return</Kw> <St>'tableau_refresh'</St> <Kw>if</Kw> result <Kw>else</Kw> <St>'alert_on_failure'</St>{'\n'}
{'\n'}
branch = <Fn>BranchPythonOperator</Fn>({'\n'}
    task_id=<St>'check_dbt'</St>,{'\n'}
    python_callable=check_result,{'\n'}
){'\n'}
{'\n'}
transform {'>>'}  branch {'>>'}  [refresh, alert]
        </pre>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-xs font-medium text-emerald-800">On success</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Refresh Tableau extracts, notify Slack, trigger downstream jobs</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs font-medium text-red-800">On failure</p>
          <p className="text-[11px] text-red-600 mt-0.5">Page on-call, open incident ticket, skip BI refresh</p>
        </div>
      </div>
    </div>
  )
}

// ── DAG visualizations ────────────────────────────────

const NW = 92, NH = 22

function bezier(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1) * 0.4
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
}

function DagSvg({ nodes, edges, viewBox, height = 300 }) {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto">
      <svg viewBox={viewBox} className="w-full" style={{ minHeight: height, maxHeight: height }}>
        {edges.map(([src, tgt], i) => {
          const s = nodeMap[src], t = nodeMap[tgt]
          const sw = s.w || NW, sh = s.h || NH, tw = t.w || NW, th = t.h || NH
          const isTransform = s.transform || t.transform
          return (
            <path
              key={i}
              d={bezier(s.x + sw, s.y + sh / 2, t.x, t.y + th / 2)}
              fill="none"
              stroke={isTransform ? '#6ee7b7' : '#94a3b8'}
              strokeWidth={isTransform ? 1.5 : 1.2}
              opacity={0.8}
            />
          )
        })}
        {nodes.map(n => {
          const w = n.w || NW, h = n.h || NH
          return (
            <g key={n.id}>
              {n.transform && (
                <rect x={n.x - 2} y={n.y - 2} width={w + 4} height={h + 4} rx={7} fill="#d1fae5" opacity={0.5} />
              )}
              <rect x={n.x} y={n.y} width={w} height={h} rx={5} fill={n.color} stroke={n.border || '#e5e7eb'} strokeWidth={1} />
              <text x={n.x + w / 2} y={n.y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize={n.fontSize || 7.5} fontFamily="ui-monospace, monospace" fill="#374151">
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const airflowOnlyNodes = [
  { id: 'ext',  x: 5,   y: 82,  label: 'extract_data',     color: '#dbeafe', border: '#93c5fd' },
  { id: 'load', x: 108, y: 82,  label: 'load_data',        color: '#dbeafe', border: '#93c5fd' },

  { id: 's_o',  x: 220, y: 10,  label: 'run_stg_orders',       color: '#d1fae5', border: '#6ee7b7', transform: true },
  { id: 's_pr', x: 220, y: 54,  label: 'run_stg_products',     color: '#d1fae5', border: '#6ee7b7', transform: true },
  { id: 's_c',  x: 220, y: 110, label: 'run_stg_customers',    color: '#d1fae5', border: '#6ee7b7', transform: true },
  { id: 's_p',  x: 220, y: 154, label: 'run_stg_payments',     color: '#d1fae5', border: '#6ee7b7', transform: true },

  { id: 'i_oe', x: 362, y: 32,  label: 'run_int_orders_enr',   color: '#d1fae5', border: '#6ee7b7', transform: true, w: 105 },
  { id: 'i_cp', x: 362, y: 120, label: 'run_int_cust_pay',     color: '#d1fae5', border: '#6ee7b7', transform: true, w: 105 },

  { id: 'i_op', x: 492, y: 32,  label: 'run_int_ord_pay',      color: '#d1fae5', border: '#6ee7b7', transform: true },
  { id: 'd_c',  x: 492, y: 82,  label: 'run_dim_customers',    color: '#d1fae5', border: '#6ee7b7', transform: true, w: 105 },
  { id: 'd_p',  x: 492, y: 140, label: 'run_dim_products',     color: '#d1fae5', border: '#6ee7b7', transform: true, w: 105 },

  { id: 'fct',  x: 620, y: 55,  label: 'run_fct_orders',       color: '#d1fae5', border: '#6ee7b7', transform: true },

  { id: 'rev',  x: 735, y: 15,  label: 'run_rev_by_cust',      color: '#d1fae5', border: '#6ee7b7', transform: true, w: 100 },
  { id: 'mon',  x: 735, y: 58,  label: 'run_monthly_rev',      color: '#d1fae5', border: '#6ee7b7', transform: true, w: 100 },
  { id: 'os',   x: 735, y: 128, label: 'run_order_summary',    color: '#d1fae5', border: '#6ee7b7', transform: true, w: 105 },

  { id: 'clv',  x: 860, y: 36,  label: 'run_cust_ltv',         color: '#d1fae5', border: '#6ee7b7', transform: true },
  { id: 'exec', x: 860, y: 108, label: 'run_exec_dashboard',   color: '#d1fae5', border: '#6ee7b7', transform: true, w: 110 },

  { id: 'dash', x: 990, y: 82,  label: 'refresh_dashboard', color: '#fce7f3', border: '#f9a8d4', w: 105 },
]

const airflowOnlyEdges = [
  ['ext', 'load'],
  ['load', 's_o'], ['load', 's_pr'], ['load', 's_c'], ['load', 's_p'],
  ['s_o', 'i_oe'], ['s_pr', 'i_oe'],
  ['s_c', 'i_cp'], ['s_p', 'i_cp'],
  ['i_oe', 'i_op'], ['i_cp', 'i_op'],
  ['i_cp', 'd_c'], ['s_pr', 'd_p'],
  ['i_op', 'fct'],
  ['fct', 'rev'], ['d_c', 'rev'],
  ['fct', 'mon'],
  ['fct', 'os'], ['d_p', 'os'],
  ['d_c', 'clv'], ['rev', 'clv'],
  ['mon', 'exec'], ['clv', 'exec'], ['os', 'exec'],
  ['exec', 'dash'],
]

function AirflowOnlyDag() {
  return <DagSvg nodes={airflowOnlyNodes} edges={airflowOnlyEdges} viewBox="0 0 1105 180" height={240} />
}

const dbtDagNodes = [
  { id: 'ext',     x: 20,  y: 55, w: 160, h: 40, label: 'extract_data',               color: '#dbeafe', border: '#93c5fd', fontSize: 12 },
  { id: 'load',    x: 230, y: 55, w: 160, h: 40, label: 'load_data',                  color: '#dbeafe', border: '#93c5fd', fontSize: 12 },
  { id: 'build',   x: 440, y: 55, w: 220, h: 40, label: 'trigger_dbt_transform',  color: '#d1fae5', border: '#6ee7b7', fontSize: 12, transform: true },
  { id: 'refresh', x: 730, y: 55, w: 180, h: 40, label: 'refresh_dashboard',          color: '#fce7f3', border: '#f9a8d4', fontSize: 12 },
]

const dbtDagEdges = [['ext', 'load'], ['load', 'build'], ['build', 'refresh']]

function AirflowDbtDag() {
  return <DagSvg nodes={dbtDagNodes} edges={dbtDagEdges} viewBox="0 0 930 150" height={180} />
}
