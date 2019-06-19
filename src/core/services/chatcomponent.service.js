import path from "../../config/index"

export const ChatSend = (data) => {
    return fetch(path.API, {
        method: "POST",
        body: JSON.stringify(data),

        headers: {
            "Content-Type": "application/json"
        }
    })
}


export const Invoke = (msg) => {
    return fetch(path.INVOKE, {
        method: "POST",
        headers: {
            "Authorization": "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaW5ldGgxOSIsImp0aSI6IjAyMWM0ODFhLTU1MTAtNDM5ZC05NWI4LWVmOTk2NzJmNWZhYSIsInN1YiI6IjU2YTllNzU5ZmIwNzE5MDdhMDAwMDAwMTI1ZDllODBiNWM3YzRmOTg0NjZmOTIxMTc5NmViZjQzIiwiZXhwIjoyMzM0MTIzMzYwLCJ0ZW5hbnQiOi0xLCJjb21wYW55IjotMSwic2NvcGUiOlt7InJlc291cmNlIjoiY2xpZW50IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiXX0seyJyZXNvdXJjZSI6InVzZXIiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSJdfV0sImlhdCI6MTQ3MDIwOTc2MH0.yCJ-OF7clLt9HO1RS_T_wOAoK44mj2o8k25InNAxrZA",
            "companyInfo": "1:13",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "direction": "in",
            "bid": "5b30d538dce6e52f58b7e0d8",
            "platform": "webchat",
            "engagement": "webchat",
            "from": {
                "id": "1995320117207740",
                "raw": {}
            },
            "to": {
                "id": "184060312435521",
                "raw": {}
            },
            "message": {
                "type": "text",
                "data": `${msg}`
            }
        }),
    })
}

export const Card = (data) => {
    return fetch(path.CARD + data, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaW5ldGgxOSIsImp0aSI6IjAyMWM0ODFhLTU1MTAtNDM5ZC05NWI4LWVmOTk2NzJmNWZhYSIsInN1YiI6IjU2YTllNzU5ZmIwNzE5MDdhMDAwMDAwMTI1ZDllODBiNWM3YzRmOTg0NjZmOTIxMTc5NmViZjQzIiwiZXhwIjoyMzM0MTIzMzYwLCJ0ZW5hbnQiOi0xLCJjb21wYW55IjotMSwic2NvcGUiOlt7InJlc291cmNlIjoiY2xpZW50IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiXX0seyJyZXNvdXJjZSI6InVzZXIiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSJdfV0sImlhdCI6MTQ3MDIwOTc2MH0.yCJ-OF7clLt9HO1RS_T_wOAoK44mj2o8k25InNAxrZA",
            "companyInfo": "1:13"
        }
    })
}


export const Quickreply = (data) => {
    return fetch(path.QUICKREPLY + data, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaW5ldGgxOSIsImp0aSI6IjAyMWM0ODFhLTU1MTAtNDM5ZC05NWI4LWVmOTk2NzJmNWZhYSIsInN1YiI6IjU2YTllNzU5ZmIwNzE5MDdhMDAwMDAwMTI1ZDllODBiNWM3YzRmOTg0NjZmOTIxMTc5NmViZjQzIiwiZXhwIjoyMzM0MTIzMzYwLCJ0ZW5hbnQiOi0xLCJjb21wYW55IjotMSwic2NvcGUiOlt7InJlc291cmNlIjoiY2xpZW50IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiXX0seyJyZXNvdXJjZSI6InVzZXIiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSJdfV0sImlhdCI6MTQ3MDIwOTc2MH0.yCJ-OF7clLt9HO1RS_T_wOAoK44mj2o8k25InNAxrZA",
            "companyInfo": "1:13"
        }
    })
}

export const Attachemnt = (data) => {
    return fetch(path.ATTACHMENT + data, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaW5ldGgxOSIsImp0aSI6IjAyMWM0ODFhLTU1MTAtNDM5ZC05NWI4LWVmOTk2NzJmNWZhYSIsInN1YiI6IjU2YTllNzU5ZmIwNzE5MDdhMDAwMDAwMTI1ZDllODBiNWM3YzRmOTg0NjZmOTIxMTc5NmViZjQzIiwiZXhwIjoyMzM0MTIzMzYwLCJ0ZW5hbnQiOi0xLCJjb21wYW55IjotMSwic2NvcGUiOlt7InJlc291cmNlIjoiY2xpZW50IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiXX0seyJyZXNvdXJjZSI6InVzZXIiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSJdfV0sImlhdCI6MTQ3MDIwOTc2MH0.yCJ-OF7clLt9HO1RS_T_wOAoK44mj2o8k25InNAxrZA",
            "companyInfo": "1:13"
        }
    })
}

export const Button = (data) => {
    return fetch(path.BUTTON + data, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzaW5ldGgxOSIsImp0aSI6IjAyMWM0ODFhLTU1MTAtNDM5ZC05NWI4LWVmOTk2NzJmNWZhYSIsInN1YiI6IjU2YTllNzU5ZmIwNzE5MDdhMDAwMDAwMTI1ZDllODBiNWM3YzRmOTg0NjZmOTIxMTc5NmViZjQzIiwiZXhwIjoyMzM0MTIzMzYwLCJ0ZW5hbnQiOi0xLCJjb21wYW55IjotMSwic2NvcGUiOlt7InJlc291cmNlIjoiY2xpZW50IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiXX0seyJyZXNvdXJjZSI6InVzZXIiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSJdfV0sImlhdCI6MTQ3MDIwOTc2MH0.yCJ-OF7clLt9HO1RS_T_wOAoK44mj2o8k25InNAxrZA",
            "companyInfo": "1:13"
        }
    })
}

export const dialogflow = (message) => {
    return fetch(path.DIALOGFLOW, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
}

export const getCredentialsDialogflow = (app_id) => {
    console.log('app_id', app_id)
    return fetch(path.GET_CREDENTIALS_DIALOGFLOW, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(app_id),
    })
}