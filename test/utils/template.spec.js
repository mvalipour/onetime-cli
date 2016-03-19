var expect = require("chai").expect;
var template = require('../../src/utils/template');

describe('template', function(){

    describe('extractData', function(){

        testExtractData('#1000 - #999 - #998 notes', 1000, 999, 998, 'notes');
        testExtractData('#1000  -  #999 - #998 notes', 1000, 999, 998, 'notes');
        testExtractData('#1000 - #999  -  #998 notes', 1000, 999, 998, 'notes');
        testExtractData('#1000 - #999 - #998    notes', 1000, 999, 998, 'notes');
        testExtractData('#1000 - #999 - #998 notes blah blah blah 000', 1000, 999, 998, 'notes blah blah blah 000');
        testExtractData('#1000 - #999 - #998 notes blah blah blah 000   ', 1000, 999, 998, 'notes blah blah blah 000');
        testExtractData('#1000 - #999 - #998', 1000, 999, 998, '');
        testExtractData('#1000 - #999 - #998   ', 1000, 999, 998, '');
        testExtractData('#1000-#999 - #998 notes', 1000, 999, 998, 'notes');
        testExtractData('#1000- #999 - #998 notes', 1000, 999, 998, 'notes');
        testExtractData('#1000 -#999 - #998 notes', 1000, 999, 998, 'notes');


        failExtractData('#1000 #999 notes');


        function testExtractData(text, expectedProjectId, expectedUserStoryId, expectedTaskId, expectedNotes){
            describe('extract data from: \'' + text + '\'', function(){
                var data = template.extractData(text);

                it('should get the project id', function(){
                    expect(data).to.have.property('projectId', expectedProjectId);
                });
                it('should get the user story id', function(){
                    expect(data).to.have.property('userStoryId', expectedUserStoryId);
                });
                it('should get the task id', function(){
                    expect(data).to.have.property('taskId', expectedTaskId);
                });
                it('should get the notes', function(){
                    expect(data).to.have.property('notes', expectedNotes);
                });
            });
        }

        function failExtractData(text){
            it('should fail extracting data from: \'' + text + '\'', function(){
                expect(template.extractData(text)).to.be.null;
            });
        }

    });


    describe('buildTemplate', function(){

        testBuildTemplate(1000, 999, 888, null, '#1000 - #999 - #888');
        testBuildTemplate(1000, 999, 888, 'notes', '#1000 - #999 - #888 notes');
        testBuildTemplate(1000, 999, 888, 'notes blah blah', '#1000 - #999 - #888 notes blah blah');
        testBuildTemplate(1000, 999, 888, 8, '#1000 - #999 - #888 8');


        failBuildTemplate(1000, 999, null, null);
        failBuildTemplate(1000, null, 888, null);
        failBuildTemplate(null, 999, 888, null);

        function testBuildTemplate(projectId, userStoryId, taskId, notes, expectedText){

            describe('build template using' + projectId + ', ' + userStoryId + ', ' + taskId,function(){

                it('should return the template', function(){
                    expect(template.buildTemplate({
                        projectId: projectId,
                        userStoryId: userStoryId,
                        taskId: taskId,
                        notes: notes,
                    })).to.be.equal(expectedText);
                });
            });
        }

        function failBuildTemplate(projectId, userStoryId, taskId, notes){
            it('should fail building the template', function(){
                expect(template.buildTemplate({
                    projectId: projectId,
                    userStoryId: userStoryId,
                    taskId: taskId,
                    notes: notes,
                })).to.be.null;
            });
        }
    });
});
