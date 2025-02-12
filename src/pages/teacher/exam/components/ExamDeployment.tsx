import React, { useState } from 'react';
import { Question } from '../../../../types/exam';
import { Icons } from '../../../../components/icons';
import { useExamStore } from '../../../../store/examStore';
import { useAuthStore } from '../../../../store/authStore';
import { useTeacherStore } from '../../../../store/teacherStore';
import toast from 'react-hot-toast';

interface ExamDeploymentProps {
  selectedQuestions: Question[];
  subjectId: string;
  onDeploy: () => void;
}

const ExamDeployment: React.FC<ExamDeploymentProps> = ({
  selectedQuestions,
  subjectId,
  onDeploy,
}) => {
  const { user } = useAuthStore();
  const { deployExam } = useExamStore();
  const { getTeacherAssignments } = useTeacherStore();
  
  const assignment = getTeacherAssignments(user!.id).find(a => a.id === subjectId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: 60,
    pass_percentage: 40,
    start_time: '',
    end_time: '',
  });

  const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignment) {
      toast.error('Subject assignment not found');
      return;
    }

    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question');
      return;
    }

    try {
      await deployExam({
        ...formData,
        subject_id: subjectId,
        questions: selectedQuestions,
        total_marks: totalMarks,
        batch: assignment.batch,
        semester: assignment.semester, // Add semester from assignment
      });
      
      toast.success('Exam deployed successfully');
      onDeploy();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to deploy exam');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium">Deploy Exam</h3>
          <p className="text-sm text-gray-500 mt-1">
            {assignment?.subjectName} - Batch {assignment?.batch} - Semester {assignment?.semester}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Total Questions: {selectedQuestions.length} | Total Marks: {totalMarks}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Exam Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              required
              min="1"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pass Percentage</label>
            <input
              type="number"
              required
              min="1"
              max="100"
              value={formData.pass_percentage}
              onChange={(e) => setFormData({ ...formData, pass_percentage: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              required
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="datetime-local"
              required
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Icons.Upload className="w-4 h-4 mr-2" />
            Deploy Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamDeployment;