import React from "react";

import styled from "@emotion/styled";
import styleUtils from "utils/styles";
import { Input, Icon } from "semantic-ui-react";


export const StyledInputComp = props => (
  <>
    <StyledInput
      onChange={e => props.handleChange(e)}
      onKeyDown={e => {
        if (e.key === "Enter") {
          props.handleSubmit();
        }
      }}
      value={props.value}
      list={props.list}
      type={props.type}
      min="0"
      icon={
        props.iconName ? (
          <Icon
            color={props.ifWriting ? "red" : "grey"}
            name={props.iconName}
            inverted
            bordered
            link
            onClick={props.handleSubmit}
          />
        ) : (
          ""
        )
      }
      placeholder={props.placeholderText}
    />
    {props.list ? <datalist id={props.list}>{props.options}</datalist> : ""}
  </>
);

const StyledInput = styled(Input)`
  & > input {
    height: 1em;
    padding: 0;
    &:focus {
      border: 1px solid ${styleUtils.emphasisRed} !important;
    }
  }
`;

