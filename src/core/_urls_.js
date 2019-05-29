const URLs_dev = {
    base : 'https://ckxbbu9vp9.execute-api.us-east-1.amazonaws.com/',
    user: {
        base_: 'https://ml9oskczql.execute-api.us-east-1.amazonaws.com/Dev/DBF/API/1.0.0.0/',
        me: 'me'
    },
    auth : {
        signup : 'https://dev.smoothflow.io/account/#/signup',
        signin : 'https://dev.smoothflow.io/account/#/signin',
        getUserProfile : 'https://userservicedev.plus.smoothflow.io/DVP/API/1.0.0.0/Myprofile',
        getUserSettings: (host, company) => {
            return 'https://' + host + '/data/' + company + '.' + host + '/dashboardData/' + company;
        }
    },
    dock : {
        getAllWorkspaces : 'https://f1amjmy8ki.execute-api.us-east-1.amazonaws.com/Dev/docks'
    },
    tasks : {
        getAllTasks : 'https://9n14mjxxz8.execute-api.us-east-1.amazonaws.com/Dev/tasks',
        toggleTaskFavourite : 'https://9n14mjxxz8.execute-api.us-east-1.amazonaws.com/Dev/taskaddtofavorites/',
        updateTask : 'https://9n14mjxxz8.execute-api.us-east-1.amazonaws.com/Dev/task/'
    }
};
const URLs_prod = {
    base : 'https://ckxbbu9vp9.execute-api.us-east-1.amazonaws.com/',
    user: {
        base_: 'https://ml9oskczql.execute-api.us-east-1.amazonaws.com/Prod/DBF/API/1.0.0.0/',
        me: 'me'
    },
    auth : {
        signup : 'https://smoothflow.io/account/#/signup',
        signin : 'https://smoothflow.io/account/#/signin',
        getUserProfile : 'https://userservice.plus.smoothflow.io/DVP/API/1.0.0.0/Myprofile',
        getUserSettings: (host, company) => {
            return 'https://' + host + '/data/' + company + '.' + host + '/dashboardData/' + company;
        }
    },
    dock : {
        getAllWorkspaces : 'https://f1amjmy8ki.execute-api.us-east-1.amazonaws.com/Prod/docks'
    },
    tasks : {
        getAllTasks : 'https://9n14mjxxz8.execute-api.us-east-1.amazonaws.com/Prod/tasks',
        toggleTaskFavourite : 'https://9n14mjxxz8.execute-api.us-east-1.amazonaws.com/Prod/taskaddtofavorites/',
        updateTask : 'https://9n14mjxxz8.execute-api.us-east-1.amazonaws.com/Prod/task/'
    }
};
let URLs = null;

if (window.location.hostname == "localhost" ||
    window.location.hostname == "dev.smoothflow.io" ||
    window.location.hostname == "smoothflow-dev.s3-website-us-east-1.amazonaws.com" ||
    window.location.hostname == "d35ie0dhlww2mo.cloudfront.net") {
    URLs = URLs_dev;
} else if (window.location.hostname == "smoothflow.io" ||
    window.location.hostname == "prod.smoothflow.io" ||
    window.location.hostname == "d3ored5mvntnxi.cloudfront.net") {
    URLs = URLs_prod;
}

export default URLs;