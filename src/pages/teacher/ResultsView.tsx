import React, { useState } from 'react';
import { useTeacherStore } from '../../store/teacherStore';
import { useExamStore } from '../../store/examStore';
import { useAuthStore } from '../../store/authStore';
import { Icons } from '../../components/icons';

const ResultsView = () => {
  const { user } = useAuthStore();
  const { getTeacherAssignments } = useTeacherStore();
  const { exams, getExamResults } = useExamStore();
  const [selectedExam, setSelectedExam] = useState<string>('');

  // Get all exams for this teacher
  const teacherAssignments = getTeacherAssignments(user!.id);
  const teacherExams = exams.filter(exam => 
    teacherAssignments.some(assignment => assignment.id === exam.subject_id)
  );

  const results = selectedExam ? getExamResults(selectedExam) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">View Results</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700">Select Exam</label>
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an exam</option>
          {teacherExams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title} - Batch {exam.batch}
            </option>
          ))}
        </select>
      </div>

      {selectedExam && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {results.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No results available for this exam yet
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.studentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {result.correctAnswers}/{result.totalQuestions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {result.percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        result.status === 'pass'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status === 'pass' ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsView;