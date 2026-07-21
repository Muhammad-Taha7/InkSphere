import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.jsx';

// 1. Redux Provider aur Store import karein
import { Provider } from 'react-redux';
import store from './Website/Store/Store.jsx';
import { SocketProvider } from './Website/Context/SocketProvider.jsx';
import { ThemeProvider } from './Website/Context/ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Redux Provider aur SocketProvider se App ko wrap karein */}
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);