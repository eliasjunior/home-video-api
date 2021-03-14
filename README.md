# Home video API

## What is it ?

- It's NodeJS streaming app to stream media that you have on your machine or hard drive, you can as well set up a raspberry PI as a server on your home network.

## Why would you want to set up this app ?

- You can have a computer or an external driver with a lot of videos and photos( not ready yet) and then easily access it from your phone, 
 computer or tablet, you just need a browser and along with the [Home video UI](https://github.com/eliasjunior/home-video) 
 have the whole cine home set up for free.

## Configuration

### Local test

- check the file `config.js`

### Setting up a server `.env`

Some fields are self explanatory, other that are more specific see below

- `IMG_FOLDER_FALL_BACK` In case the server cannot read the image from there video folder
- `VIDEO_PATH` path of your videos

#### Server video structure

Example `VIDEO_PATH=/media/pi/ExternalHD/Movies` 




