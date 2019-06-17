import React, { useState, useContext, useRef } from "react";

// helper files
import { Store } from "../../../store/store";
import {fetchData } from "utils/apiCalls";
import * as i from "utils/types";
import { sumAndSortTransactions } from "utils/helper_functions";

// components
import { LogInForm, ErrorSpan } from "../../log_in";
import { StyledInputComp } from "../../../assets/input_comp";

const Transact = (props: iProps): JSX.Element => {
  const { state, dispatch } = useContext(Store);
  const [ifWriting, setIfWriting] = useState<boolean>(false);
  const [receivingJCoinAddr, setRecievingJCoinAddr] = useState<string>();
  const [amount2Send, setamount2Send] = useState<number>();
  const [helperText, setHelperText] = useState<JSX.Element>(<p />);
  const formRef = useRef(null);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const address = e.target.value;
    setRecievingJCoinAddr(address);
    const ifWritingCheck = address.length > 0;
    setIfWriting(ifWritingCheck);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setamount2Send(parseFloat(e.target.value));
  };

  const pushTransactionandPullData = (
    fromAddress: string,
    receivingJCoinAddr: string,
    amount2Send: string
  ): void => {
    console.log(
      "fromAddress",
      fromAddress,
      "toAddress",
      receivingJCoinAddr,
      "amount",
      amount2Send
    );

    const URL = "https://jobcoin.gemini.com/endurance/api/transactions";
    fetch(URL, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fromAddress: fromAddress,
        toAddress: receivingJCoinAddr,
        amount: amount2Send
      })
    })
      .then(function(data) {
        console.log("Request success: ", data);
        props.updateBalance(amount2Send);
        setamount2Send("");
        setRecievingJCoinAddr("");
        fetchData().then(function(transactionData: i.Transactions) {
          dispatch({
            type: "FETCH_DATA",
            payload: transactionData
          });
          const transactionsSummedByUser = sumAndSortTransactions(
            transactionData,
            state.currentUser
          );
          dispatch({
            type: "SET_USR_DATA",
            payload: transactionsSummedByUser
          });
          dispatch({
            type: "SET_NEW_TRANS",
            payload:
              transactionsSummedByUser[
                transactionsSummedByUser.length - 1
              ]
          });
        });
      })
      .catch(function(error) {
        console.log("Request failure: ", error);
      });
      formRef.current.reset()
  };

  const handleSubmit = (): void => {
    const isJCoinAddrValid = state.allUsers.includes(receivingJCoinAddr);
    const isAmountBelowBalance = amount2Send < props.balance;
    if (isJCoinAddrValid && isAmountBelowBalance) {
      pushTransactionandPullData(
        state.currentUser,
        receivingJCoinAddr,
        amount2Send.toString()
      );
      setHelperText(<p>transaction sent!</p>);
    } else {
      if (!isJCoinAddrValid) {
        setHelperText(<ErrorSpan>incorrect address, try again</ErrorSpan>);
      } else if (!isAmountBelowBalance) {
        setHelperText(<ErrorSpan>amount above balance, try again</ErrorSpan>);
      }
    }
  };

  const dropdownOptions = state.allUsers.map((user: string) => (
    <option key={user} value={user} />
  ));
  return (
    <LeftNav>
      <TransactContainer ref={formRef}>
        <TransactTitle>send jobcoin</TransactTitle>
        <StyledInputComp
          handleChange={handleAddressChange}
          ifWriting={ifWriting}
          input={"addresses"}
          list={"addresses"}
          options={dropdownOptions}
          placeholderText={"jobcoin address..."}
        />
        {helperText}
        <StyledInputComp
          handleChange={handleAmountChange}
          ifWriting={ifWriting}
          handleSubmit={handleSubmit}
          type={"number"}
          iconName={"send"}
          placeholderText={"amount..."}
        />
      </TransactContainer>
    </LeftNav>
  );
};
export default Transact;

import styleUtils from "utils/styles";
import styled from "@emotion/styled";
import { BalanceText } from "../balance";

const LeftNav = styled.nav`
  height: 100%;
  width: 24%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
`;

const TransactTitle: any = styled(BalanceText)({
  alignSelf: "center"
});

const TransactContainer: any = styled(LogInForm)({
  marginLeft: "5em",
  marginBottom: "10em",
  width: "18em",
  backgroundColor: styleUtils.darkGray,
  color: "white"
});

//types
interface iProps {
  height: number;
  balance: number;
  updateBalance(amount2Send: number): void;
}
