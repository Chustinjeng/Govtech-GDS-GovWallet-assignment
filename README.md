# Govtech-GDS-GovWallet-assignment

My name is Justin Cheng. My email is justcheng2000@gmail.com. This is the online assessment for the internship role "Tech - Software Engineer: GovSupply & GovWallet".

## Assumptions and design considerations

In this online assessment, although I considered using MongoDB to store the redemption data, I eventually chose not to because I was afraid of the cloud service not functioning as expected due to connection issues. I eventually settled on a local CSV file for storage of redemption data.

Although not explicitly mentioned in the question, I assume that each team can only collect gifts once, which means that any team that tries to collect gifts for the second time would be deemed inelligible for redemption. 

For unit testing, I tried using testing frameworks like Cypress and Jest, but these frameworks are more suited for testing of frontend and backend logic, so I struggled to implement such frameworks. :disappointed: I tried to emulate testing frameworks by writing my own test cases in a typescript file `tests.js`.

## Run the code

1. Clone the repository

2. Make sure to go to the working directory

```
cd gds-swe-supplyally-govwallet/Take-Home Assignment 59666bf04ff7483ba95edeb4a75f0b1c
```

3. Store the node modules packages by running

```
npm install
```

4. Compile the typescript files 

```
npx index.ts
npx tests.ts
```

5. Run the test cases

```
node tests.js
```