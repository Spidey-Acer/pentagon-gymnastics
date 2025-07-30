// ErrorBoundary.tsx
import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service here
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Optional: Send error to logging service
    // logErrorToService(error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ color: "#dc3545", marginBottom: "16px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#6c757d", marginBottom: "20px" }}>
            We're sorry, but something unexpected happened.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>

          {/* Show error details in development */}
          {import.meta.env.DEV && (
            <details style={{ marginTop: "20px", textAlign: "left" }}>
              <summary style={{ cursor: "pointer", color: "#dc3545" }}>
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#495057",
                  overflow: "auto",
                  maxWidth: "80vw",
                }}
              >
                {this.state.error?.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// // Optional: Custom hook for functional components to trigger errors (for testing)
// export const useErrorHandler = () => {
//   return (error: Error, errorInfo?: string) => {
//     console.error("Manual error trigger:", error);
//     throw error;
//   };
// };

// // Optional: Higher-order component version
// export function withErrorBoundary<P extends object>(
//   WrappedComponent: React.ComponentType<P>,
//   fallback?: ReactNode
// ) {
//   const WithErrorBoundaryComponent = (props: P) => (
//     <ErrorBoundary fallback={fallback}>
//       <WrappedComponent {...props} />
//     </ErrorBoundary>
//   );

//   WithErrorBoundaryComponent.displayName = `withErrorBoundary(${
//     WrappedComponent.displayName || WrappedComponent.name
//   })`;

//   return WithErrorBoundaryComponent;
// }
