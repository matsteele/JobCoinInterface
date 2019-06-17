import React, { useContext } from "react";
import styled from "@emotion/styled";

import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import { Store } from "../../../store/store";
import styleUtils from "utils/styles";

export const LogOutButton = () => {
  const { dispatch } = React.useContext(Store);
  
  const handleClick=()=>{
    dispatch({
      type: "RESET_STORE"
    })
  }
  return (
    <ButtonContainer as="div" labelPosition="right">
      <LogInStatus>
        <Icon name="check" size="large" />
        logged in
      </LogInStatus>
      <LogOutButtonLabel
        as={Link}
        to="/"
        color={styleUtils.emphasisRed}
        pointing="left"
        onClick={handleClick}
      >
        <LogOutText>log out</LogOutText>
        <LogOutIcon name="sign-out" size="large" />
      </LogOutButtonLabel>
    </ButtonContainer>
  );
}



// styles
const LogOutText: any = styled.p({
  marginBottom: 0
});

const LogInStatus: any = styled.div({
  color: styleUtils.lightGray
});

const ButtonContainer: any = styled.button({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});
const LogOutButtonLabel: any = styled.button({
  display: "flex",
  justifyContent: "space-around",
  width: "7em",
  fontSize: "14px",
  color: styleUtils.emphasisRed
});
const LogOutIcon: any = styled(Icon)({
  marginLeft: "0"
});
