import React from "react";

const SharePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) => {
  const { slug } = await searchParams;
  return <div>Hello:{slug}</div>;
};

export default SharePage;
