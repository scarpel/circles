<p align="center">
  <picture width="100" height="100">
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/scarpel/circles/blob/main/medias/light-logo.png">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/scarpel/circles/blob/main/medias/dark-logo.png">
    <img alt="Circles logo" src="https://github.com/scarpel/circles/blob/main/medias/dark-logo.png" width="300">
  </picture>
</p>
<p align="center">A simple chat app made using NestJS, NextJS, Tailwind, MongoDB, Redis, Socket.IO and Docker</p>

## How to run it

> [!NOTE]  
> Docker is required to run this project

There are two `docker-compose` files, one for development and another for production.

### Development
To run the project in development mode, go to the project's directory and run:

```
docker-compose -f compose.dev.yaml
```

### Production
To run the project in production mode, go to the project's directory and run:

```
docker-compose -f compose.yaml
```

## How to access it
Once the containers have been created, they can be accessed using the URL below:

### Server
```
http://localhost:4000/
```

### Client
```
http://localhost:3000/
```

## Mock users

To make things simpler, two mock users are created when running the server:

>👨 John
>
>**E-mail:** john@guiscarpel.com <br/>
>**Password:** Aa1#klasdasd

>👩 Ana
>
>**E-mail:** ana@guiscarpel.com <br/>
>**Password:** Aa1#klasdasd

## Up next
There are several things left to do to improve this projects:

- [ ] Add avatar to profile
- [ ] Add group creation
- [ ] Add media and audio to the conversations
- [ ] Add the ability to block users
- [ ] Write tests for the frontend
- [ ] Write more tests to the backend
