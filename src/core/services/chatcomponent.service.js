import path from "./../../config"

export let ChatSend = (data) => {
    return fetch(path.API, {
        method: "POST",
        body: JSON.stringify(data),

        headers: {
            "Content-Type": "application/json"
        }
    })
}
