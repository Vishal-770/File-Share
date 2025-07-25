import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Image src="/loading.gif" alt="loading" height={50} width={50} />
    </div>
  );
};

export default loading;
