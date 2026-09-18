import { useState, useEffect } from 'react';
import { api, CURRENT_STUDENT_ID } from '../api/client';
import StatusMessage from '../components/StatusMessage';
import PageHeader from '../components/PageHeader';

function masteryTone(score) {
  if (score >= 70) return { fg: 'var(--dark)', bar: 'var(--lime)' };
  if (score >= 45) return { fg: 'var(--dark)', bar: 'var(--blue)' };
  return { fg: 'var(--gray)', bar: 'var(--border-strong)' };
}

function SyllabusPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getAllTopics(), api.getMasteryForStudent(CURRENT_STUDENT_ID)])
      .then(([topics, mastery]) => {
        const masteryByTopicId = new Map(mastery.map((m) => [m.topicId, m]));
        setRows(
          topics.map((topic) => ({
            topicId: topic.id,
            topicName: topic.name,
            unitName: topic.unitName,
            masteryScore: masteryByTopicId.get(topic.id)?.masteryScore ?? null,
          }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading || error) return <StatusMessage loading={loading} error={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Syllabus"
        title="What you know, and what's next."
        subtitle="Every topic in ADBMS, ranked by how well it's understood."
      />

      <div>
        {rows.map((row, i) => {
          const tone = row.masteryScore !== null ? masteryTone(row.masteryScore) : null;
          return (
            <div
              key={row.topicId}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr auto',
                alignItems: 'center',
                gap: 24,
                padding: '28px 4px',
                borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div className="tabular" style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              <div>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>{row.topicName}</div>
                <div style={{ fontSize: 13.5, color: 'var(--gray)', marginTop: 4 }}>{row.unitName}</div>
              </div>

              {row.masteryScore === null ? (
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray)', border: '1px solid var(--border-strong)', padding: '6px 14px', borderRadius: 999 }}>
                  NOT ASSESSED
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: 220 }}>
                  <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4 }}>
                    <div style={{ width: `${row.masteryScore}%`, height: '100%', background: tone.bar, borderRadius: 4 }} />
                  </div>
                  <span className="tabular" style={{ fontSize: 20, fontWeight: 800, color: tone.fg, width: 52, textAlign: 'right' }}>
                    {Math.round(row.masteryScore)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SyllabusPage;