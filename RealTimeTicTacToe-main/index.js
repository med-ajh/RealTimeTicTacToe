const express=require("express")
const app=express()

const path=require("path")
const http=require("http")
const {Server}=require("socket.io")


const server=http.createServer(app)

const io=new Server(server)
app.use(express.static(path.resolve("")))

let arr=[]
let playingArray=[]

io.on("connection",(socket)=>{

    socket.on("find",(e)=>{

        if(e.name!=null){

            arr.push(e.name)

            if(arr.length>=2){
                let p1obj={
                    p1name:arr[0],
                    p1value:"X",
                    p1move:""
                }
                let p2obj={
                    p2name:arr[1],
                    p2value:"O",
                    p2move:""
                }

                let obj={
                    p1:p1obj,
                    p2:p2obj,
                    sum:1
                }
                playingArray.push(obj)

                arr.splice(0,2)

                io.emit("find",{allPlayers:playingArray})

            }

        }

    })
    // Handle "playing" event when a player makes a move
    socket.on("playing",(e)=>{
        if(e.value=="X"){
            let objToChange=playingArray.find(obj=>obj.p1.p1name===e.name)

            objToChange.p1.p1move=e.id
            objToChange.sum++
        }
        else if(e.value=="O"){
            let objToChange=playingArray.find(obj=>obj.p2.p2name===e.name)

            objToChange.p2.p2move=e.id
            objToChange.sum++
        }
        // Notify all clients about the updated game state
        io.emit("playing",{allPlayers:playingArray})

    })

    // Handle "gameOver" event when a player leaves the game
    socket.on("gameOver",(e)=>{
        playingArray=playingArray.filter(obj=>obj.p1.p1name!==e.name)
        console.log(playingArray)
        console.log("lol")
    })


})




// Handle requests to the root URL
app.get("/",(req,res)=>{
    return res.sendFile("index.html")
})


// Start the server on port 3000
server.listen(3000, '192.168.81.44', () => {
    console.log("Server running at http://192.168.81.44:3000/");
});

