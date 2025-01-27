import { create } from 'zustand';
import { Teacher, Subject, SubjectAssignment } from '../types';
import bcrypt from 'bcryptjs';

interface TeacherState {
  teachers: Teacher[];
  subjectAssignments: SubjectAssignment[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'hasSetPassword' | 'subjects' | 'password'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  assignSubject: (assignment: Omit<SubjectAssignment, 'id'>) => Promise<void>;
  removeSubjectAssignment: (assignmentId: string) => Promise<void>;
  getTeacherAssignments: (teacherId: string) => SubjectAssignment[];
  isSubjectAssigned: (subjectCode: string, department: string, semester: number, batch: string) => boolean;
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
  teachers: [],
  subjectAssignments: [],
  
  addTeacher: async (teacherData) => {
    try {
      // Check if the username already exists
      const existingTeacher = get().teachers.find(
        (teacher) => teacher.username === teacherData.username
      );
      if (existingTeacher) {
        throw new Error('Username already exists');
      }
  
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        ...teacherData,
        hasSetPassword: false,
        password: '',
        subjects: [],
      };
  
      set((state) => ({
        teachers: [...state.teachers, newTeacher],
      }));
    } catch (error) {
      throw error; // Propagate the error for the form to handle
    }
  },
  

  updateTeacher: async (id, teacherData) => {
    try {
      set((state) => ({
        teachers: state.teachers.map((teacher) =>
          teacher.id === id ? { ...teacher, ...teacherData } : teacher
        ),
      }));
    } catch (error) {
      throw new Error('Failed to update teacher');
    }
  },

  deleteTeacher: async (id) => {
    try {
      set((state) => ({
        teachers: state.teachers.filter((teacher) => teacher.id !== id),
        subjectAssignments: state.subjectAssignments.filter(
          (assignment) => assignment.teacherId !== id
        ),
      }));
    } catch (error) {
      throw new Error('Failed to delete teacher');
    }
  },

  assignSubject: async (assignment) => {
    const state = get();
    
    // Check if subject is already assigned
    const isAssigned = state.isSubjectAssigned(
      assignment.subjectCode,
      assignment.department,
      assignment.semester,
      assignment.batch
    );

    if (isAssigned) {
      throw new Error('This subject is already assigned to another teacher for the specified department, semester, and batch');
    }

    // Check if teacher exists
    const teacher = state.teachers.find(t => t.id === assignment.teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const newAssignment: SubjectAssignment = {
      id: Date.now().toString(),
      ...assignment,
    };

    set((state) => ({
      subjectAssignments: [...state.subjectAssignments, newAssignment],
    }));
  },

  removeSubjectAssignment: async (assignmentId) => {
    set((state) => ({
      subjectAssignments: state.subjectAssignments.filter(
        (assignment) => assignment.id !== assignmentId
      ),
    }));
  },

  getTeacherAssignments: (teacherId) => {
    return get().subjectAssignments.filter(
      (assignment) => assignment.teacherId === teacherId
    );
  },

  isSubjectAssigned: (subjectCode, department, semester, batch) => {
    return get().subjectAssignments.some(
      (assignment) =>
        assignment.subjectCode === subjectCode &&
        assignment.department === department &&
        assignment.semester === semester &&
        assignment.batch === batch
    );
  },
}));