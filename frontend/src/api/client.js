const BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      // response wasn't JSON - keep the generic message
    }
    throw new Error(message);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

export const CURRENT_STUDENT_ID = 1;
export const CURRENT_SUBJECT_ID = 1;

export const api = {
  getDashboard: (studentId) => request(`/analytics/student/${studentId}/dashboard`),
  getAllTopics: () => request(`/topics`),
  getMasteryForStudent: (studentId) => request(`/mastery/student/${studentId}`),
  getPriorityRanking: (studentId) => request(`/priority/student/${studentId}/ranking`),
  getActivePlan: (studentId) => request(`/study-plans/student/${studentId}/active`),
  getPlanHistory: (studentId) => request(`/study-plans/student/${studentId}/history`),
  generatePlan: (payload) =>
    request(`/study-plans/generate`, { method: 'POST', body: JSON.stringify(payload) }),
  getQuestionsByTopic: (topicId) => request(`/quiz/questions/by-topic/${topicId}`),
  submitQuiz: (payload) =>
    request(`/quiz/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  getDueForRevision: (studentId) => request(`/revision/student/${studentId}/due`),
  markRevised: (studentId, topicId) =>
    request(`/revision/student/${studentId}/topic/${topicId}/mark-revised`, { method: 'POST' }),
};