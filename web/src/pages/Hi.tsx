import React from "react";
import { getAccessToken } from "../accessToken";
import { useHelloQuery } from "../generated/graphql";

export const Hi: React.FC = () => {
  const { data, loading, error } = useHelloQuery({
    fetchPolicy: "network-only",
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
    console.log(localStorage.getItem("token"));
    return <div>Error </div>;
  }
  console.log(getAccessToken());
  return (
    <div>
      <h1>{data?.hello}</h1>
    </div>
  );
};
