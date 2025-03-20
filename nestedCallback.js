const token = ~~[Math.random() * 12345678]

const pictures = ['1.jpg', '2.jpg', '3.jpg']

function login(username, callback){
    console.log('processing token user now...')
    setTimeout(() => {
        callback ({token, username})
    }, 200)
    
}

function getUser(token, callback){
    console.log('processing apiKey now...')
    if (token) 
    setTimeout(() => {
        callback ({ apiKey : "xKey123"})
    }, 500);    
}

function getPictures (apiKey, callback){
    console.log('processing picture now...')
    if (apiKey) 
    setTimeout(() => {
        callback ({pic : pictures})
    }, 1500);
}

const user = login("billy_siregar", function(response) {
    const {token} = response
    getUser(token, function(response) {
        const {apiKey} = response 
        getPictures(apiKey, function(response) {
            const{pic} = response
            console.log(pic)
        })
    })
});


