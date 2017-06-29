var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');


app.use('node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));


//USERS connected
var users = [];


//Posts
var posts = [];


//conteur
var id_poster = 0;

io.on('connection', function (socket) {


    const currentUser = {
        id: null,
        nickname: null,
        id_poster: id_poster++
    };

    socket.on('setNickname', function (nickname) {
        currentUser.id = socket.id;
        currentUser.nickname = nickname;

        console.log(currentUser);
        users.push(currentUser);


        socket.emit('users', users);

        socket.emit('newUser', currentUser);

        console.log(users);

    });


    const newPost = {
        author: null,
        url: null,
        text: null,
        date: new Date(),
        id: currentUser.id,
        id_poster: id_poster++
    };

    socket.on('newPost', function (post_data) {
        console.log(new Date());
        console.log("NEW POST URL => " + post_data.url);
        console.log("NEW POST TEXT => " + post_data.text);
        console.log("id => " + currentUser.id);
        console.log("iddd " + currentUser.id_poster);


        newPost.url = post_data.url;
        newPost.author = post_data.author;
        newPost.text = post_data.text;
        newPost.id = post_data.id;


        posts.push(newPost);

        socket.emit('posts', posts);



        socket.broadcast.emit('newPost', newPost);
    });

    socket.on('postToDelete', function (postToDelete){

    });


    socket.on('disconnect', function () {
        console.log("Deco => " + currentUser.nickname);
        //contnuer
    });

});


const port = process.env.PORT || 8000; //env.port => port coté client, 8000 port local
http.listen(port, function () {
    console.log('listening on *:' + port);
});
