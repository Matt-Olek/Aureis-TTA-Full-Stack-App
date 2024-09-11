import Axios from "../../utils/Axios";
import { useState } from "react";
const ConfigTests = () => {
  const launchmatching = async () => {
    const response = await Axios.post("launch_matching/");
    console.log(response.data);
  };
  return (
    <a className="btn btn-primary" onClick={launchmatching}>
      Lancer le matching
    </a>
  );
};
export default ConfigTests;
