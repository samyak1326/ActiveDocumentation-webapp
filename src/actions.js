// action creator

export const hashChange = (hash) => {
    return {type: "HASH", value: hash};
};

export const updateWS = (ws) => {
    return {type: "NEW_WS", value: ws};
};

export const updateTagTable = (newTagTable) => {
    return {type: "UPDATE_TAG_TABLE", value: newTagTable};
};

export const updateRuleTable = (newRuleTable) => {
    return {type: "UPDATE_RULE_TABLE", value: newRuleTable};
};

export const updateRule = (updatedRule) => {
    return {type: "UPDATE_RULE", value: updatedRule};
};

export const ignoreFile = (value) => {
    return {type: "IGNORE_FILE", value: value};
};

export const clickedOnForward = () => {
    return {type: "CLICKED_ON_FORWARD"};
};

export const clickedOnBack = () => {
    return {type: "CLICKED_ON_BACK"};
};

export const updateFilePath = (filePath) => {
    return {type: "FILE_PATH", value: filePath};
};

export const submitNewRule = (newRuleProps) => {
    return {type: "SUBMIT_NEW_RULE", value: newRuleProps}
};

export const submitNewTag = (newTagProps) => {
    return {type: "SUBMIT_NEW_TAG", value: newTagProps}
};