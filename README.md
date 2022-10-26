# uz-multiagent-app

# Example description

Zadania:

- [x] Car market 10 agents selling vehicles (8 for each selling agent), 3 agents buying vehicles (each buys 3 cars).


- [x] Properties of the car object: make, model, body type, engine type, engine capacity, year of production, price. The cost of additional charges should also be added as a value that characterizes the attractiveness of the offer. Seller buyer should optimize the total purchase cost in the form of vehicle cost + additional cost.


- [x] A starting budget should be established for each of the buyers, eg PLN 100,000. This budget is reduced at the time the purchase is made by the buyer's agent.


- [x] Consider the case where: there are more buyers and a situation occurs where the seller responds with an offer to one of the buyers and, before his car is sold, he offers to sell it to another buyer. The second buyer will also consider it the most attractive offer, but will not be able to buy it anymore because it will be sold to the first one in the meantime.


- [x] This situation will worsen additionally when the same seller offers two identical car models with the same parameters but at different prices. In such a case, it should be assumed that the cheaper offer will be selected.


- [x] Additionally, design a mechanism enabling the reservation of a car purchase offer for a specified period of time.

## Needed
- [Node.js](https://nodejs.org/en/) v16.18.0
- NPM 8.19.2 (included in Node.js) or [Yarn](https://yarnpkg.com/getting-started/install) v1.22.11 
- Optionally [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md)

# Setup

1. When using NVM set Node.js version: `nvm use`
2. Install all packages: `npm install` or `yarn`

# Run
1. Development mode (after changes app will restart):
   
   _Optionally set node version:_
   ```
   nvm install 16.18.0
   nvm use 16.18.0
   ```
   _Run dev:_
   ```
   npm run dev
   ```
   _or_
   ```
   yarn dev
   ```

2. Production mode:
   _Optionally set node version:_
   ```
   nvm install 16.18.0
   nvm use 16.18.0
   ```

   _Build and then run start:_
   ```
    npm run build
    npm run start
   ```
    _or_
    ```shell
    yarn build
    yarn start
    ```