const URLs = {
    base : 'https://ckxbbu9vp9.execute-api.us-east-1.amazonaws.com/',
    auth : {
        signup : 'https://dev.smoothflow.io/account/#/signup',
        signin : 'https://dev.smoothflow.io/account/#/signin',
        getUserProfile : 'https://userserviceproduction.plus.smoothflow.io/DVP/API/1.0.0.0/Myprofile',
        getUserSettings: (host, company) => {
            return 'https://' + host + '/data/' + company + '.' + host + '/dashboardData/' + company;
        }
    },
    dock : {
        getAllWorkspaces : 'https://w6pnu017gf.execute-api.us-east-1.amazonaws.com/Prod/docks'
    },
    tasks : {
        getAllTasks : 'https://ckxbbu9vp9.execute-api.us-east-1.amazonaws.com/Prod/tasks'
    }
};

export default URLs;