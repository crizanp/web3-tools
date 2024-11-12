// components/Sidebar.tsx

const tools = ["Dex Screener", "Token Checker", "Trending Tokens", "Latest Boosts"];

export default function Sidebar() {
  return (
    <nav className="sidebar">
      {tools.map((tool, index) => (
        <button key={index} className="sidebar-button">
          {tool}
        </button>
      ))}

      <style jsx>{`
        .sidebar {
          display: flex;
          flex-direction: column;
          background-color: #1f2937;
          padding: 1rem;
          border-radius: 0.5rem;
          gap: 1rem;
        }

        .sidebar-button {
          background-color: #374151;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        .sidebar-button:hover {
          background-color: #4b5563;
        }

        @media (max-width: 768px) {
          .sidebar {
            flex-direction: row;
            justify-content: space-around;
          }
        }
      `}</style>
    </nav>
  );
}
