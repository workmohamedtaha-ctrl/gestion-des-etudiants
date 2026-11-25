import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
    };
  }

  static getDerivedStateFromError(error) {
    let readableMessage = "Une erreur inattendue s'est produite dans l'application.";
    if (error.message.includes('Missing or insufficient permissions')) {
      readableMessage =
        "Accès refusé par les règles de sécurité Firestore. Vérifiez que votre compte est authentifié et vérifié.";
    } else if (error.message) {
      readableMessage = error.message;
    }
    return {
      hasError: true,
      message: readableMessage,
    };
  }

  componentDidCatch(error, info) {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-xl p-8">
            <p className="text-xs font-medium text-red-700 mb-2">Erreur applicative</p>
            <h1 className="text-xl font-semibold text-slate-900 mb-3">
              Impossible d'afficher cette vue
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 break-words">
              {this.state.message}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Réessayer
              </button>
              <a
                href="/"
                className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
