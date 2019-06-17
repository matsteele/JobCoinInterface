import React from "react";

const Balance = (props: iProps): JSX.Element => {
  const [balanceDidChange, setbalanceDidChange] = React.useState(false);
  const [balanceToShow, setbalanceToShow] = React.useState(props.balance);

  React.useEffect(() => {
    if (balanceToShow != props.balance) {
      setbalanceToShow(balanceToShow);
      setbalanceDidChange(true);
    }
  });


  return (
    <BalanceContainer data-test="balanceDiv">
      <LabelText>JOB COIN <br/>CURRENT BALANCE</LabelText>
      <BalanceFigureBackgroundDiv>
        <BalanceText
          color={
            balanceDidChange ? styleUtils.emphasisRed : styleUtils.basicGray
          }
        >
          {props.balance}
        </BalanceText>
      </BalanceFigureBackgroundDiv>
    </BalanceContainer>
  );
};

//styles
import styleUtils from "utils/styles";
import styled from "@emotion/styled";

const BalanceContainer: any = styled.div({
  display: "flex",
  height: 60,
  alignItems: "normal",
  flexDirection: "row",
  marginLeft: 50
});

export const LabelText: any = styled.p({
  color: "white",
  lineHeight: 1,
  alignSelf: "center",
  margin: 0,
  textAlign: "center",
  width: '100%'
});

export const BalanceText: any = styled.p(
  {
    fontSize: 16
  },
  props => ({
    color: props.color
  })
);

const BalanceFigureBackgroundDiv: any = styled.div({
  backgroundColor: "white",
  fontSize: 15,
  borderRadius: 8,
  height: "70%",
  alignSelf: "center",
  marginLeft: 20,
  padding: 6,
  display: "flex",
  alignItems: "center"
});

// types
interface iProps {
  balance: number;
}

export default Balance;
