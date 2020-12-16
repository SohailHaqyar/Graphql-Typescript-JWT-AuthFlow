import React from "react";
import { useUsersQuery } from "../generated/graphql";

interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: "network-only" });
  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h2>Users</h2>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            <span>{user.id}</span>
            <p>{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
