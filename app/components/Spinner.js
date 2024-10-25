// components/Spinner.js
import { PuffLoader } from "react-spinners"; // Using PuffLoader as the spinner

const Spinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <PuffLoader color="#36D7B7" loading={loading} size={150} />
    </div>
  );
};

export default Spinner;
