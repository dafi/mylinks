# Configuration

## Eslint

    npx eslint . --ext .js,.jsx,.ts,.tsx

## Local deploy

Inside the `package.json` file changed `homepage` to `./` to work locally from `file://`

## Remote deploy

### On github pages

There are two new scripts defined inside `package.json`

- predeploy
- deploy

Run the following command to deploy on [mylinks](https://dafi.github.io/mylinks/)

	npm run deploy
	


