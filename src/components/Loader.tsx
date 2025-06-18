import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Image src="/loading.gif" alt="loading" height={50} width={50} />
    </div>
  );
};

export default Loader;
