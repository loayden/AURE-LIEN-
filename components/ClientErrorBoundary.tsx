"use client";

import { Component, type ReactNode } from "react";

interface ClientErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ClientErrorBoundaryState {
  hasError: boolean;
}

export default class ClientErrorBoundary extends Component<
  ClientErrorBoundaryProps,
  ClientErrorBoundaryState
> {
  state: ClientErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Keep non-critical client widgets from tearing down the full route.
    console.error("Client boundary captured an error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
