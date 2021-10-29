## Database Setup / Connection
https://pimylifeup.com/raspberry-pi-postgresql/
1. Change to the postgres user with `sudo su postgres`
2. Start the cli with `psql`

### Run in development
`yarn start:dev`

### Run e2e tests (before push)
1. Start the test server with `yarn start:test`
2. Run tests in another terminal `yarn test` 

### CI/CD
1. developer creates a new feature or bug fix
2. developer pushes changes to a new branch
3. developer creates a Pull Request against the stage branch 
4. ops merges pull request
5. ops pulls down stage locally, runs the app, and runs the e2e test
6. stage is promoted to production

note: stage should be one step before production and should behave the same as production, minus new features and any uncaught bugs that need to be fixed before deploying to production
