/**
 * Created by Administrator on 2016/11/6.
 */
const express = require('express');
const sio = require('socket.io');
const path = require('path');
const http = require('http');
const app = express();


app.use(express.static(__dirname));
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'chatRoom.html'))
})
const server = http.createServer(app);
const io = sio.listen(server);
var cont = 0;
var users={};
io.on('connection',(socket)=>{


    socket.on('chat',(data)=>{

        socket.emit('come',{msg:data,user:socket.user});
        socket.broadcast.emit('come',{msg:data,user:socket.user});
    });
    socket.on('login',(data)=>{
        cont++;
        users[data]=data;
        socket.user=data;
        socket.emit('status',{cont:cont,users:users});
        socket.broadcast.emit('hy',data);
        socket.broadcast.emit('status',{cont:cont,users:users});
    })
    socket.on('disconnect',()=>{
        cont--;
        var user= socket.user;
        delete users[socket.user]
        socket.broadcast.emit('leave',user);
        socket.broadcast.emit('status',{cont:cont,users:users});
    })


})




server.listen(3000);




