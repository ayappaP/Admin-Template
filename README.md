[![Netlify Status](https://api.netlify.com/api/v1/badges/04c38603-4452-4ad5-b375-f17a80f2931d/deploy-status)](https://app.netlify.com/sites/arokiya-dashboard/deploys)

production https://backend.arokiya.com/

build hook https://api.netlify.com/build_hooks/5d7bcc483c56add9dd9d3cba

development https://arokiya-dashboard-backend-dev.netlify.com/

build hook https://api.netlify.com/build_hooks/5d7bcceb3c56addad59d3cb7

## Requirements

To run this project, you’ll need to install [node 5 and above with NPM](https://nodejs.org/en/). The latest version of Node.js is recommended.

The dependencies of this project are managed with yarn (see installation guide [here](https://yarnpkg.com/en/)). However you can simply use the node package manager, npm for your dependency management.

## Setting up

- Clone this project to any folder on your local machine

```bash
git@github.com:rahulan/serverless-arokiya-backend.git
```

- Navigate into the folder name specified

```bash
cd serverless-arokiya-backend
```

## Installing Packages

- For those who love yarn

```bash
yarn install
```

- For those who love NPM 

```bash
npm install
```

Run `yarn start` or `npm start` to intialize and run the webpack development server. Navigate to [http://localhost:3000/](http://localhost:3000). The app will automatically reload if you change any of the source files.


#### Sample login
```
You can login with any credentials.

```

### App layout
We are using a paid material ui theme, so we have components made by them in `src` folder. Whatever logic that we write for our app is under `src/app` you could take a look at the `src/app/routes` and see how the code is structured. 

1. `src/app/app.js` :  

    Code starts running from here . Here we are  
     - Applying dark/light theme and changing that theme based on condition.

     - Authentication. Only Authenticated User can view main pages. For that we are using Private/ Public Route concept based on `react-router-dom`.

2. `src/app/layouts/index.js` :
    
    Here we are having main layout with Header, SideMenu, Content Components.

    - Content components loading from routes. These routes are getting from `src/app/routes/dashboard.js`. Each Module has many routes (Create, List, Edit/ Update) so we separated with folders. All the routes then compained in dashboard main route. 

    - Sidemenu getting routes from `src/app/routes/sideBarRoutes.js`. If you wants to navigate from side menu then add that route to sideBarRoutes file. (refer sideBarRoutes.js for example).

3.  `src/app/views` :

    - This folder contains all the modules with their features in separated module named folders.

4. `src/graphql` :

    - we separated `mutation` and `query` queries. 

    - `src/graphql/mutation` has Create and Update queries in different files.

    - `src/graphql/query` has get and list queries files.

##### Git:

- Always checkout from master. And create a new branch.
- Commit often, push often. Even if the feature is incomplete try to push often.
- Please do not work or push to master branch
- Write useful commit messages. Good title and good description.
- After few commits or at the end of day, try to rebase with the remote master. This way you will always be upto date
  with the master branch

```
git pull --rebase origin master
```

##### Pull Request:

###### Before Pull Request

- [x] Squash commits if needed.
- [x] Be up to date with master

```
git pull --rebase origin master
```

- [x] Make sure there are no errors in your tests.
- [x] Make sure there are no errors while you do manual testing/checking.

###### After

- [x] Give pull request
- [x] Look at the diff of your pull request, just skim through to find any spelling or any other error.
- [x] Wait for some one to review your code.
- [x] Do not merge the pull request yourself.

#### Debugging or when you get stuck:

- Check the code flow. Identify the exact line that causes the issue. Use console.log and debugger as possible.
- After debugging, googling in stackoverflow, if you're stuck for hours please tell about this issue in gitlab or github repo or email.
- You could create an issue in the repo. Tell where the issue occurs and in which scenario it fails, in which it works. And to reproduce the bug what the person should install or run or click. And what you have tried. You could also attach screenshot or stack trace of the error, anything that would help for
  others to suggest a solution at a glance
