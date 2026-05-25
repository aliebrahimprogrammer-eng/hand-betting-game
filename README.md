# Hand Betting Game

Technical Assessment submission by Ali Ebrahim.

## Setup Instructions

### 1- First of all add the necessary environment variables by creating .env
that should look like this:
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/hand-betting-game?retryWrites=true&w=majority&appName=hand-betting-game
PORT=3000

The real connection string will be shared in the submission email.
Note: I know it is not a good idea for security reasons but I am making and exception as this is an assessment and not real client data.


### 2- Install dependencies using the following commands:
npm install

### 3- run the backend API for database interaction using the following commands:
npx nx serve api

### 4- run the angular frontend in a second terminal using the following commands:
npx nx serve hand-betting-game

### 5- Open the app and have fun! using the following URL:
http://localhost:4200
The API runs at 
http://localhost:3000/api

### 6- for testing API manually:

- get leaderboard scores:
Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/leaderboard

- create a test score:
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/leaderboard `
  -ContentType "application/json" `
  -Body '{"name":"Penny Tester","score":777}'
  
### 7- to build the project to prepare it for production we can use the following commands:  
npx nx build hand-betting-game
npx nx build api



## AI Usage Note:
To be completely honest AI was heavily utilized to study unfamiliar technologies, plan the project structure,
translate the logic of the game into code, review code organization and help debug problems during the development process.
I believe it is expected nowadays that programmers can learn and adapt swiftly using AI tools for simplicity
but in the same time max efficiency, cutting edge quality and speed of delivery.
The final implementation was manually integrated, tested, adjusted and verified. Furthermore, the following tasks were also manual:
- Project Setup
- Package Installation
- MongoDB Atlas configuration
- Git/GitHub workflow 
- Debugging Angular/Nx/NestJS errors
- Testing the game flow
- Confirming the leaderboard data is actually saved to MongoDB