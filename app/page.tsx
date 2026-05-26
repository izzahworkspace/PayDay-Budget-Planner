"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type BudgetItem = { id: number; label: string; amount: number };
type BudgetGroup = {
  id: "commitment" | "lifestyle" | "savings";
  title: string;
  ratio: number;
  color: string;
  soft: string;
  cat: string;
  items: BudgetItem[];
};

const starterGroups: BudgetGroup[] = [
  {
    id: "commitment",
    title: "Commitment",
    ratio: 60,
    color: "#C88653",
    soft: "#FFF1E5",
    cat: "/cats/commitment-cat.png",
    items: [
      { id: 1, label: "Transport", amount: 300 },
      { id: 2, label: "Food", amount: 300 },
      { id: 3, label: "Housing", amount: 700 },
      { id: 4, label: "Utilities", amount: 200 },
      { id: 5, label: "Insurance", amount: 300 },
    ],
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    ratio: 30,
    color: "#E0A05A",
    soft: "#FFF7E8",
    cat: "/cats/lifestyle-cat.png",
    items: [
      { id: 6, label: "Shopping", amount: 200 },
      { id: 7, label: "Cafe", amount: 150 },
      { id: 8, label: "Dining Out", amount: 200 },
      { id: 9, label: "Hobbies", amount: 150 },
    ],
  },
  {
    id: "savings",
    title: "Savings",
    ratio: 10,
    color: "#9BA76B",
    soft: "#F2F7E8",
    cat: "/cats/savings-cat.png",
    items: [
      { id: 10, label: "Emergency", amount: 200 },
      { id: 11, label: "Investment", amount: 100 },
    ],
  },
];

