![logo](https://cdn.iconscout.com/icon/free/png-256/graduation-cap-1519981-1287612.png)
# Hero Academy Client

![license](https://img.shields.io/badge/license-MIT-blue.svg)

> Hero Acedemy Client made with [Material UI's](https://material-ui.com/?ref=devias-io) components, [React](https://reactjs.org/?ref=devias-io) and of course [create-react-app](https://facebook.github.io/create-react-app/?ref=devias-io) to boost your app development process!

## Quick start

- Make sure your NodeJS and npm versions are up to date for `React 16.8.6`

- Install dependencies: `npm install` or `yarn`

- Create `.env` file at `root` directory to setup environment variables:

	+ For development

		```
		PORT=5000
		REACT_APP_API_URL=http://localhost:3500/api
		REACT_APP_CLOUDINARY_CLOUD_NAME=dye8sx2yk
		```

	+ For staging

		```
		PORT=5000
		REACT_APP_API_URL=https://online-academy-test.herokuapp.com/api
		REACT_APP_CLOUDINARY_CLOUD_NAME=dye8sx2yk
		```

	+ For production

		```
		PORT=5000
		REACT_APP_API_URL=https://online-academy-production.herokuapp.com/api
		REACT_APP_CLOUDINARY_CLOUD_NAME=dcpiiafc6
		```		

- Start the server: `npm run start` or `yarn start`

- View locally on: `localhost:5000`

## Documentation

The documentation for the React Material Kit is can be found [here](https://material-ui.com?ref=devias-io).

## File Structure

Within the download you'll find the following directories and files:

```
material-react-dashboard
├── .env
├── .eslintrc
├── .gitignore
├── .prettierrc
├── CHANGELOG.md
├── jsconfig.json
├── LICENSE.md
├── package.json
├── README.md
├── public
├── docs
└── src
	├── api
	├── assets
	├── common
	├── components
	├── helpers
	├── icons
	├── layouts
	├── redux
	├── theme
	├── views
	├── App.jsx
	├── index.jsx
	└── Routes.jsx
```

## License

- Licensed under MIT (https://github.com/devias-io/react-material-dashboard/blob/master/LICENSE.md)