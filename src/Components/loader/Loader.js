import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../context/MainContext";
import loading from "../../utility/images/loading.jpg";
// import '../public/icons/logo_white.png'
import "./Loader.css";

const Loader = () => {
  const { setLoader, mainState } = useContext(MainContext);
  const [loader, setloader] = useState(false);

  useEffect(() => {
    setloader(mainState.loader);
  }, [mainState.loader]);
  return (
    <>
      {loader ? (
        <div className="wrapper">
          <div id="overlay2" style={{ zIndex: 9999999, display: "block" }}>
            <div id="loader" className="nfLoader">
              <img src={loading} width="40px" alt="" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Loader;