export default function Home() {
  const [salary, setSalary] = useState(3000);
  const [currency, setCurrency] = useState("MYR");
  const [groups, setGroups] = useState<BudgetGroup[]>(starterGroups);

  const totalRatio = groups.reduce((total, group) => total + group.ratio, 0);
  const chartData = useMemo(
    () =>
      groups.map((group) => ({
        name: group.title,
        value: (salary * group.ratio) / 100,
        color: group.color,
      })),
    [groups, salary]
  );

  function updateRatio(index: number, value: number) {
    setGroups((current) =>
      current.map((group, i) =>
        i === index ? { ...group, ratio: Number(value || 0) } : group
      )
    );
  }

  function setPreset(values: [number, number, number]) {
    setGroups((current) =>
      current.map((group, i) => ({ ...group, ratio: values[i] }))
    );
  }

  function updateItem(
    groupIndex: number,
    itemId: number,
    field: "label" | "amount",
    value: string | number
  ) {
    setGroups((current) =>
      current.map((group, i) =>
        i !== groupIndex
          ? group
          : {
              ...group,
              items: group.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      [field]: field === "amount" ? Number(value || 0) : value,
                    }
                  : item
              ),
            }
      )
    );
  }

  function addItem(groupIndex: number) {
    setGroups((current) =>
      current.map((group, i) =>
        i !== groupIndex
          ? group
          : {
              ...group,
              items: [
                ...group.items,
                { id: Date.now(), label: "New Category", amount: 0 },
              ],
            }
      )
    );
  }

  function deleteItem(groupIndex: number, itemId: number) {
    setGroups((current) =>
      current.map((group, i) =>
        i !== groupIndex
          ? group
          : {
              ...group,
              items: group.items.filter((item) => item.id !== itemId),
            }
      )
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-[#fbf7f0] p-4 text-[#2f211a]">
      <div className="mx-auto grid h-full max-w-[1500px] grid-cols-[200px_minmax(0,1fr)] gap-4">
        <Sidebar />

        <section className="grid min-h-0 grid-rows-[48px_px_170px_minmax(0,1fr)] gap-3">
          <TopBar />
          <Hero />
          <TopInputs
            salary={salary}
            currency={currency}
            setSalary={setSalary}
            setCurrency={setCurrency}
            groups={groups}
            totalRatio={totalRatio}
            chartData={chartData}
            updateRatio={updateRatio}
            setPreset={setPreset}
          />
          <BreakdownSection
            salary={salary}
            currency={currency}
            groups={groups}
            updateItem={updateItem}
            addItem={addItem}
            deleteItem={deleteItem}
          />
        </section>
      </div>
    </main>
  );
}

function Sidebar() {
  return (
    <aside className="flex min-h-0 flex-col rounded-[28px] border border-[#eadbcf] bg-[#fffaf4] p-4 shadow-sm">
      <div className="flex items-center justify-center gap-3">
        <img src="/cats/logo-cat.png" className="h-10 w-10 object-contain" alt="" />
        <div>
          <h1 className="text-lg font-black">PawPlan</h1>
          <p className="text-[11px] leading-tight text-[#7f6b5c]">Plan today, purr tomorrow.</p>
        </div>
      </div>

      <div className="mt-6 rounded-[26px] bg-white p-4">
        <h2 className="mb-4 text-center text-lg font-black">Let&apos;s Plan!</h2>
        {["Salary", "Budget Ratio", "Breakdown"].map((step, index) => (
          <div
            key={step}
            className={`mb-3 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black ${
              index === 0 ? "bg-[#f3e1cf]" : "bg-[#fffaf4]"
            }`}
          >
            <span className={`grid h-8 w-8 place-items-center rounded-full ${
                index === 0 ? "bg-[#b98555] text-white" : "bg-white"
              }`}
            >
              {index + 1}
            </span>
            {step}
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-[26px] bg-[#fff7ed] p-4 text-center">
        <img src="/cats/peek-cat.png" className="mx-auto h-12 object-contain" alt="" />
        <p className="mt-2 text-sm font-black">Need help?</p>
        <p className="text-xs text-[#7f6b5c]">Review your plan monthly.</p>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="flex items-center justify-between rounded-[28px] border border-[#eadbcf] bg-[#fffaf4] px-5 shadow-sm">
      <p className="text-sm font-black tracking-wide text-[#b97945]">PAYDAY BUDGET PLANNER</p>
      <nav className="flex items-center gap-3 text-xs font-black">
        {["🐾 Dashboard", "🕘 History", "📤 Export", "☺ Profile"].map((item, index) => (
          <button key={item} className={`rounded-2xl px-5 py-2.5 ${index === 0 ? "bg-[#f3e1cf]" : "bg-white"}`}>
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden rounded-[28px] border border-[#eadbcf] bg-[#fff6ec] px-8 shadow-sm">
      <div>
        <h2 className="max-w-[760px] text-[30px] font-black leading-[1.05]">
          Smart money starts right <span className="text-[#b97945]">after payday.</span>
        </h2>
        <p className="mt-1 text-sm text-[#6f5b4f]">You enjoy life, we handle the planning.</p>
      </div>
      <img src="/cats/hero-cat.png" className="absolute right-[120px] top-[-32px] h-[138px] object-contain" alt="" />
      <span className="absolute right-[390px] top-9 text-lg">🧡</span>
      <span className="absolute right-14 top-6 text-3xl opacity-10">🐾</span>
    </section>
  );
}

function TopInputs({
  salary,
  currency,
  setSalary,
  setCurrency,
  groups,
  totalRatio,
  chartData,
  updateRatio,
  setPreset,
}: {
  salary: number;
  currency: string;
  setSalary: (value: number) => void;
  setCurrency: (value: string) => void;
  groups: BudgetGroup[];
  totalRatio: number;
  chartData: { name: string; value: number; color: string }[];
  updateRatio: (index: number, value: number) => void;
  setPreset: (values: [number, number, number]) => void;
}) {
  return (
    <section className="grid grid-cols-[330px_minmax(0,1fr)] gap-3">
      <section className="rounded-[28px] border border-[#eadbcf] bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-3">
          <Badge>1</Badge>
          <div>
            <h3 className="text-base font-black">Salary</h3>
            <p className="text-[11px] text-[#7f6b5c]">Take-home pay</p>
          </div>
          <img src="/cats/wallet-cat.png" className="ml-auto h-12 object-contain" alt="" />
        </div>
        <div className="flex rounded-2xl border border-[#e6d2c0] bg-white">
          <input
            type="number"
            value={salary}
            onChange={(event) => setSalary(Number(event.target.value))}
            className="min-w-0 flex-1 rounded-l-2xl px-4 py-3 text-lg font-black outline-none"
          />
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="rounded-r-2xl border-l border-[#e6d2c0] bg-white px-3 text-sm font-black outline-none"
          >
            <option>MYR</option>
            <option>USD</option>
            <option>SGD</option>
            <option>GBP</option>
          </select>
        </div>
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)_300px] gap-3 rounded-[28px] border border-[#eadbcf] bg-white p-4 shadow-sm">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <Badge>2</Badge>
            <div>
              <h3 className="text-base font-black">Budget Ratio</h3>
              <p className="text-[11px] text-[#7f6b5c]">Split salary before spending</p>
            </div>
            <span className={`ml-auto rounded-full px-3 py-1.5 text-xs font-black ${
                totalRatio === 100 ? "bg-[#edf6df] text-[#6c8547]" : "bg-[#ffe6df] text-[#a84a37]"
              }`}
            >
              Total {totalRatio}%
            </span>
          </div>

          <div className="mb-2 flex gap-2 text-[11px] font-black">
            <button onClick={() => setPreset([60, 30, 10])} className="rounded-xl border border-[#e0c7b2] bg-[#fff3e6] px-3 py-1.5">60:30:10</button>
            <button onClick={() => setPreset([50, 30, 20])} className="rounded-xl border border-[#e0c7b2] bg-white px-3 py-1.5">50:30:20</button>
            <button onClick={() => setPreset([70, 20, 10])} className="rounded-xl border border-[#e0c7b2] bg-white px-3 py-1.5">70:20:10</button>
          </div>

          <div className="space-y-2">
            {groups.map((group, index) => (
              <div key={group.id} className="grid grid-cols-[95px_minmax(0,1fr)_50px] items-center gap-3">
                <span className="text-xs font-black">{group.title}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={group.ratio}
                  onChange={(event) => updateRatio(index, Number(event.target.value))}
                  className="accent-[#b98555]"
                />
                <input
                  type="number"
                  value={group.ratio}
                  onChange={(event) => updateRatio(index, Number(event.target.value))}
                  className="rounded-lg border border-[#e6d2c0] py-1 text-center text-xs font-black outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[135px_1fr] items-center rounded-3xl bg-[#fffaf4] p-3">
          <div className="relative h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius={33} outerRadius={57} paddingAngle={2}>
                  {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-base font-black">{salary}</p>
                <p className="text-[10px] font-bold">{currency}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {groups.map((group) => (
              <div key={group.id} className="text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: group.color }} />
                  <b>{group.title}</b>
                </div>
                <p className="ml-4 text-[#7f6b5c]">
                  {group.ratio}% • {formatMoney((salary * group.ratio) / 100, currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

function BreakdownSection({
  salary,
  currency,
  groups,
  updateItem,
  addItem,
  deleteItem,
}: {
  salary: number;
  currency: string;
  groups: BudgetGroup[];
  updateItem: (groupIndex: number, itemId: number, field: "label" | "amount", value: string | number) => void;
  addItem: (groupIndex: number) => void;
  deleteItem: (groupIndex: number, itemId: number) => void;
}) {
  return (
    <section className="grid min-h-0 grid-rows-[40px_1fr] rounded-[28px] border border-[#eadbcf] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Badge>3</Badge>
        <h3 className="text-lg font-black">
          Breakdown <span className="text-sm font-normal">(Customize your categories)</span>
        </h3>
      </div>

      <div className="grid min-h-0 grid-cols-3 gap-4">
        {groups.map((group, groupIndex) => (
          <BreakdownCard
            key={group.id}
            group={group}
            groupIndex={groupIndex}
            salary={salary}
            currency={currency}
            updateItem={updateItem}
            addItem={addItem}
            deleteItem={deleteItem}
          />
        ))}
      </div>
    </section>
  );
}

function BreakdownCard({
  group,
  groupIndex,
  salary,
  currency,
  updateItem,
  addItem,
  deleteItem,
}: {
  group: BudgetGroup;
  groupIndex: number;
  salary: number;
  currency: string;
  updateItem: (groupIndex: number, itemId: number, field: "label" | "amount", value: string | number) => void;
  addItem: (groupIndex: number) => void;
  deleteItem: (groupIndex: number, itemId: number) => void;
}) {
  const budget = (salary * group.ratio) / 100;
  const used = group.items.reduce((total, item) => total + item.amount, 0);
  const usedPercentage = budget > 0 ? Math.min((used / budget) * 100, 100) : 0;
  const remaining = budget - used;

  return (
    <article className="grid min-h-0 grid-rows-[74px_28px_minmax(0,1fr)_42px] rounded-[24px] border border-[#eadbcf]" style={{ background: group.soft }}>
      <header className="relative rounded-t-[24px] bg-white/50 px-5 py-3">
        <h4 className="text-lg font-black" style={{ color: group.color }}>{group.title}</h4>
        <p className="text-xs">{group.ratio}% • {formatMoney(budget, currency)}</p>
        <img src={group.cat} className="absolute right-4 top-[-8px] h-[60px] object-contain" alt="" />
      </header>

      <div className="px-5">
        <div className="h-2 rounded-full bg-white">
          <div className="h-2 rounded-full" style={{ width: `${usedPercentage}%`, background: group.color }} />
        </div>
        <div className="mt-1 flex justify-between text-[10px] font-bold text-[#7f6b5c]">
          <span>Used {formatMoney(used, currency)}</span>
          <span className={remaining < 0 ? "text-[#b24435]" : ""}>Left {formatMoney(remaining, currency)}</span>
        </div>
      </div>

      <div className="min-h-0 space-y-2 overflow-y-auto px-5 py-2">
        {group.items.map((item) => (
          <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_90px_28px] items-center gap-2">
            <input
              value={item.label}
              onChange={(event) => updateItem(groupIndex, item.id, "label", event.target.value)}
              className="min-w-0 rounded-lg bg-white/75 px-3 py-2 text-sm font-bold outline-none"
            />
            <input
              type="number"
              value={item.amount}
              onChange={(event) => updateItem(groupIndex, item.id, "amount", Number(event.target.value))}
              className="rounded-lg bg-white px-2 py-2 text-right text-sm font-bold outline-none"
            />
            <button onClick={() => deleteItem(groupIndex, item.id)} className="rounded-lg bg-white/80 text-sm font-black text-[#8b5b45]">×</button>
          </div>
        ))}
      </div>

      <button onClick={() => addItem(groupIndex)} className="mx-5 mb-3 rounded-xl border border-dashed border-[#d6b994] bg-white/50 text-sm font-black text-[#8b5b45]">
        + Add Category
      </button>
    </article>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#b98555] text-sm font-black text-white">{children}</span>;
}

function formatMoney(amount: number, currency: string) {
  return `${Math.round(amount)} ${currency}`;
}