// app/digitalgift/page.tsx
"use client";
import { useState, useEffect } from 'react';
import BirthdayFireworks from './BirthdayFireworks';

const DigitalGift = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sarjak') {
      setIsAuthenticated(true);
      setIsLoading(true);
    } else {
      alert('Incorrect password. Try again!');
    }
  };

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const nextProgress = prev + 2;
          if (nextProgress >= 100) {
            clearInterval(interval);
            setIsLoading(false);
          }
          return nextProgress;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div style={styles.container}>
      {!isAuthenticated && !isLoading && (
        <div style={styles.formContainer}>
          <h1 style={styles.h1}>🎂 Enter Password to Unlock Your Gift 🎁</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Unlock
            </button>
          </form>
        </div>
      )}

      {isAuthenticated && isLoading && (
        <div style={styles.loadingContainer}>
          <h1 style={styles.h1}>Preparing Your Surprise...</h1>
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }}>
              <span style={styles.progressBarInner} />
            </div>
            <p style={styles.progressText}>{progress}%</p>
          </div>
        </div>
      )}

      {isAuthenticated && !isLoading && <BirthdayFireworks />}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #e09, #d0e)',
  },
  formContainer: {
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    textAlign: 'center' as 'center',
    maxWidth: '400px',
    width: '100%',
  },
  h1: {
    fontSize: '2.2rem',
    marginBottom: '20px',
    color: '#ffddff',
    textShadow: '2px 2px 10px rgba(0, 0, 0, 0.4)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '15px',
  },
  input: {
    padding: '15px',
    borderRadius: '10px',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  button: {
    padding: '15px',
    borderRadius: '10px',
    background: 'linear-gradient(90deg, #ff8c00, #ff0080)',
    color: '#fff',
    border: 'none',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #e09, #d0e)',
  },
  progressContainer: {
    width: '80%',
    maxWidth: '400px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '30px',
    overflow: 'hidden',
    marginTop: '20px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  progressBar: {
    height: '20px',
    background: 'linear-gradient(90deg, #ff8c00, #ff0080)',
    transition: 'width 0.4s ease-in-out',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
  },
  progressBarInner: {
    display: 'block',
    height: '100%',
    width: '100%',
    borderRadius: 'inherit',
    background: 'linear-gradient(90deg, rgba(255, 140, 0, 0.5), rgba(255, 0, 128, 0.5))',
    filter: 'blur(8px)',
  },
  progressText: {
    marginTop: '-25px',
    color: '#fff',
    fontWeight: 'bold',
    textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
  },
};

export default DigitalGift;
