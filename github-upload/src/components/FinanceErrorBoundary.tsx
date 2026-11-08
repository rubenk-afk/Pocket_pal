import { Component, type ReactNode } from 'react';

// Do not silently overwrite unreadable finance records with empty defaults.
export class FinanceErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg space-y-4">
          <h1 className="text-2xl font-bold">Pocket Pal could not load</h1>
          <p>Saved data may be unreadable or browser storage may be unavailable. Your saved records have not been cleared. Enable site storage, then reload. If the problem persists, keep a copy of your browser storage before making changes.</p>
          <button className="rounded bg-primary px-4 py-2 text-primary-foreground" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </main>
    );
  }
}
