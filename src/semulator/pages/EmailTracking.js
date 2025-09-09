import { useParams } from "react-router-dom";
const EmailTracking = () => {
 const { tracking_id } = useParams();
  console.log(tracking_id);

  return <div>Tracking ID: {tracking_id}</div>;
}

export default EmailTracking;



