import React, { useContext, useRef, useState, useEffect } from "react";

// helper files
import { Store } from "../../../store/store";
import { sumToDate, filterByDate } from "utils/helper_functions";
import * as i from "utils/types";

const HoverText = props => {
  const { state } = useContext<State>(Store);
  const [dateOfHover, setdateOfHover] = useState("");
  const [LastTransRecipientorSender, setLastTransRecipientorSender] = useState(
    ""
  );
  const [LastTransAmount, setLastTransAmount] = useState(0);
  const [totalToDate, settotalToDate] = useState(0);
  const { xTimeScale } = props.scales;
  const { xyCoordsOfMouseOnHover } = props;
  const dateRef = xTimeScale.invert(xyCoordsOfMouseOnHover[0]);

  useEffect(() => {
    if (props.axisType === "balance") {
      renderBalanceElements();
    } else if (props.axisType === "date") {
      renderDateElements();
    }
  }, [xyCoordsOfMouseOnHover]);

  const renderBalanceElements = () => {
    const totalToDate = sumToDate(
      dateRef,
      state.currentUser,
      state.transactions
    );
    settotalToDate(totalToDate);
    const TransactionsToDate = filterByDate(
      dateRef,
      state.currentUserTransactions
    );
    const LastTransaction = TransactionsToDate[TransactionsToDate.length - 2];
    const noTransactionsAvailableToProcess =
      typeof LastTransaction != "undefined";
    if (noTransactionsAvailableToProcess) {
      const LastTransRecipientorSender =
        typeof LastTransaction.fromAddress === "undefined"
          ? "deposit recieved from faucet or to the user themselves"
          : LastTransaction.fromAddress === state.currentUser
          ? LastTransaction.toAddress
          : LastTransaction.fromAddress;
      setLastTransRecipientorSender(LastTransRecipientorSender);
      const LastTransAmount = LastTransaction.amount;
      setLastTransAmount(LastTransAmount);
    }
  };
  const renderDateElements = () => {
    const timeStampObject = new Date(dateRef);
    const month = timeStampObject.toLocaleString("en-us", {
      month: "short"
    });
    const day = timeStampObject.getDate();
    // const y = timeStampObject //.getYear() //   .toString() //.slice(1);
    const h = ((timeStampObject.getHours() + 11) % 12) + 1;
    const AMPM = timeStampObject.getHours() > 12 ? "pm" : "am";
    const dateOfHover = month + " " + day + " " + " " + h + AMPM;
    setdateOfHover(dateOfHover);
  };

  return (
    <AxixContainer>
      <SVGwithOverflow
        viewBox={`0 0 ${props.svgWidth} ${props.svgHeight} `}
        width={props.svgWidth}
        height={props.svgHeight}
        id="graphSVG"
      >
        {props.focusIsOnGraph ? (
          <g>
            {props.axisType === "balance" ? (
              <>
                <text x={Math.round(xyCoordsOfMouseOnHover[0]) - 80} y={10}>
                  <tspan fill={styleUtils.lightGray}>total to date: </tspan>{" "}
                  {totalToDate}
                </text>
                <text x={Math.round(xyCoordsOfMouseOnHover[0]) - 80} y={30}>
                  <tspan fill={styleUtils.lightGray}>
                    {props.hoveredTransDirection === "up"
                      ? "last receipient"
                      : "last sender"}
                  </tspan>{" "}
                  {LastTransRecipientorSender}
                </text>
                <text x={xyCoordsOfMouseOnHover[0] - 80} y={45}>
                  <tspan fill={styleUtils.lightGray}>amount transfered:</tspan>{" "}
                  <tspan
                    fill={
                      props.hoveredTransDirection === "up"
                        ? styleUtils.addGreen
                        : styleUtils.emphasisRed
                    }
                  >
                    {props.hoveredTransDirection === "up" ? "+" : "-"}{" "}
                    {LastTransAmount}
                  </tspan>
                </text>
              </>
            ) : (
              <text x={Math.round(xyCoordsOfMouseOnHover[0]) - 80} y={25}>
                {dateOfHover}
              </text>
            )}
          </g>
        ) : (
          ""
        )}
      </SVGwithOverflow>
    </AxixContainer>
  );
};
export default HoverText;

//styles
import styleUtils from "utils/styles";
import styled from "@emotion/styled";

const AxixContainer: any = styled.div({
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "flex-end",
  marginRight: 50
});

const SVGwithOverflow: any = styled.svg`
  overflow: visible !important;
  fill: white;
`;

// types
interface iState {
  xyCoordsOfMouseOnHover: number;
  dateOfHover: string;
  LastTransRecipientorSender: string;
  LastTransAmount: number;
}

interface iProps {
  axisType: string;
  currentUser: string;
  svgHeight: number;
  focusIsOnGraph: boolean;
  svgWidth: number;
  scales: i.Scales;
  xyCoordsOfMouseOnHover: number[];
}
