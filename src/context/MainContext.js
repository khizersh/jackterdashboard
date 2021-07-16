import React, { useContext } from "react";

export const MainContext = React.createContext(null);

export default function GameProvider({ children }) {
  const [mainState, setMainState] = React.useState({
    loader: false,
  });

  function setLoader(data) {
    let stateClone = mainState;
    setMainState({
      ...stateClone,
      loader: data,
    });
  }

  let data = {
    setLoader,
    mainState,
  };
  return <MainContext.Provider value={data}>{children}</MainContext.Provider>;
}
