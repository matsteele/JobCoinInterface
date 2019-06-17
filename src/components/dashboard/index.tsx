import React from "react";

import UsrName from "./usr_name";
import Graph from "./graph";
import JobCoinLogo from "../../assets/job_coin_logo";

const Dashboard = () => {

  return (
    <Container>
      <Global styles={globalStyles} />
      <UsrName />
      <JobCoinLogo
        scale={50}
        backgroundColor={"lightgrey"}
        emphasisColor={"red"}
        dashboard={true}
      />
      <Graph />
    </Container>
  );
};

//styles
import styled from "@emotion/styled";
import { Global, css } from "@emotion/core";

const globalStyles = css`
  body {
    background-color: white;
  }
`;

const Container: any = styled.section({
  display: "flex",
  height: "100%",
  width: "100%",
  alignItems: "center",
  justifyContent: "flex-start",
  flexDirection: "column"
});

export default Dashboard;
