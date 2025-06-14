import React from "react";

const SharePage = async ({
  searchParams,
}: {
  searchParams: { slug?: string };
}) => {
  const slug = searchParams?.slug;
  if (!slug) return <h1>No Slug</h1>;
  return <div>Hello:{slug}</div>;
};

export default SharePage;
