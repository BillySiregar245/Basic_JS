const token = ~~[Math.random() * 12345678]

const pictures = ['1.jpg', '2.jpg', '3.jpg']

function login(username){
    console.log('processing token user now...')
    return new Promise((success, failed) => {
        setTimeout(() => {
            if(username != "billy_siregar") 
                failed('sorry wrong data!')
                success({ token })
        }, 200)
    })
}

function getUser(token){
    console.log('processing apiKey now...')
    return new Promise((success, failed) => {
        if (token) failed("sorry, no token!")
        if (token) 
            setTimeout(() => {
                success ({ apiKey : "xKey123"})
            }, 500);
    })
}

function getPictures (apiKey){
    console.log('processing picture now...')
    if (apiKey) 
    setTimeout(() => {
        return ({pic : pictures})
    }, 1500);
}

async function userDisplay() {
    const {token} = await login("billy_siregar")
    const {apiKey} = await getUser(token)
    const {pic} = await getPictures(apiKey)

    console.log(`
        token anda adalah : ${token}
        apiKey anda adalah : ${apiKey}
        
        `)
}

userDisplay()
