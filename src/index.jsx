import React from "react";
import ReactDOM from "react-dom";
// import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
// import memoryUtils from "./utils/memoryUtils";
// import storageUtils from "./utils/storageUtils";
import store from "./redux/store";

//读取local中保存的user
/* const user = storageUtils.getUser();
memoryUtils.user = user; */

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  document.getElementById("root")
);
