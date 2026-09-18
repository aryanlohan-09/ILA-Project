import { useState, useEffect } from 'react';
import { api, CURRENT_STUDENT_ID } from '../api/client';
import StatusMessage from '../components/StatusMessage';

function NeuralGlyph({ tone }) {
  const c = tone || 'var(--lime)';
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="4" fill={c} />
      <circle cx="30" cy="30" r="3" fill="var(--blue)" />
      <circle cx="92" cy="28" r="3" fill="var(--blue)" />
      <circle cx="24" cy="88" r="3" fill={c} />
      <circle cx="96" cy="90" r="3" fill={c} />
      <circle cx="60" cy="14" r="2.4" fill="rgba(21,21,21,0.25)" />
      <circle cx="60" cy="106" r="2.4" fill="rgba(21,21,21,0.25)" />
      <line x1="60" y1="60" x2="30" y2="30" stroke={c} strokeWidth="1.4" opacity="0.5" />
      <line x1="60" y1="60" x2="92" y2="28" stroke="var(--blue)" strokeWidth="1.4" opacity="0.5" />
      <line x1="60" y1="60" x2="24" y2="88" stroke={c} strokeWidth="1.4" opacity="0.5" />
      <line x1="60" y1="60" x2="96" y2="90" stroke="var(--blue)" strokeWidth="1.4" opacity="0.5" />
      <line x1="60" y1="60" x2="60" y2="14" stroke="rgba(21,21,21,0.3)" strokeWidth="1.2" opacity="0.4" />
      <line x1="60" y1="60" x2="60" y2="106" stroke="rgba(21,21,21,0.3)" strokeWidth="1.2" opacity="0.4" />
    </svg>
  );
}

function MasteryDial({ percentage }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div style={{ position: 'relative', width: 120, height: 120 }}>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--lime)" strokeWidth="9"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="tabular" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{Math.round(percentage)}%</span>
        <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}>MASTERY</span>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getDashboard(CURRENT_STUDENT_ID).then(setData).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  if (loading || error) return <StatusMessage loading={loading} error={error} />;

  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gray)', letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase' }}>
        Overview
      </div>
      <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.02, margin: '0 0 36px', letterSpacing: '-0.02em', maxWidth: 640 }}>
        Your learning, <span style={{ color: 'var(--blue-deep)' }}>quantified</span>.
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div
          style={{
            background: 'var(--dark)', borderRadius: 'var(--radius-lg)', padding: '32px 36px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 200,
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 10 }}>Overall mastery</div>
            <div style={{ fontSize: 15, color: '#fff', maxWidth: 220, lineHeight: 1.5 }}>
              Tracked across every topic in ADBMS.
            </div>
          </div>
          <MasteryDial percentage={data.overallMasteryPercentage} />
        </div>

        <div
          style={{
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            padding: '32px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 200,
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 10 }}>Study plan</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
              {data.hasActiveStudyPlan ? 'Active' : 'Not started'}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--gray)', maxWidth: 200, lineHeight: 1.5 }}>
              {data.hasActiveStudyPlan ? 'Adjusts automatically after every quiz.' : 'Generate one from the Study plan tab.'}
            </div>
          </div>
          <NeuralGlyph />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '26px 28px' }}>
          <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 14 }}>Weak topics</div>
          <div className="tabular" style={{ fontSize: 40, fontWeight: 800, color: data.weakTopicsCount > 0 ? 'var(--dark)' : 'var(--dark)' }}>
            {data.weakTopicsCount}
          </div>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: data.weakTopicsCount > 0 ? 'var(--blue)' : 'var(--lime)', marginTop: 12 }} />
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '26px 28px' }}>
          <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 14 }}>Due for revision</div>
          <div className="tabular" style={{ fontSize: 40, fontWeight: 800 }}>{data.topicsDueForRevisionCount}</div>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: 'var(--lime)', marginTop: 12 }} />
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '26px 28px' }}>
          <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 14 }}>Quiz attempts</div>
          <div className="tabular" style={{ fontSize: 40, fontWeight: 800 }}>{data.totalQuizAttempts}</div>
          <div style={{ width: 32, height: 4, borderRadius: 2, background: 'var(--blue)', marginTop: 12 }} />
        </div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '30px 36px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 18 }}>Weak topics</div>
        {data.weakTopicNames.length === 0 ? (
          <p style={{ fontSize: 14.5, color: 'var(--gray)', margin: 0 }}>None right now &mdash; nice work.</p>
        ) : (
          data.weakTopicNames.map((name, i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < data.weakTopicNames.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 17, fontWeight: 600 }}>{name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)', background: 'var(--blue)', padding: '5px 14px', borderRadius: 999 }}>
                REVIEW
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardPage;