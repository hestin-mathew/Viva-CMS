import { create } from 'zustand';
import { Exam, ExamSubmission } from '../types/exam';

interface ExamState {
  exams: Exam[];
  submissions: ExamSubmission[];
  deployExam: (examData: Omit<Exam, 'id'>) => void;
  getExamsForStudent: (studentId: string, batch: string, semester: string) => {
    activeExams: Exam[];
    attendedExams: Exam[];
  };
  submitExam: (submission: Omit<ExamSubmission, 'id'>) => void;
  hasStudentSubmittedExam: (examId: string, studentId: string) => boolean;
  getExamResults: (examId: string) => ExamSubmission[];
  getStudentResults: (studentId: string) => ExamSubmission[];
  isDuplicateExam: (title: string, batch: string, semester: number) => boolean;
}

export const useExamStore = create<ExamState>((set, get) => ({
  exams: [],
  submissions: [],

  deployExam: (examData) => {
    const isDuplicate = get().isDuplicateExam(examData.title, examData.batch, examData.semester);
    if (isDuplicate) {
      throw new Error('An exam with the same title already exists for this batch and semester');
    }

    const newExam: Exam = {
      id: Date.now().toString(),
      ...examData,
    };

    set((state) => ({
      exams: [...state.exams, newExam],
    }));
  },

  getExamsForStudent: (studentId, batch, semester) => {
    const now = new Date();
    const { exams, submissions } = get();
    
    const studentExams = exams.filter((exam) => 
      exam.batch === batch && 
      exam.semester.toString() === semester
    );

    const hasSubmitted = (examId: string) => 
      submissions.some(s => s.examId === examId && s.studentId === studentId);

    return {
      activeExams: studentExams.filter(exam => {
        const startTime = new Date(exam.start_time);
        const endTime = new Date(exam.end_time);
        return startTime <= now && 
               endTime >= now && 
               !hasSubmitted(exam.id);
      }),
      attendedExams: studentExams.filter(exam => 
        hasSubmitted(exam.id)
      )
    };
  },

  submitExam: (submissionData) => {
    const submission: ExamSubmission = {
      id: Date.now().toString(),
      ...submissionData,
    };

    set((state) => ({
      submissions: [...state.submissions, submission],
    }));
  },

  hasStudentSubmittedExam: (examId, studentId) => {
    return get().submissions.some(
      (s) => s.examId === examId && s.studentId === studentId
    );
  },

  getExamResults: (examId) => {
    const now = new Date();
    const exam = get().exams.find((e) => e.id === examId);
    
    if (!exam || new Date(exam.end_time) > now) {
      return [];
    }

    return get().submissions.filter((s) => s.examId === examId);
  },

  getStudentResults: (studentId) => {
    const now = new Date();
    return get().submissions.filter(
      (s) => 
        s.studentId === studentId && 
        new Date(get().exams.find(e => e.id === s.examId)?.end_time || '') <= now
    );
  },

  isDuplicateExam: (title, batch, semester) => {
    return get().exams.some(
      exam => 
        exam.title.toLowerCase() === title.toLowerCase() &&
        exam.batch === batch &&
        exam.semester === semester
    );
  },
}));