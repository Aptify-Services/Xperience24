# Introduction

This is the new eBusiness React application built as part of the Aptify application suite. The details of the tech stack are as follows:-
	React: v18.3.1
	Redux Toolkit: v2.2.1
	React Redux: v9.1.0
	React Router Dom: v6.22.1
	React Hook Form: v7.51.2
	Axios: v1.6.7
	PrimeReact: v10.5.3
	PrimeFlex: v3.3.1
	Vite: v5.3.1
	Yup: v1.4.0

A list of all the other dependencies can be found in the package.json file.

# Getting Started

Clone down this repository. You will need node and npm installed globally on your machine. Make sure you have Node v.18.x.x or greater installed on your machine.

We recommend using Visual Studio Code for development.

1. Installation process
	In the terminal, run the following command:-
		npm install

2. Setting up environment variables
	In the root folder, you can find two files, ".env.development" and ".env.production". Set the property "VITE_API_URL" as per the service path you wish to use for your machine, for example, 
	"http://localhost:51809".

3. Running the application in development environment
	In the terminal, run the following command:-
		npm run dev

# Development Guide

1. Changing the theme of the application
	The application level styling can be found under "src/css/theme.scss". Any page level styling can be modified with its respective ".scss" file found under the same "src/css" directory.

2. Using reusable components
	With this new eBusiness React application, we have tried to minimize the redundancy of code. In order to avoid writing the same pieces of code, we have created multiple reusable components. They can be found under the "src/components" directory. 
	
	We have followed the Atomic Design Methodology for building components. As a result of that, we have divided our components into three subdirectories:-
		atoms - basic HTML elements such as text fields, buttons, checkboxes etc. 
		molecules - components built using two or more "atoms", holding more functional page level code.
		templates - page-level objects that place components into a layout.

	To use any of these reusable components, you need to import them into your code file. For example,
		import { SimpleButton } from "@components/atoms";

3. Building reusable components
	We highly recommend following the same Atomic Design Methodology for building any new components. According to the definitions mentioned in point 2, place the components in the subdirectory best suited to their function.

4. Creating a new page
	Any newly created page must be put under the "src/pages" directory. Reusable components can be imported into these files and used as per your need.

5. Adding navigation to newly created pages
	We have used react-router-dom for handling routing throughout our application. Any new page that gets added to the application must have its entry made into the "src/routes/index.jsx" file. 

	Firstly, import the page's underlying component into the file mentioned above. Secondly, if you want the page to be accessed only by authenticated users, add its "Route" under the Private Routes group. Contrarily, if the page can be accessed by guest users as well, add it under the Public Routes group.

6. Making API calls
	We are using Axios for handling the API calls in our application. We recommend using the GET, POST, PATCH and DELETE requests defined under "src/api/APIClient.js", for making these service calls. They are as follows:-
		_get - performs axios.get
		_post - performs axios.post
		_patch - performs axios.patch
		_delete - performs axios.delete

	For example,
		await _post(servicePath, data, optionalHeaders);

7. Data management
	Application level data, such as the user information, cart information and country currency information has been managed using the "store", provided by Redux Toolkit. Store configuration and its associated slices can be found under the "src/store" directory.
	All component/page level data must be handled with the help of useState. This data is required only in a specific component and hence it should not be added to the store, to avoid having bulky state management.

8. Custom hooks
	To avoid redundancy of code, custom hooks can be created under the "src/hooks" directory.

9. Alias path
	We have used Vite as the module bundler for our application. It also gave us the benefit of defining path aliases, thereby eradicating the inclusion of long, confusing paths. For example, while importing a component from the molecules directory, I do not have to mention the path as "../../src/components/molecules", but instead, I can just write, "@components/molecules".

	For any new directories, alias configurations must be made in the following files:-
	vite.config.js
	jsconfig.json
	.eslintrc.json

10. Coding standards
	To maintain coding standards, we have made use of "eslint". Make sure to add the ESLint extension (v3.0.10) to your VS Code. 
	Once the code has been written, run the command, "npm run lint". This will show you any linting errors throughout the application. The warnings can be avoided but the errors need to be resolved. 
	Generally, running the command, "npm run lint:fix", will fix those errors. If the errors still show up, you can manually visit the files and rectify them. 
	You can also run the command, "npm run format", for proper indentation throughout your code files.

11. Configurations
	Application level configurations can be handled through the "src/configuration/ebConfig.js" file.

12. Images
	All application level stock images lie in the "src/assets/images" directory. All other images, such as product images, can be places under the "public/images" directory.

13. Code commit
	To streamline the process of committing new code to the branch and to ensure proper code with proper commit message is pushed, we have made use of Husky. 
	The rules for commit message have been defined in the "commitlint.config.cjs" file. The only acceptable format of commit is, "issueID (commit type): message", for example, EB-1212 (fix): message.

	> issueID format can be changed as per your requirements by editing the "headerPattern" property.
	> commit type can be one of ["build", "chore", "docs", "feat", "fix", "refactor", "revert", "style", "test", "merge"]


# Build for production

To build your code for production, run the following command in the Terminal,
	npm run build

To preview the production ready build, run the following command in the Terminal,
	npm run preview