Routes:
    
    https://milestep-test-api.herokuapp.com


        /api/users
            /signup (POST) - registration
            /login (POST) - login
            /logout (POST) - logout
            /verify/:confirmationToken (GET) - email confirmation
            /verify (POST) - resend verification email

        
        /api/tasks
            /                 (Post) - add task
            /:id              (Patch) - update task
            /:id/markIsDone   (GET) - mark task as done
            /:id/unmarkIsDone (GET) - unmark task as done
            /:id              (DELETE) - delete task
