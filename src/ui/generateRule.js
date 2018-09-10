/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component} from 'react';
import {connect} from "react-redux";
import '../App.css';

import {DropdownButton, MenuItem, HelpBlock} from 'react-bootstrap';
import {FormControl, Label, Button, FormGroup, ButtonToolbar} from 'react-bootstrap';
import {Row, Col} from 'react-bootstrap';
import TiDelete from 'react-icons/lib/ti/delete';

import XPathGenerator from './ruleGen/xPathGenerator';
import Utilities from "../core/utilities";
import {constants} from "./constants";


class GenerateRule extends Component {

    constructor() {
        super();

        this.state = JSON.parse(JSON.stringify(constants.initial_state));
        this.state.availableTags = [];

    }

    render() {
        return (
            <div>
                {this.renderForm()}
                <XPathGenerator key={new Date()} state={this.state}/>

                <div>
                    <div style={{width: 200, float: "left", paddingRight: "5px"}}>
                        <Button bsStyle="primary" block onClick={() => this.submitNewRule()}>Submit</Button>
                    </div>
                    <div style={{width: 200, float: "left"}}>
                        <Button bsStyle="default" block onClick={() => this.clearForm()}>Clear Form</Button>
                    </div>
                </div>
            </div>
        );
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) !== JSON.stringify(this.state))
            this.setState({availableTags: nextProps.availableTags});
    }

    /**
     * render the form about rule title, description, tags, files, etc.
     * @returns {XML}
     */
    renderForm() {
        return (
            <div>
                <FormGroup validationState={(this.state.index === "") ? "error" : "success"}>
                    <div style={{padding: "10px 5px"}}>
                        <h4>Rule Index</h4>
                        <HelpBlock>The index is a key ID of the rule. It needs to be a unique integer.</HelpBlock>
                        <FormControl type="number" placeholder="Index" value={this.state.index}
                                     onChange={(e) => this.setState({index: e.target.value})}/>
                    </div>
                </FormGroup>
                <FormGroup validationState={(this.state.title === "") ? "error" : "success"}>
                    <div style={{padding: "10px 5px"}}>
                        <h4>Rule Title</h4>
                        <HelpBlock>Specify the rule title.</HelpBlock>
                        <FormControl componentClass="textarea" placeholder="Title"
                                     value={this.state.title}
                                     onChange={(e) => {
                                         this.setState({title: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </div>
                </FormGroup>
                <FormGroup>
                    <div style={{padding: "10px 5px"}}>
                        <h4>Rule Description</h4>
                        <HelpBlock>More high level details about the rule.</HelpBlock>
                        <FormControl componentClass="textarea" placeholder="Description"
                                     value={this.state.description}
                                     onChange={(e) => {
                                         this.setState({description: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </div>
                </FormGroup>
                <FormGroup>
                    <div style={{padding: "10px 5px", clear: "both"}}>
                        <h4>Rule Tags</h4>
                        <HelpBlock>Select the tags associated with this rule.</HelpBlock>
                        <div>{this.renderTags()}</div>
                    </div>
                </FormGroup>
                <FormGroup
                    validationState={(this.state.folderConstraint === "" || (this.state.folderConstraint === "FOLDER" && this.state.filesFolders.length === 0)) ? "error" : "success"}>
                    <div style={{padding: "10px 5px", clear: "both"}}>
                        <h4>Files/Folders</h4>
                        <HelpBlock>Select how the rules are verified; 'NONE' if the rule is verified on all files
                            and folders,
                            'FOLDER' if the rule is checked on specific folders/files. If the restriction is
                            'FOLDER',
                            at least one folder/file must be specified.</HelpBlock>
                        <div>{this.renderFileConstraints()}</div>
                    </div>
                </FormGroup>
            </div>
        );
    }


    /**
     * clear form
     */
    clearForm() {
        this.setState(JSON.parse(JSON.stringify(constants.initial_state)));
    }


    submitNewRule() {
        let rule = {
            index: this.state.index,
            ruleTitle: this.state.title,
            description: this.state.description,
            tags: this.state.tags,
            ruleType: {
                constraint: this.state.folderConstraint,
                checkFor: this.state.filesFolders.filter((d) => d !== ""),
                type: "WITHIN"
            },
            quantifier: {},
            constraint: {}
        };

        if (rule.index === "" || rule.ruleTitle === "" || rule.description === "") {
            console.log("empty fields");
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            console.log("folder constraints are not specified");
            return;
        }

        switch (this.state.xPathState.ruleType) {
            case "selected from one class":
                rule.quantifier = {detail: this.state.quantifierDetail, command: this.state.xPathState.q0};
                rule.ruleType.type = "WITHIN";
                break;
            case "selected from one class which is directed from another class":
                rule.quantifier = {
                    type: "FIND_FROM_TEXT",
                    detail: this.state.xPathState.quantifierDetail,
                    command1: this.state.xPathState.q0,
                    command2: this.state.xPathState.q1
                };
                rule.ruleType.type = "MIXED";
                break;
            case "selected from one class with the help of another class":
                rule.quantifier = {
                    type: "RETURN_TO_BASE",
                    detail: this.state.xPathState.quantifierDetail,
                    command1: this.state.xPathState.q0,
                    command2: this.state.xPathState.q1,
                    command3: this.state.xPathState.q2
                };
                rule.ruleType.type = "MIXED";
                break;
            default:
                console.log("quantifier is not specified");
                return;

        }

        switch (this.state.xPathState.cRuleType) {
            case "selected from one class":
                rule.constraint = {detail: this.state.xPathState.constraintDetail, command: this.state.xPathState.c0};
                break;
            case "selected from one class which is directed from another class":
                rule.constraint = {
                    type: "FIND_FROM_TEXT",
                    detail: this.state.xPathState.constraintDetail,
                    command1: this.state.xPathState.c0,
                    command2: this.state.xPathState.c1
                };
                break;
            case "selected from one class with the help of another class":
                rule.constraint = {
                    type: "RETURN_TO_BASE",
                    detail: this.state.xPathState.constraintDetail,
                    command1: this.state.xPathState.c0,
                    command2: this.state.xPathState.c1,
                    command3: this.state.xPathState.c2
                };
                break;
            default:
                console.log("condition is not specified");
                return;

        }

        Utilities.sendToServer(this.props.ws, "NEW_RULE", rule);
        this.clearForm();
    }

    /**
     * create a dropdown for tags
     */
    renderTags() {
        return (
            <div>
                <div style={{paddingBottom: "10px"}}>
                    <DropdownButton title={"Select Tags"} id={"drop_down"}>
                        {this.state.availableTags.map((el, i) => {
                            if (this.state.tags.indexOf(el.tagName) === -1)
                                return (
                                    <MenuItem eventKey={el.tagName} key={i}
                                              onSelect={(evt) => {
                                                  const tags = this.state.tags;
                                                  tags.push(evt);
                                                  this.setState({tags})
                                              }}
                                    >{el.tagName}
                                    </MenuItem>);
                            return (null);
                        })}
                    </DropdownButton>
                </div>
                <div>
                    {this.state.tags.map((d, i) => {
                        return (
                            <div style={{float: "left", margin: "0 15px 10px 0"}} key={i}>
                                <Label>{d}</Label>
                                <TiDelete size={23}
                                          className={"tiDelete"}
                                          onClick={() => {
                                              const tags = this.state.tags;
                                              tags.splice(i, 1);
                                              this.setState({tags});
                                          }}/>
                            </div>)
                    })}
                </div>
            </div>
        )
    }


    /**
     * inline XPath generator
     * didn't work
     * requires initial this.state.children = []
     * @returns {XML}
     */
    // testRenderGrammar() {
    //     return (
    //         <div>
    //             Class WHERE[
    //             {this.state.children.map((cons) =>
    //                 constants.grammar_code_fragment[cons].restrictions.map((res) => {
    //                     if (res === "WHERE") {
    //
    //                     }
    //                     else {
    //                         res.value.map((el, j) => {
    //                             if (Array.isArray(el)) {
    //                                 return (
    //                                     <DropdownButton
    //                                         title={el[0]}
    //                                         key={j}
    //                                         id={"dropdown"}>
    //                                         {el.map((item, i) => {
    //                                             if (i > 0)
    //                                                 return (<MenuItem eventKey={i}>{item}</MenuItem>)
    //                                         })}
    //                                     </DropdownButton>
    //                                 )
    //                             }
    //                             if (el === "textbox")
    //                                 return (<input type={"text"} className={"inputText"} key={j}/>);
    //                             if (el === "WHERE")
    //                                 return (<span>WHERE [ ]</span>);
    //                             return (<span key={j}>{el}</span>)
    //                         })
    //                     }
    //                 })
    //             )}
    //
    //
    //             {this.state.children.length === 0 ? (
    //                 <Dropdown id={"drop_down"}>
    //                     <CustomToggle bsRole="toggle">
    //                         <MdAddBox size={25} className={"mdAddBox"}/>
    //                     </CustomToggle>
    //                     <CustomMenu bsRole="menu">
    //                         {Object.keys(constants.grammar_code_fragment["Class"]["WHERE"]).map((key, i) => {
    //                             return (
    //                                 <MenuItem eventKey={key} key={i}
    //                                           onSelect={(evt) => {
    //                                               this.state.children.push(evt);
    //                                               this.setState({...this.state});
    //                                           }}>
    //                                     {key}
    //                                 </MenuItem>);
    //                         })}
    //                     </CustomMenu>
    //                 </Dropdown>
    //
    //             ) : (
    //                 <Dropdown id={"drop_down"}>
    //                     <CustomToggle bsRole="toggle">
    //                         <MdAddBox size={25} className={"mdAddBox"}/>
    //                     </CustomToggle>
    //                     <CustomMenu bsRole="menu">
    //                         <MenuItem eventKey={"AND"}>{"AND"}</MenuItem>
    //                         <MenuItem eventKey={"OR"}>{"OR"}</MenuItem>
    //                     </CustomMenu>
    //                 </Dropdown>
    //             )}
    //             ]
    //         </div>
    //     )
    // }

    /**
     * render the drop down for the file/folder constraint
     */
    renderFileConstraints() {
        return (
            <div>
                <div style={{paddingBottom: "10px"}}>
                    <em>{"Restriction:   "}</em>
                    <ButtonToolbar>
                        <DropdownButton
                            title={this.state.folderConstraint === "" ? "Select" : this.state.folderConstraint}
                            className={this.state.target} id={"drop_down"}>
                            <MenuItem eventKey={"FOLDER"} onSelect={(evt) => {
                                this.setState({folderConstraint: evt})
                            }}>FOLDER
                            </MenuItem>
                            <MenuItem eventKey={"NONE"} onSelect={(evt) => {
                                this.setState({folderConstraint: evt})
                            }}>NONE
                            </MenuItem>
                        </DropdownButton>
                        <Button onClick={() => {
                            const filesFolders = this.state.filesFolders;
                            filesFolders.push("");
                            this.setState({filesFolders});
                        }}>Add files/folders
                        </Button>
                    </ButtonToolbar>
                </div>
                <div>
                    {this.state.filesFolders.map((d, i) => {
                        console.log(d, i);
                        return (
                            <Row key={i} style={{paddingBottom: "5px"}}>
                                <Col sm={11} md={10}>
                                    <FormControl id={"filesFolders_textarea_" + i} type="text" defaultValue={d}
                                                 placeholder="relative File/Folder path"
                                                 onBlur={(e) => {
                                                     const filesFolders = this.state.filesFolders;
                                                     filesFolders[i] = e.target.value;
                                                     this.setState({filesFolders});
                                                 }}/>
                                </Col>
                                <Col sm={1} md={1} style={{paddingTop: "5px"}}>
                                    <TiDelete size={25}
                                              className={"tiDelete"}
                                              onClick={() => {
                                                  const filesFolders = this.state.filesFolders;
                                                  filesFolders.splice(i, 1);
                                                  this.setState({filesFolders});
                                              }}/>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {

    return {
        rules: state.ruleTable,
        availableTags: state.tagTable,
        ws: state.ws
    };

}

export default connect(mapStateToProps, null)(GenerateRule);
