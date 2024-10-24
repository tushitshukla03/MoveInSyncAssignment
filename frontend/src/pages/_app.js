// pages/_app.js

import '../styles/globals.css'; 
import Layout from '../components/Layout';
import { Provider } from 'react-redux';
import { store, persistor } from '../utils/store'; // Import store and persistor
import { PersistGate } from 'redux-persist/integration/react';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <Layout>
      <Component {...pageProps} />
    </Layout></PersistGate></Provider>
  );
}

export default MyApp;
