/**
 * Created by saharmehrpour on 9/6/17.
 */


import React, {Component} from 'react';
import '../App.css';
import FaArrowLeft from 'react-icons/lib/fa/arrow-left';
import FaArrowRight from 'react-icons/lib/fa/arrow-right';
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {connect} from "react-redux";
import {clickedOnBack, clickedOnForward} from "../actions";


export class NavBar extends Component {

    render() {
        return (
            <Navbar inverse collapseOnSelect
                    style={{backgroundColor: "transparent", backgroundImage: "none", border: "none"}}>
                <Navbar.Header>
                    <Nav>
                        <NavItem eventKey={1} className={this.props.backDisable} id="back_button"
                                 onClick={() => this.props.backClick(this.props)}>
                            <FaArrowLeft size={20}/>
                        </NavItem>
                        <NavItem eventKey={2} className={this.props.forwardDisable} id="forward_button"
                                 onClick={() => this.props.forwardClick(this.props)}>
                            <FaArrowRight size={20}/>
                        </NavItem>
                    </Nav>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav
                        onSelect={key => {
                            window.location.hash = (key === 1) ? "#/index" : (key === 2) ? "#/rules"
                                : (key === 3) ? "#/violatedRules" : (key === 4) ? "#/genRule" : "#/index"
                        }}>
                        <NavItem eventKey={1}>
                            Table of Content
                        </NavItem>
                        <NavItem eventKey={2}>
                            All Rules
                        </NavItem>
                        <NavItem eventKey={3}>
                            Violated Rules
                        </NavItem>
                        <NavItem eventKey={4}>
                            Generate Rules
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

}

// map state to props
function mapStateToProps(state) {
    return {
        history: state["hashManager"]["history"],
        activeHash: state["hashManager"]["activeHash"],
        forwardDisable: state["hashManager"]["forwardDisable"],
        backDisable: state["hashManager"]["backDisable"]
    };
}

function mapDispatchToProps(dispatch) {
    return {
        backClick: (props) => {
            if (props.activeHash > 0) {
                dispatch(clickedOnBack());
                window.location.hash = props.history[props.activeHash - 1];
            }
        },
        forwardClick: (props) => {
            if (props.activeHash < props.history.length - 1) {
                dispatch(clickedOnForward());
                window.location.hash = props.history[props.activeHash + 1];
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);