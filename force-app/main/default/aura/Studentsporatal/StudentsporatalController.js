({
    doInit : function(component, event, helper) {
        console.log('Student Dashboard initializing...');
        helper.loadStudentData(component);
    },
    
    handleFindJobs : function(component, event, helper) {
        helper.findMoreJobs(component);
    },
    
    handleApplyJob : function(component, event, helper) {
        var jobId = event.getSource().get('v.name');
        helper.applyForJob(component, jobId);
    },
    
    handleEventRegistration : function(component, event, helper) {
        var eventId = event.getSource().get('v.name');
        helper.registerForEvent(component, eventId);
    }
})