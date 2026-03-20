import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const STANDUP_PROMPT = `Using the notes below, generate my standup update in this exact format:
1. What I did yesterday — One or two sentences max. Specific but brief.
2. What I am doing today — What I am focused on right now.
3. Any blockers — If nothing is blocking me, just say No blockers.
Keep it natural and to the point.`;

interface Note {
  id: string;
  content: string;
  note_type: string;
  note_date: string;
  created_at: string;
}

interface Goal {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

const tabs = ["Daily Notes", "History", "Goals", "Weekly Summary", "Monthly Summary"] as const;
type Tab = (typeof tabs)[number];

const getWeekRange = (refDate: Date) => {
  const d = new Date(refDate);
  const dayOfWeek = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
    label: `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${sunday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
  };
};

const getMonthRange = (year: number, month: number) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
    label: start.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
};

const formatNotesAsSummary = (notes: Note[], title: string) => {
  const byDate = notes.reduce<Record<string, Note[]>>((acc, n) => {
    (acc[n.note_date] = acc[n.note_date] || []).push(n);
    return acc;
  }, {});
  const lines = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayNotes]) => {
      const dayLabel = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      const items = dayNotes.map((n) => `  - ${n.content}`).join("\n");
      return `${dayLabel}\n${items}`;
    })
    .join("\n\n");
  return `${title}\n\n${lines}`;
};

const WorkAssistant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = sessionStorage.getItem("ho-token");
  const today = new Date().toISOString().split("T")[0];

  const [activeTab, setActiveTab] = useState<Tab>("Daily Notes");
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  // History
  const [historyDates, setHistoryDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [historyNotes, setHistoryNotes] = useState<Note[]>([]);

  // Goals
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");

  // Weekly
  const [weekOffset, setWeekOffset] = useState(0);
  const [weeklyNotes, setWeeklyNotes] = useState<Note[]>([]);

  // Monthly
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [monthlyNotes, setMonthlyNotes] = useState<Note[]>([]);

  const currentWeek = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return getWeekRange(d);
  }, [weekOffset]);

  const currentMonth = useMemo(
    () => getMonthRange(selectedMonth.year, selectedMonth.month),
    [selectedMonth]
  );

  // Generate month options (current month + 11 months back)
  const monthOptions = useMemo(() => {
    const opts = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      opts.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      });
    }
    return opts;
  }, []);

  useEffect(() => {
    if (!token) navigate("/home-office/login");
  }, [token, navigate]);

  const api = useCallback(
    async (action: string, data: any = {}) => {
      const { data: res, error } = await supabase.functions.invoke("home-office-auth", {
        body: { action, token, ...data },
      });
      if (error) throw error;
      if (res?.error) throw new Error(res.error);
      return res;
    },
    [token]
  );

  const fetchNotes = useCallback(async () => {
    try {
      const res = await api("get_notes", { date: today });
      setNotes(res.notes || []);
    } catch (e: any) {
      console.error(e);
    }
  }, [api, today]);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await api("get_goals");
      setGoals(res.goals || []);
    } catch (e: any) {
      console.error(e);
    }
  }, [api]);

  const fetchHistoryDates = useCallback(async () => {
    try {
      const res = await api("get_all_note_dates");
      setHistoryDates(res.dates || []);
    } catch (e: any) {
      console.error(e);
    }
  }, [api]);

  const fetchWeekly = useCallback(async () => {
    try {
      const res = await api("get_notes_range", {
        start_date: currentWeek.start,
        end_date: currentWeek.end,
      });
      setWeeklyNotes(res.notes || []);
    } catch (e: any) {
      console.error(e);
    }
  }, [api, currentWeek]);

  const fetchMonthly = useCallback(async () => {
    try {
      const res = await api("get_notes_range", {
        start_date: currentMonth.start,
        end_date: currentMonth.end,
      });
      setMonthlyNotes(res.notes || []);
    } catch (e: any) {
      console.error(e);
    }
  }, [api, currentMonth]);

  useEffect(() => {
    if (!token) return;
    fetchNotes();
    fetchGoals();
  }, [token, fetchNotes, fetchGoals]);

  useEffect(() => {
    if (activeTab === "History") fetchHistoryDates();
    if (activeTab === "Weekly Summary") fetchWeekly();
    if (activeTab === "Monthly Summary") fetchMonthly();
  }, [activeTab, fetchHistoryDates, fetchWeekly, fetchMonthly]);

  useEffect(() => {
    if (selectedDate) {
      api("get_notes", { date: selectedDate }).then((res) => setHistoryNotes(res.notes || []));
    }
  }, [selectedDate, api]);

  const addNote = async () => {
    if (!newNote.trim()) return;
    setLoading(true);
    try {
      await api("add_note", { content: newNote.trim(), note_date: today });
      setNewNote("");
      fetchNotes();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api("delete_note", { id });
      fetchNotes();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const copySummary = () => {
    const text = notes.map((n) => `- ${n.content}`).join("\n");
    const summary = `Daily Notes — ${today}\n\n${text}`;
    navigator.clipboard.writeText(summary);
    toast({ title: "Summary copied to clipboard" });
  };

  const copyStandupPrompt = () => {
    const notesText = notes.map((n) => `- ${n.content}`).join("\n");
    navigator.clipboard.writeText(`${STANDUP_PROMPT}\n\nNotes:\n${notesText}`);
    toast({ title: "Standup prompt copied" });
  };

  const copyWeeklySummary = () => {
    const text = formatNotesAsSummary(weeklyNotes, `Weekly Summary — ${currentWeek.label}`);
    navigator.clipboard.writeText(text);
    toast({ title: "Weekly summary copied" });
  };

  const copyMonthlySummary = () => {
    const text = formatNotesAsSummary(monthlyNotes, `Monthly Summary — ${currentMonth.label}`);
    navigator.clipboard.writeText(text);
    toast({ title: "Monthly summary copied" });
  };

  const addGoal = async () => {
    if (!newGoalTitle.trim()) return;
    try {
      await api("add_goal", { title: newGoalTitle.trim() });
      setNewGoalTitle("");
      fetchGoals();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const toggleGoal = async (id: string, completed: boolean) => {
    try {
      await api("toggle_goal", { id, completed: !completed });
      fetchGoals();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await api("delete_goal", { id });
      fetchGoals();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const groupByDate = (notesList: Note[]) =>
    notesList.reduce<Record<string, Note[]>>((acc, n) => {
      (acc[n.note_date] = acc[n.note_date] || []).push(n);
      return acc;
    }, {});

  const weeklyByDate = groupByDate(weeklyNotes);
  const monthlyByDate = groupByDate(monthlyNotes);

  const renderGroupedNotes = (grouped: Record<string, Note[]>) =>
    Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, dayNotes]) => (
        <div key={date}>
          <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-brand">
            {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </h3>
          <div className="space-y-2">
            {dayNotes.map((n) => (
              <div key={n.id} className="border-l-2 border-brand/30 pl-4 py-1">
                <span className="text-xs text-muted-foreground">{formatTime(n.created_at)}</span>
                <p className="text-sm">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      ));

  return (
    <div className="min-h-screen bg-background font-mono relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand z-[60]" />
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[20vw] font-bold text-foreground/[0.03] uppercase tracking-widest select-none">RDG</span>
      </div>
      <Header />
      <main className="pt-32 pb-20 relative z-10">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Work Assistant</h1>
            <p className="text-sm text-brand italic mt-1">by RDG</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-0 border-b-2 border-foreground mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
                  activeTab === tab
                    ? "border-brand text-brand font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Daily Notes */}
          {activeTab === "Daily Notes" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex gap-3">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  placeholder="Add a note..."
                  className="flex-1 border-2 border-foreground bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand"
                />
                <button
                  onClick={addNote}
                  disabled={loading}
                  className="bg-brand text-brand-foreground px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand/90 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copySummary}
                  disabled={notes.length === 0}
                  className="border-2 border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Copy Summary
                </button>
              </div>

              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border-2 border-foreground/20 p-4 flex justify-between items-start gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">{formatTime(note.created_at)}</span>
                      <p className="text-sm mt-1">{note.content}</p>
                    </div>
                    <button onClick={() => deleteNote(note.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0">
                      ×
                    </button>
                  </div>
                ))}
                {notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet today.</p>}
              </div>

              <div className="border-2 border-brand/30 p-6 mt-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs uppercase tracking-widest font-bold">Standup Prompt for Claude</h3>
                  <button onClick={copyStandupPrompt} className="text-xs text-brand hover:underline">
                    Copy with notes
                  </button>
                </div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{STANDUP_PROMPT}</pre>
              </div>
            </motion.div>
          )}

          {/* History */}
          {activeTab === "History" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              <div className="space-y-1 border-r-2 border-foreground/10 pr-4">
                <h3 className="text-xs uppercase tracking-widest font-bold mb-3">Past Days</h3>
                {historyDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`block w-full text-left px-3 py-2 text-xs transition-colors ${
                      selectedDate === date ? "bg-brand/10 text-brand font-bold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </button>
                ))}
                {historyDates.length === 0 && <p className="text-xs text-muted-foreground">No history yet.</p>}
              </div>
              <div className="space-y-3">
                {selectedDate ? (
                  <>
                    <h3 className="text-sm font-bold mb-4">
                      {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </h3>
                    {historyNotes.map((note) => (
                      <div key={note.id} className="border-2 border-foreground/20 p-4">
                        <span className="text-xs text-muted-foreground">{formatTime(note.created_at)}</span>
                        <p className="text-sm mt-1">{note.content}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Select a date to view notes.</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Goals */}
          {activeTab === "Goals" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex gap-3">
                <input
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addGoal()}
                  placeholder="Add a goal..."
                  className="flex-1 border-2 border-foreground bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand"
                />
                <button
                  onClick={addGoal}
                  className="bg-brand text-brand-foreground px-6 py-3 text-xs uppercase tracking-widest hover:bg-brand/90 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="border-2 border-foreground/20 p-4 flex items-center gap-4">
                    <button
                      onClick={() => toggleGoal(goal.id, goal.completed)}
                      className={`w-5 h-5 border-2 shrink-0 flex items-center justify-center transition-colors ${
                        goal.completed ? "bg-brand border-brand text-brand-foreground" : "border-foreground"
                      }`}
                    >
                      {goal.completed && <span className="text-xs">✓</span>}
                    </button>
                    <span className={`text-sm flex-1 ${goal.completed ? "line-through text-muted-foreground" : ""}`}>
                      {goal.title}
                    </span>
                    <button onClick={() => deleteGoal(goal.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                      ×
                    </button>
                  </div>
                ))}
                {goals.length === 0 && <p className="text-sm text-muted-foreground">No goals yet.</p>}
              </div>
            </motion.div>
          )}

          {/* Weekly Summary */}
          {activeTab === "Weekly Summary" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setWeekOffset((o) => o - 1)}
                    className="border-2 border-foreground px-3 py-2 text-xs hover:bg-foreground hover:text-background transition-colors"
                  >
                    ←
                  </button>
                  <span className="text-sm font-bold">{currentWeek.label}</span>
                  <button
                    onClick={() => setWeekOffset((o) => Math.min(o + 1, 0))}
                    disabled={weekOffset >= 0}
                    className="border-2 border-foreground px-3 py-2 text-xs hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
                <button
                  onClick={copyWeeklySummary}
                  disabled={weeklyNotes.length === 0}
                  className="border-2 border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Copy Summary
                </button>
              </div>
              <div className="space-y-8">
                {Object.keys(weeklyByDate).length === 0 && (
                  <p className="text-sm text-muted-foreground">No notes for this week.</p>
                )}
                {renderGroupedNotes(weeklyByDate)}
              </div>
            </motion.div>
          )}

          {/* Monthly Summary */}
          {activeTab === "Monthly Summary" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <select
                  value={`${selectedMonth.year}-${selectedMonth.month}`}
                  onChange={(e) => {
                    const [y, m] = e.target.value.split("-").map(Number);
                    setSelectedMonth({ year: y, month: m });
                  }}
                  className="border-2 border-foreground bg-background px-4 py-2 font-mono text-sm focus:outline-none focus:border-brand"
                >
                  {monthOptions.map((opt) => (
                    <option key={`${opt.year}-${opt.month}`} value={`${opt.year}-${opt.month}`}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={copyMonthlySummary}
                  disabled={monthlyNotes.length === 0}
                  className="border-2 border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Copy Summary
                </button>
              </div>
              <div className="space-y-8">
                {Object.keys(monthlyByDate).length === 0 && (
                  <p className="text-sm text-muted-foreground">No notes for {currentMonth.label}.</p>
                )}
                {renderGroupedNotes(monthlyByDate)}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkAssistant;
