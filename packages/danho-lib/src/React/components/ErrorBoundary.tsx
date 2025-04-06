// ErrorBoundary
import { Logger } from '@danho-lib/dium/api/logger';
import { React, Component, ErrorInfo } from '../React';
import { Text } from '@dium/components';

type ErrorBoundaryProps = {
  id?: string;
  children: React.ReactNode;
};
type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error('ErrorBoundary caught an error', { error, errorInfo });
  }

  render() {
    if (this.state.error) {
      const { message, stack } = this.state.error;
      const title = this.props.id ? `Error in ${this.props.id}` : 'Error';
      
      return (
        <div className="error-boundary">
          <Text variant='heading-lg/bold'>{title}</Text>
          <Text variant='text-md/normal'>{message}</Text>
          <Text variant='text-sm/normal'>{stack}</Text>
        </div>
      )
    }

    return this.props.children;
  }
}