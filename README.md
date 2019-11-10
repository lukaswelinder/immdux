<h1 align="center">Immdux</h1>

<p align="center>
  Immutable, observable, dynamic state engine compatible with the redux ecosystem.
</p>

<p align="center>
  <a href="https://circleci.com/gh/lithic-io/immdux" target="_blank">
    <img alt="CircleCI Status" src="https://circleci.com/gh/lithic-io/immdux.svg?style=svg">
  </a>
  <a href="https://codecov.io/gh/lithic-io/immdux" target="_blank">
    <img alt="Coverage Status" src="https://codecov.io/gh/lithic-io/immdux/branch/master/graph/badge.svg">
  </a>
</p>

## Contents

* [@immdux/core](./packages/core)

## Introduction

### Project goals:

* Reduced boilerplate.
* Provide simple API for dynamically defining reducers.
* Decentralize bootstrapping to improve codebase scalability.
* Embrace FRP and observable design patterns.

### Motivation

Immdux attempts to solve some of the challenges faced by complex, large-scale state architectures by providing an interface that allows distributed and dynamic control of the state engine.

Development of Immdux and the ideas behind it is inspired by years of experience designing and implementing Redux and other flux-like state management architectures for highly complex user facing applications.

Commonly, implementations of Redux involves propagating reducers to a central file where they are then "combined" via `combineReducers`, until resulting in a "root" reducer. This is typically a static state engine, all reducers are locked in after bootstrapping. Adding and removing reducers or middleware after this point is challenging and clunky.

On a smaller project, this isn't much of an issue, but as a project grows in scale it can become a serious pain point. A large project can easily have dozens of reducers and hundreds of epics getting called at times when they are not even needed.

These key points, among others, are what this project aims to address.

## Contributing

If you would like to help out, see our [Contributing Guide](./CONTRIBUTING.md) to get started.
