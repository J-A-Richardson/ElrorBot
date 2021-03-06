

const Discord = require("discord.js");
const fs = require('fs');

var character_dict = {};

// This guy right here is a bastard
fs.readFile('charinfo.txt', function(err, data) {
    if (data !== null) {
        character_dict = JSON.parse(data);
        for (var x in character_dict) {
            c = new Character();
            Object.assign(c, character_dict[x]);
            character_dict[x] = c;
        }
    }
});


class Character {
    constructor() {
      this.c_description = "";
      this.c_likes = "";
      this.c_dislikes = "";
      this.c_height = "";
      this.c_alive = true;
    }
    
    setDescription(char, para, channel) {
        this.c_description = para;
        channel.send('Description updated');
        writeChar();
    }

    description(channel) {
        if ((this.c_description === " " || this.c_description === ""))
            channel.send(`This character has no description`);
        else if(this.c_description)
            channel.send(this.c_description);
    }

    setLikes(char, para, channel) {
        this.c_likes = para;
        channel.send('Likes updated');
        writeChar();
    }

    likes(channel) {
        if ((this.c_likes===" ") || this.c_likes === "")
            channel.send(`This character has no likes`);
        else if(this.c_likes)
            channel.send(this.c_likes);

    }

    setDislikes(char, para, channel) {
        this.c_dislikes = para;
        channel.send('Dislikes updated');
        writeChar();
    }

    dislikes(channel) {
        if ((this.c_dislikes===" " || this.c_dislikes === ""))
            channel.send(`This character has no dislikes`);
        else if(this.c_dislikes)
            channel.send(this.c_dislikes);
    }

    setHeight(char, para, channel) {
        this.c_height = para;
        channel.send('Height updated');        
        writeChar();
    }

    height(channel) {
        if ((this.c_height === " " || this.c_height === ""))
            channel.send(`This character has no height set`);
        else if(this.c_height)
            channel.send(this.c_height);
    }

    bio(channel) {
        if((this.c_height) && (this.c_description) && (this.c_likes) && (this.c_dislikes))
            channel.send(`Height: ${this.c_height}\nDescription: ${this.c_description}\nLikes: ${this.c_likes}\nDislikes: ${this.c_dislikes}`);
        else
            channel.send(`Finish filling out this character's bio first`);
    }

    deleteChar(char, channel) {
        delete character_dict[char];
        channel.send('Character Deleted');
        writeChar();
    }

    ripChar(char, channel) {
        if(this.c_alive) {
            this.c_alive = false;    
            ripCharacter(char, channel)
        }
        else
            channel.send(`Now you're just rubbing it in`);
        writeChar();
    }

    unRipChar(char, channel) {
        if(!this.c_alive) {
            unRipCharacter(char, channel);
            this.c_alive = true;
        }
        else
            channel.send(`Dude, they're standing right there`);
        writeChar();
    }   
}

function characterInfo(cmd, char, para, channel) {
    if(character_dict[char])
    {
        if(cmd === ('!bio'))
            character_dict[char].bio(channel);
        if(cmd === ('!description'))
            character_dict[char].description(channel)
        if(cmd === ('!setdescription'))
            character_dict[char].setDescription(char, para, channel);
        if(cmd === ('!likes'))
            character_dict[char].likes(channel);
        if(cmd === ('!setlikes'))
            character_dict[char].setLikes(char, para, channel);
        if(cmd === ('!dislikes'))
            character_dict[char].dislikes(channel);
        if(cmd === '!setdislikes')
            character_dict[char].setDislikes(char, para, channel);
        if(cmd === '!height')
            character_dict[char].height(channel);
        if(cmd === '!setheight')
            character_dict[char].setHeight(char, para, channel);
        if(cmd === '!deletechar')
            character_dict[char].deleteChar(char, channel);
        if(cmd === '!rip')
            character_dict[char].ripChar(char, channel);
        if(cmd === '!unrip')
            character_dict[char].unRipChar(char, channel);
    }
    else
        channel.send(`This character does not exist, please make a file with !newchar (character name)`);
}

function newChar(char, channel) {
    character_dict[char] = new Character("", "", "", "", true);
    channel.send('New character created');
    writeChar();
}

function writeChar()
{
    fs.writeFile('charinfo.txt', JSON.stringify(character_dict), (err) => {
        if (err) throw err;
    });
}

function ripCharacter(char, channel) {
    var rand = Math.floor((Math.random()*2)+1);
    if(rand === 1)
        channel.send(`Rip ${char}, you loveable but complete and utter dumbass`);
    if(rand === 2)
        channel.send(`Rip ${char}, they wasn't the strongest, fastest, or smartest, but my god you should have seen the size of his int`);
    
}

function unRipCharacter(char, channel) {
    var rand = Math.floor((Math.random()*2)+1);
    if(rand === 1)
        channel.send(`Unfortunately, ${char} has rejoined us`);
    if(rand === 2)
        channel.send(`nvm`);
    this.c_alive = true;
}

function cowards (channel) {
    var aliveCharacters = "";
    for (const key in character_dict)
    {
        if(character_dict[key].c_alive) {
            aliveCharacters += `${key}\n`;
        }
    }
    if (aliveCharacters !== "") { 
        channel.send(aliveCharacters);
    }
}

function valhalla(channel) {
    var deadCharacters = "";
    for (const key in character_dict)
    {
        if(!character_dict[key].c_alive) {
            deadCharacters += `${key}\n`;
        }
    }
    if (deadCharacters !== "") { 
        channel.send(deadCharacters);
    }
}


module.exports = {Character, characterInfo, newChar, cowards, valhalla}