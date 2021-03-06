import React, { Component } from "react";

import ButtonGroup from "./button-group";
import MiddleGroup from "./middle-group";
import LogoGroup from "./logo-group";
import { StyleRoot } from "radium";
import "./fonts.css";

const ConsentOverlay = ({ status, giveConsent, denyConsent }) => {
  return (
    <StyleRoot>
      <div style={style.ConsentOverlayStyle}>
        <div style={style.blueBar} />
        <div style={style.consentInner}>
          <LogoGroup />
          <MiddleGroup />
          <ButtonGroup giveConsent={giveConsent} denyConsent={denyConsent} />
        </div>
      </div>
    </StyleRoot>
  );
};

const style = {
  ConsentOverlayStyle: {
    overflow: "hidden",
    bottom: 0,
    left: 0,
    right: 0,
    position: "fixed",
    backgroundColor: "#ffffff",
    textAlign: "center",
    height: 300,
    "@media (max-width: 1200px)": {
      height: 200
    }
  },
  consentInner: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 300,
    "@media (max-width: 1200px)": {
      flexDirection: "column",
      height: 200
    }
  },
  blueBar: {
    top: 0,
    height: 6,
    width: "100%",
    borderBottom: "solid 6px #088ffc"
  }
};

export default ConsentOverlay;
