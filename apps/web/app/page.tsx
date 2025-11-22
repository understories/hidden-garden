export default function Home() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱 Hidden Garden</h1>
      <p style={{ fontSize: '1.5rem', color: '#666' }}>
        A privacy-preserving skill tree and leaderboard.
      </p>
    </main>
  );
}

