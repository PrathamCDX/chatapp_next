import { LineWave, TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <TailSpin
        visible={true}
        height="20"
        width="20"
        color="#FFFFFF"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;
