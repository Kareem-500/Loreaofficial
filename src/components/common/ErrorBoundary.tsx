import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LORÉA Application caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F4EF] text-[#1D1D1B] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full border border-[#BA945A]/40 bg-white p-8 shadow-sm">
            <h1 className="font-serif text-3xl font-light mb-3 text-[#1D1D1B]">LORÉA</h1>
            <p className="text-xs uppercase tracking-widest text-[#BA945A] mb-4">
              Atelier Notification · إشعار الأتيليه
            </p>
            <p className="text-sm text-[#7C746B] font-light mb-6 leading-relaxed">
              We encountered a minor display hiccup while loading the atelier experience.
              <br />
              <span className="text-xs text-[#9B948C]">
                حدث خطأ أثناء تحميل التجربة، اضغطي على الزر أدناه لإعادة المحاولة.
              </span>
            </p>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#1D1D1B] text-white hover:bg-[#BA945A] text-xs uppercase tracking-[0.2em] transition-colors font-medium cursor-pointer"
            >
              Refresh Atelier · تحديث
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
