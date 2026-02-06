import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExecutionStatus } from "@/lib/codeRunner";

export interface SubmissionRecord {
  id: string;
  problemId: number;
  code: string;
  status: ExecutionStatus;
  passedTests: number;
  totalTests: number;
  executionTime: number;
  memoryUsed: number;
  submittedAt: string; // ISO string for persistence
  language: string;
}

interface SubmissionState {
  submissions: Record<string, SubmissionRecord[]>; // keyed by oderId (null = 'guest')
}

interface SubmissionActions {
  addSubmission: (
    userId: string | null,
    record: Omit<SubmissionRecord, "id" | "submittedAt">,
  ) => SubmissionRecord;
  getSubmissionsForProblem: (
    userId: string | null,
    problemId: number,
  ) => SubmissionRecord[];
  getBestSubmission: (
    userId: string | null,
    problemId: number,
  ) => SubmissionRecord | null;
  getAllSubmissions: (userId: string | null) => SubmissionRecord[];
  clearHistory: (userId: string | null) => void;
  migrateGuestData: (newUserId: string) => void;
}

const getUserKey = (userId: string | null) => userId || "guest";

export const useSubmissionStore = create<SubmissionState & SubmissionActions>()(
  persist(
    (set, get) => ({
      submissions: {},

      addSubmission: (userId, record) => {
        const key = getUserKey(userId);
        const newRecord: SubmissionRecord = {
          ...record,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          submittedAt: new Date().toISOString(),
        };

        set((state) => ({
          submissions: {
            ...state.submissions,
            [key]: [newRecord, ...(state.submissions[key] || [])],
          },
        }));

        return newRecord;
      },

      getSubmissionsForProblem: (userId, problemId) => {
        const key = getUserKey(userId);
        const userSubmissions = get().submissions[key] || [];
        return userSubmissions.filter((s) => s.problemId === problemId);
      },

      getBestSubmission: (userId, problemId) => {
        const key = getUserKey(userId);
        const userSubmissions = get().submissions[key] || [];
        const passed = userSubmissions
          .filter((s) => s.problemId === problemId && s.status === "passed")
          .sort((a, b) => a.executionTime - b.executionTime);
        return passed[0] || null;
      },

      getAllSubmissions: (userId) => {
        const key = getUserKey(userId);
        return get().submissions[key] || [];
      },

      clearHistory: (userId) => {
        const key = getUserKey(userId);
        set((state) => {
          const { [key]: _, ...rest } = state.submissions;
          return { submissions: rest };
        });
      },

      migrateGuestData: (newUserId) => {
        const state = get();
        const guestData = state.submissions["guest"];

        if (guestData && guestData.length > 0) {
          const userData = state.submissions[newUserId] || [];
          const merged = [...guestData, ...userData].sort(
            (a, b) =>
              new Date(b.submittedAt).getTime() -
              new Date(a.submittedAt).getTime(),
          );

          set((state) => {
            const { guest: _, ...rest } = state.submissions;
            return {
              submissions: {
                ...rest,
                [newUserId]: merged,
              },
            };
          });
        }
      },
    }),
    {
      name: "fe-code-submissions",
    },
  ),
);
