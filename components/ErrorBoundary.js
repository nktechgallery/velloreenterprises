'use client';

import { Component } from 'react';
import { Button } from '@/components/ui';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-card">
            <div className="empty-orb mx-auto">!</div>
            <h2 className="font-display text-3xl font-bold mt-4">Something went wrong</h2>
            <p className="mt-4 text-white/55 leading-7 max-w-md mx-auto">
              {this.props.fallbackMessage || 'An unexpected error occurred. Please try refreshing the page.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn btn-primary"
              >
                Try again
              </button>
              <Button href="/" variant="secondary">Go home</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
