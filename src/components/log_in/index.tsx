import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
// helper files
import styleUtils from "utils/styles";
import * as i from "utils/types";
import { Store } from "../../store/store";
import { fetchData } from "utils/apiCalls";
import { sumAndSortTransactions } from "utils/helper_functions";
// components
import JobCoinLogo from "../../assets/job_coin_logo";
import { StyledInputComp } from "../../assets/input_comp";

const LogIn = (): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const [ifWriting, setIfWriting] = useState<boolean>(false);
  const [isJCoinAddrValid, setisJCoinAddrValid] = useState<boolean>(false);
  const [JCoinAddr, setJCoinAddr] = useState<string>("");
  const [helperText, sethelperText] = useState<any>(
    <span>sign in with your jobcoin address</span>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const text = e.target.value;
    setJCoinAddr(text);
    const ifWritingCheck = text.length > 0;
    setIfWriting(ifWritingCheck);
  };

  const handleSubmit = (): void => {
    let isJCoinAddrValid = state.allUsers.includes(JCoinAddr);
    if (isJCoinAddrValid) {
      dispatch({
        type: "SET_USR",
        payload: JCoinAddr
      });
      const transactionsSummedByUser = sumAndSortTransactions(
        state.transactions,
        JCoinAddr
      );
      dispatch({
        type: "SET_USR_DATA",
        payload: transactionsSummedByUser
      });
      dispatch({
        type: "SET_NEW_TRANS",
        payload: transactionsSummedByUser[transactionsSummedByUser.length - 1]
      });
      setisJCoinAddrValid(true);
    } else {
      sethelperText(<ErrorSpan>incorrect address, try again</ErrorSpan>);
    }
  };

  useEffect(() => {
    if (state.transactions.length === 0) {
      fetchData().then(function(transactionData: i.Transactions): void {
        dispatch({
          type: "FETCH_DATA",
          payload: transactionData
        });
      });
    }
  });

  return (
    <Section>
      <JobCoinLogo
        dashboard={false}
        scale={100}
        backgroundColor={ifWriting ? styleUtils.basicGray : "white"}
        emphasisColor={ifWriting ? styleUtils.darkGray : styleUtils.emphasisRed}
      />
      <LogInForm
        backgroundColor={ifWriting ? styleUtils.basicGray : "white"}
        data-test="LogInForm"
      >
        <Text color={ifWriting ? "white" : "darkgray"}>
          welcome {JCoinAddr}!
        </Text>
        <StyledInputComp
          handleChange={handleChange}
          ifWriting={ifWriting}
          handleSubmit={handleSubmit}
          iconName={"sign-in"}
          placeholderText={"jobcoin address..."}
        />
        <Text color={ifWriting ? "white" : "darkgray"}>{helperText}</Text>
      </LogInForm>
      {isJCoinAddrValid ? <Redirect to="/dashboard" /> : ""}
    </Section>
  );
};

export default LogIn;

//styles
import styled from "@emotion/styled";

const Section = styled.section`
  height: 25em;
  width: 20em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: center;
`;

export const LogInForm: any = styled.form(
  {
    boxShadow: "0 1px 10px #000000ad",
    height: "12em",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  props => ({
    backgroundColor: props.backgroundColor
  })
);

export const ErrorSpan = styled.span`
  color: red;
  font-weight: bold;
`;

export const Text: any = styled.p(
  {
    fontSize: 13
  },
  props => ({
    color: props.color
  })
);
