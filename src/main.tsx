import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
// App styles and script
import "./styles/tailwind.css";
import "./index.scss";

import App from "./App";
import { store } from "./StoreV2/store";

// if (process.env.NODE_ENV === 'production') {
//   // @ts-ignore
//   import('../assets/fonts/fonts.prod.css')
// } else {
//   // @ts-ignore
//   import('../assets/fonts/fonts.dev.css')
// }

// Render App
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    ,
  </React.StrictMode>
);
