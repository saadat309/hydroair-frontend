export default function RootNotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/en" style={{ marginTop: '16px', color: 'blue', textDecoration: 'underline' }}>Go to Home</a>
    </div>
  );
}
