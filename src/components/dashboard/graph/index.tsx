import React, { Component } from "react";
import * as d3 from "d3";
//helper files
import { sumToDate } from "utils/helper_functions";
import * as i from "utils/types";
import { Store } from "../../../store/store";
//components
import Transact from "../transact";
import MainGraph from "./main_chart";
import Balance, { LabelText } from "../balance";
import HoverText from "./hover_text";

export default class Graph extends Component<iProps, iState> {
  constructor(props: iProps) {
    super(props);
    this.state = {
      currentBalance: 0,
      focusIsOnGraph: false,
      isDataLoaded: false,
      xyCoordsOfMouseOnHover: [0,0],
      scales: {},
      hoveredTransDirection: ""
    };
    //qualities
    this.svgHeight = 425;
    this.svgWidth = innerWidth * 0.55;
    this.graphSvgTopBuffer = 20;
    this.axisHeight = 45;
    this.storeData = this.context;
    //methods
    this.createScales = this.createScales.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
    this.logMouseMovements = this.logMouseMovements.bind(this);
    this.setFocusIsOnGraph = this.setFocusIsOnGraph.bind(this);
    this.sethoveredTransDirection = this.sethoveredTransDirection.bind(this);
  }

  componentDidMount(): void {
    this.storeData = this.context.state;
    //build scales
    const scales = this.createScales(this.storeData.currentUserTransactions);
    //set balance
    const currentTime = Date.now();
    const currentBalance = sumToDate(
      currentTime,
      this.storeData.currentUser,
      this.storeData.transactions
    );

    this.setState({
      isDataLoaded: true,
      currentBalance,
      scales
    });
  }

  createScales(transactions: i.Transactions[]): object {
    const maxBalance = transactions.reduce(
      (max: number, trans: i.Transactions): number => {
        if (trans.sumForUser > max) {
          return trans.sumForUser;
        } else {
          return max;
        }
      },
      0
    );
    return {
      xTimeScale: d3
        .scaleTime()
        .range([0, this.svgWidth])
        .domain([
          new Date(transactions[0].timestamp),
          new Date(transactions[transactions.length - 1].timestamp)
        ]),
      yTransScale: d3
        .scaleLinear()
        .range([this.svgHeight, 0])
        .domain([0, maxBalance])
    };
  }

  logMouseMovements(xyCoordsOfMouseOnHover: number[]): void {
    this.setState({ xyCoordsOfMouseOnHover });
  }

  setFocusIsOnGraph(bool:boolean): void {
    this.setState({
      focusIsOnGraph: bool
    });
  }

  updateBalance(change: number): void {
    const newBalance = this.state.currentBalance - change;
    this.setState({ currentBalance: newBalance });
  }

  sethoveredTransDirection(hoveredTransDirection: string): void {
    this.setState({
      hoveredTransDirection
    });
  }

  render() {
    return (
      <>
        {!this.state.isDataLoaded ? (
          ""
        ) : (
          <>
            <NavBorder>
              <Balance balance={this.state.currentBalance} />
              <HoverText
                axisType={"balance"}
                svgHeight={this.axisHeight}
                focusIsOnGraph={this.state.focusIsOnGraph}
                svgWidth={this.svgWidth}
                scales={this.state.scales}
                hoveredTransDirection={this.state.hoveredTransDirection}
                xyCoordsOfMouseOnHover={this.state.xyCoordsOfMouseOnHover}
              />
            </NavBorder>
            <DashboardContainer>
              <Transact
                height={this.svgHeight}
                balance={this.state.currentBalance}
                updateBalance={this.updateBalance}
              />
              <StyledMainChart
                height={this.svgHeight}
                sethoveredTransDirection={this.sethoveredTransDirection}
                hoveredTransDirection={this.state.hoveredTransDirection}
                svgWidth={this.svgWidth}
                svgHeight={this.svgHeight}
                setFocusIsOnGraph={this.setFocusIsOnGraph}
                focusIsOnGraph={this.state.focusIsOnGraph}
                logMouseMovements={this.logMouseMovements}
                xyCoordsOfMouseOnHover={this.state.xyCoordsOfMouseOnHover}
                scales={this.state.scales}
              />
            </DashboardContainer>
            <NavBorder>
              <LabelText>DATE:</LabelText>
              <HoverText
                axisType={"date"}
                focusIsOnGraph={this.state.focusIsOnGraph}
                svgHeight={this.axisHeight}
                svgWidth={this.svgWidth}
                scales={this.state.scales}
                xyCoordsOfMouseOnHover={this.state.xyCoordsOfMouseOnHover}
              />
            </NavBorder>
          </>
        )}
      </>
    );
  }
  // types
  svgHeight: number;
  svgWidth: number;
  graphSvgTopBuffer: number;
  axisHeight: number;
  storeData: i.State;
}
//connect to store
Graph.contextType = Store;

interface iState {
  currentBalance: number;
  focusIsOnGraph: boolean;
  isDataLoaded: boolean;
  hoveredTransDirection: string;
  xyCoordsOfMouseOnHover: number[];
  scales: object;
}

interface iProps {}

//styles
import styleUtils from "utils/styles";
import styled from "@emotion/styled";

const DashboardContainer: any = styled.section(
  {
    display: "flex",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  props => ({
    height: props.height
  })
);

const StyledMainChart: any = styled(MainGraph)(
  {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  props => ({
    height: props.height
  })
);

const NavBorder: any = styled.div({
  backgroundColor: styleUtils.darkGray,
  display: "flex",
  height: 60,
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between"
});
