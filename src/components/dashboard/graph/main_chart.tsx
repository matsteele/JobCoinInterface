import React, { useContext, useRef, useState, useEffect } from "react";
import * as d3 from "d3";

import { Store } from "../../../store/store";
import { filterByDate } from "utils/helper_functions";

import * as i from "utils/types";

const MainChart = (props: iProps): JSX.Element => {
  const { state } = useContext(Store);
  const [parsedPathData, setparsedPathData] = useState<any>("");
  const [parsedCurvedPathData, setparsedCurvedPathData] = useState<any>("");
  const [parsedPathData_NewTrans, setparsedPathData_NewTrans] = useState<any>("");
  const [parsedPathLast2Trans, setparsedPathLast2Trans] = useState<any>("");
  const [mouseX, setmouseX] = useState(0);
  const [IsScaleBuilt, setIsScaleBuilt] = useState(false);

  const ref = useRef(null);
  const { xTimeScale, yTransScale } = props.scales;


 

  useEffect(() => {
    buildAxis();
  }, []);

  useEffect(() => {
    const lineDataParser = buildLineDataParser();
    //all transactions
    const parsedPathData = lineDataParser(state.currentUserTransactions);
    setparsedPathData(parsedPathData);
    //all transactions curved
    const curvedlineDataParser = buildLineDataParserCurved();
    const _parsedCurvedPathData = curvedlineDataParser(
      state.currentUserTransactions
    );
    setparsedCurvedPathData(_parsedCurvedPathData);
    //new transactions
    const parsedPathData_NewTrans = lineDataParser(state.newTransactions);
    setparsedPathData_NewTrans(parsedPathData_NewTrans);
  }, [state.newTransactions]);

  useEffect(() => {
    const lineDataParser = buildLineDataParser();
    //mouse over transactions
    const Last2TransMousedOver = trackLastTransaction();
    const _parsedPathLast2Trans = lineDataParser(Last2TransMousedOver);
    setparsedPathLast2Trans(_parsedPathLast2Trans);
    //color transHover
    if (typeof Last2TransMousedOver[1] != "undefined") {
      const transAmountDiff =
        Last2TransMousedOver[1].sumForUser -
        Last2TransMousedOver[0].sumForUser;
      if (transAmountDiff < 0) {
        props.sethoveredTransDirection("down");
      } else if (transAmountDiff > 0) {
        props.sethoveredTransDirection("up");
      }
    }
    return () => {
      setparsedPathLast2Trans("");
    };
  }, [mouseX]);


  const buildLineDataParser = () => {
    const lineDataParser = d3
      .line()
      .x(d => {
        return xTimeScale(new Date(d.timestamp));
      })
      .y(d => {
        return yTransScale(parseFloat(d.sumForUser));
      });
    return lineDataParser;
  };

  const buildLineDataParserCurved = () => {
    const lineDataParser = d3
      .line()
      .x(d => {
        return xTimeScale(new Date(d.timestamp));
      })
      .y(d => {
        return yTransScale(parseFloat(d.sumForUser));
      })
      .curve(d3.curveCatmullRom);
    return lineDataParser;
  };

  const buildAxis = () => {
    if (IsScaleBuilt === false) {
      var axis = d3.axisRight(yTransScale);
      const svg = d3.select(ref.current);
      svg
        .append("g")
        .attr("transform", `translate(${props.svgWidth + 30},0)`)
        .attr("height", 30)
        .attr("width", 1440)
        .attr("opacity", 0.5)
        .call(axis);
      setIsScaleBuilt(true);
    }
  };

  const handleMouseMove = e => {
    props.setFocusIsOnGraph(true);
    const updateMouseCoordinatesForAxisDisplay = (): void => {
      const chartSVG = document.getElementById("chartSVG");
      let pt = chartSVG.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(chartSVG.getScreenCTM().inverse());
      setmouseX(svgP.x);
      props.logMouseMovements([svgP.x, svgP.y]);
    };
    updateMouseCoordinatesForAxisDisplay();
  };

  const trackLastTransaction = () => {
    const dateRef = xTimeScale.invert(mouseX);
    const TransactionsToDate = filterByDate(
      dateRef,
      state.currentUserTransactions
    );
    const lastTwoTransactionsToDate = TransactionsToDate.slice(TransactionsToDate.length - 2);
    return lastTwoTransactionsToDate;
  };

  return (
    <GraphContainer>
      <SVGwithOverflow
        ref={ref}
        viewBox={`0 0 ${props.svgWidth} ${props.svgHeight} `}
        width={props.svgWidth}
        height={props.svgHeight}
        id="chartSVG"
        overflow={"visible"}
        onMouseMove={e => handleMouseMove(e)}
        onMouseEnter={() => props.setFocusIsOnGraph(true)}
        onMouseLeave={() => props.setFocusIsOnGraph(false)}
      >
        <StyledPath
          d={parsedPathData}
          opacity={"0.4"}
          color={styleUtils.darkGray}
        />
        <StyledPath
          d={parsedCurvedPathData}
          opacity={"0.2"}
          color={styleUtils.darkGray}
        />
        <StyledPath
          d={parsedPathData_NewTrans}
          opacity={"1"}
          color={styleUtils.emphasisRed}
        />
        <text
          x={props.svgWidth}
          y={props.svgHeight / 2}
          opacity={0.75}
          transform={`rotate(90,${props.svgWidth + 60},${props.svgHeight / 2})`}
        >
          job coin balance
        </text>
        {props.focusIsOnGraph ? (
          <>
            <StyledPath
              d={parsedPathLast2Trans}
              opacity={"1"}
              color={
                props.hoveredTransDirection === "up"
                  ? styleUtils.addGreen
                  : styleUtils.emphasisRed
              }
            />
            <MouseCursorVerticleLine
              x1={mouseX}
              y1={0}
              x2={mouseX}
              y2={props.svgHeight}
            />
          </>
        ) : (
          ""
        )}
      </SVGwithOverflow>
    </GraphContainer>
  );
};

export default MainChart;

//styles
import styleUtils from "utils/styles";
import styled from "@emotion/styled";

const GraphContainer: any = styled.div({
  display: "flex",
  width: "100%",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "flex-end",
  marginRight: 80
});

const SVGwithOverflow: any = styled.svg`
  overflow: visible !important;
  margin: 10px;
`;

const StyledPath: any = styled.path(
  {
    fill: "none",
    strokeWidth: 5
  },
  props => ({
    stroke: props.color
  })
);
const MouseCursorVerticleLine: any = styled.line({
  stroke: styleUtils.lightGray
});

// types
interface iProps {
  height: number;
  transactionData: i.Transactions[];
  svgWidth: number;
  svgHeight: number;
  focusIsOnGraph:boolean;
  sethoveredTransDirection(direction:string):void;
  setFocusIsOnGraph(bool:boolean):void;
  logMouseMovements(xyCoordsOfMouseOnHover: number[]): void;
  xyCoordsOfMouseOnHover: number;
  scales: i.Scales;
}
