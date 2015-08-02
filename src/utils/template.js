module.exports.buildTemplate = buildTemplate;
module.exports.extractData = extractData;



function buildTemplate(data){

    if(data.projectId == null || data.userStoryId == null || data.taskId == null){
        return null;
    }

    var string = '#' + data.projectId + ' - #' + data.userStoryId + ' - #' + data.taskId;

    if(data.notes){
        string += ' ' + data.notes;
    }

    return string;
}


var extractRegex = /#([0-9]+)\s*-\s*#([0-9]+)\s*-\s*#([0-9]+)\s*((.|\s)*)/;

function extractData(template){
    var matches = template.match(extractRegex);

    if(!matches){
        return null;
    }

    return {
        projectId: +matches[1],
        userStoryId: +matches[2],
        taskId: +matches[3],
        notes: matches[4].trim(),
    };
}
