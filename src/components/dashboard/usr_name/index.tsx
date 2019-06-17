import React from "react";
import { Store } from "../../../store/store";
import { LogOutButton } from "./log_out";

export default function index():JSX.Element {
  const { state } = React.useContext(Store);
  return (
    <UserInfoAndLogOut>
      <UserNameDisplay>user: {" "}  {state.currentUser}</UserNameDisplay>
      <LogOutButton/>
    </UserInfoAndLogOut>
  );
}

// STYLES
import styleUtils from "utils/styles";
import styled from "@emotion/styled";

const UserInfoAndLogOut: any = styled.nav({
  display: "flex",
  height: "18%",
  alignItems: "normal",
  alignSelf: "flex-start",
  justifyContent: "center",
  flexDirection: "column",
  marginLeft: 20,
});

const UserNameDisplay: any = styled.p({
  fontSize: 30,
  fontWeight: 5,
  color: styleUtils.darkGray,
  margin: 0,
  lineHeight: 1.5
});
