<p align="center">
<img src="assets/amazeing_thick_logo_web_optimised.svg" alt="stack stats" style="max-width: 100%;">
</p>

<p align="center">
    <a href="https://github.com/Ijee/Amazeing/blob/main/LICENSE" alt="License">
        <img alt="MIT license" src="https://img.shields.io/github/license/Ijee/amazeing?style=for-the-badge" /></a>
    <a href="https://github.com/Ijee/Amazeing/releases" alt="License">
        <img alt="Version" src="https://img.shields.io/github/v/release/ijee/amazeing?style=for-the-badge" /></a>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/ijee/amazeing?style=for-the-badge"/>
    <a href="https://amazeing.app/" alt="Website Status">
        <img src="https://img.shields.io/website?url=https%3A%2F%2Famazeing.app%2F&style=for-the-badge" /></a>

</p>

<p align="center">
This project visualizes different algorithms adapted to creating and solving mazes.
</p>

> [!TIP]
>
> ### Check out the app at [amazeing.app/](https://amazeing.app/).

## Features

-   Implements 21+ algorithms for maze creation and traversal.
-   Extensive control over algorithm execution (autoplay, iteration history, etc.).
-   Paintable grid to create or alter your existing maze.
-   Easy import/export feature at any stage of the algorithm execution.
-   Statistics tracking during the algorithm execution.
-   Learn page with general information and additional resources.
-   Available as a Progressive Web App (PWA).

---

## Screenshot

![Amazeing Promo](assets/amazeing_promo.png 'Promo')

---

##  Support

This has been a passion project of mine which I did not create for profit and it
will always remain open source and ad-free.

If you enjoy this project and want to show your appreciation, you can:
* **Support the project:** [Ko-fi](https://ko-fi.com/ijeee) :coffee:
* **Spread the word:** Share this project with others!

## Contributions

Contributions are welcome! :heart:

To ensure a smooth collaboration, please follow these guidelines:

1.  **Create an Issue First:** If you're planning to work on a feature or bug fix, please create an issue beforehand to discuss it. This helps avoid duplicate efforts and ensures your contribution aligns with the project's direction. Pull Requests without prior discussion have a high chance of not being accepted. (Sorry!)
2.  **Style Guides:**
    * Respect the [Angular style guide](https://angular.io/guide/styleguide).
    * Adhere to [conventional commits](https://www.conventionalcommits.org/).
3.  **Code Comments:** Only comment when necessary, but always for functions.

There are quite a few TODOs throughout this project that could be good starting points. Feel free to browse existing [issues](https://github.com/Ijee/Amazeing/issues) or create a new one to propose an idea.

**Note:** This project is based on a previous Vue.js project of mine, which was later converted to Angular. You can check out the original [Game of Life Vue project here](https://github.com/Ijee/Game-of-Life-Vue).

---

### Development server

Run `ng serve` for development. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running tests

This project uses [Playwright](https://playwright.dev/) for e2e tests and ensures that
the most common use-cases are covered and don't produce errors while executing the algorithms.

More tests could be introduced but there is no way to automatically test for the `correctness` 
of the algorithms themselves.

Run locally: `npm run test:pw`

---

## License:

This project is licensed under the [MIT License](https://github.com/Ijee/Amazeing/blob/logo/LICENSE).
