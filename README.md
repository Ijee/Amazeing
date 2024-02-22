<p align="center">
<img src="assets/amazeing_thick_logo_web_optimised.svg" alt="stack stats" style="max-width: 100%;">
</p>

<p align="center">
    <a href="https://github.com/Ijee/Amazeing/blob/main/LICENSE" alt="License">
        <img alt="MIT license" src="https://img.shields.io/github/license/Ijee/amazeing?style=for-the-badge" /></a>
    <a href="https://github.com/Ijee/Amazeing/blob/main/package.json" alt="Version">
        <img alt="Project version" src="https://img.shields.io/github/package-json/v/ijee/amazeing?style=for-the-badge" /></a>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/ijee/amazeing?style=for-the-badge"/>
    <a href="https://amazething.netlify.app/" alt="Website Status">
        <img src="https://img.shields.io/website?down_message=offline&style=for-the-badge&up_message=online&url=https%3A%2F%2Famazething.netlify.app%2F" /></a>
</p>

<p align="center">
Amazeing visualizes different algorithms adapted for creating mazes<br>
and solving them with various path finding algorithms.
</p>


> [!TIP]
> ### Check out the app at [amazething.netlify.app](https://amazething.netlify.app).

## Features

- Implements 27 algorithms tailored to create mazes and how to traverse them.
- Extensive control over the algorithm execution (iteration history, etc.).
- Easy to use import / export feature.
- Statistics that get tracked based on the currently selected algorithm.
- Learn more page with general info and additional resources for further reading.
- PWA available

---

## Screenshot

![Amazeing Promo](assets/amazeing_promo.png 'Promo')

---

## Contributions / Support

Contributions are welcome! :heart:

**If you like what you see and just want to show some appreciation you can do so at [ko-fi](https://ko-fi.com/ijeee).**

In general there are quite a few TODOs in this project and I haven't come around to creating issues instead.
Some of them might be a good start for a first pull request and some may just sound really confusing
because it is either based on old information or just poorly written.

Either way please create an issue first to avoid unnecessary work and to check if the feature/bug in question is
something that you can work on. While I appreciate any help I can get this project is stil something I created for me
to keep on learning from. PRs without any kind of discussion beforehand will almost certainly not be accepted. 

There certainly are bugs present in the algorithms itself and fixing those kind 
of issues will always take priority over new features in general.


- Please respect the [Angular style guide](https://angular.io/guide/styleguide) for contributions.
- This project also adheres to [conventional commits](https://www.conventionalcommits.org/).
- Code comments only when necessary but always for functions.

**Note:** The project is based on my other project which is quite boring
in comparison to be honest. Have a look [here](https://github.com/Ijee/Game-of-Life-Angular).

---

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag
for a production build.

### Running tests

This project uses [Playwright](https://playwright.dev/) for e2e tests and ensures that 
the most common use-cases are covered. More tests could be introduced but there is no way
to automatically test for the `correctness` of the algorithms themselves automatically.

Run locally: `npm run test:pw`

---

## License:

This project is licensed under the [MIT License](https://github.com/Ijee/Amazeing/blob/logo/LICENSE).
