import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import { useLoginMutation } from "../generated/graphql";

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useLoginMutation();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await login({
          variables: {
            email,
            password,
          },
        });
        console.log(response);
        if (response && response.data) {
          setAccessToken(response.data.login.accessToken!);
        }
        history.push("/hi");
      }}
    >
      <h2>Login Form</h2>
      <div>
        <input
          type="text"
          value={email}
          placeholder="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
