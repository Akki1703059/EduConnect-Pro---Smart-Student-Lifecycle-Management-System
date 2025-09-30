({
    loadStudentData : function(component) {
        component.set('v.isLoading', true);
        
        var action = component.get('c.getCurrentStudentData');
        
        action.setCallback(this, function(response) {
            component.set('v.isLoading', false);
            
            if (response.getState() === 'SUCCESS') {
                var data = response.getReturnValue();
                console.log('Student data loaded:', data);
                
                if (data.success) {
                    // Set basic student info
                    component.set('v.studentName', data.studentName || 'Student');
                    component.set('v.studentId', data.studentId || 'N/A');
                    component.set('v.department', data.department || 'Department');
                    component.set('v.yearOfStudy', data.yearOfStudy || 'Year');
                    component.set('v.academicStatus', data.academicStatus || 'Active');
                    component.set('v.currentGpa', data.currentGpa || 0.0);
                    component.set('v.academicStanding', data.academicStanding || 'New Student');
                    component.set('v.totalCredits', data.totalCredits || 0);
                    component.set('v.classRank', data.classRank || 'N/A');
                    component.set('v.clubCount', data.clubCount || 0);
                    
                    // Set related data
                    component.set('v.currentCourses', data.currentCourses || []);
                    component.set('v.recentGrades', data.recentGrades || []);
                    component.set('v.recommendedJobs', data.recommendedJobs || []);
                    component.set('v.myClubs', data.myClubs || []);
                    component.set('v.upcomingEvents', data.upcomingEvents || []);
                    
                    this.showToast('Success', 'Dashboard loaded successfully!', 'success');
                } else {
                    this.showToast('Error', data.error || 'Failed to load dashboard data', 'error');
                }
            } else {
                console.error('Error loading student data:', response.getError());
                this.showToast('Error', 'Failed to load dashboard data', 'error');
            }
        });
        
        $A.enqueueAction(action);
    },
    
    findMoreJobs : function(component) {
        this.showToast('Info', 'Refreshing job recommendations...', 'info');
        // Refresh the job recommendations
        this.loadStudentData(component);
    },
    
    applyForJob : function(component, jobId) {
        if (!jobId) {
            this.showToast('Error', 'Invalid job selection', 'error');
            return;
        }
        
        var action = component.get('c.applyForJob');
        action.setParams({
            jobId: jobId,
            studentId: this.getStudentId(component)
        });
        
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                var result = response.getReturnValue();
                if (result.success) {
                    this.showToast('Success', result.message, 'success');
                } else {
                    this.showToast('Error', result.message, 'error');
                }
            } else {
                this.showToast('Error', 'Failed to apply for job', 'error');
            }
        });
        
        $A.enqueueAction(action);
    },
    
    registerForEvent : function(component, eventId) {
        if (!eventId) {
            this.showToast('Error', 'Invalid event selection', 'error');
            return;
        }
        
        var action = component.get('c.registerForEvent');
        action.setParams({
            eventId: eventId,
            studentId: this.getStudentId(component)
        });
        
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                var result = response.getReturnValue();
                if (result.success) {
                    this.showToast('Success', result.message, 'success');
                    // Refresh events
                    this.loadStudentData(component);
                } else {
                    this.showToast('Error', result.message, 'error');
                }
            } else {
                this.showToast('Error', 'Failed to register for event', 'error');
            }
        });
        
        $A.enqueueAction(action);
    },
    
    getStudentId : function(component) {
        // For now, return null - in real implementation, get from user context
        return null;
    },
    
    showToast : function(title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        if (toastEvent) {
            toastEvent.setParams({
                title: title,
                message: message,
                type: type,
                duration: 3000
            });
            toastEvent.fire();
        } else {
            // Fallback alert for communities
            alert(title + ': ' + message);
        }
    }
})