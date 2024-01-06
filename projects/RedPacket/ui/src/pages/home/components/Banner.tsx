import React from "react";

const Banner = React.memo(({ className }) => {
  return (
    <div className={`flex flex-col items-center text-white ${className}`}>
      <div className="text-8xl mb-4">RED-PAKECT</div>
      <div>Let me see see who is the Luck man</div>
      <div>This is a war of luck</div>
    </div>
  );
});
export default Banner;
