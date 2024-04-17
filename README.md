# Nabu

Created by [GPT Pilot](https://github.com/Pythagora-io/gpt-pilot) with a little human help

Nabu is a web-based puzzle application that immerses players in a journey through Earth's history by engaging them in a dialogue with an alien AI, Nabu. Players decode messages and solve puzzles to progress through levels, improving their communication with Nabu over time. Completing the game rewards players with a digital badge, symbolizing their successful communication with Nabu and understanding of Earth's history, which can be shared on social media platforms.

## Overview

Nabu leverages a stack comprising MongoDB for data persistence, Express for backend routing, and Node.js for server-side logic. The application facilitates user interaction via a web interface, utilizing EJS for dynamic content rendering. It features an authentication system for user management, puzzle progression logic to advance through levels, and social media integration for sharing achievements.

## Features

- **Interactive Puzzles:** Engage in a unique chat interface with an alien AI, solving puzzles that increase in difficulty as you progress.
- **Dynamic Badge Generation:** Earn a personalized completion badge at the end of the game, featuring your name, completion date, and a unique design.
- **Social Media Integration:** Share your achievement across social media platforms with ease, directly from the application.
- **Progressive Difficulty and Clarity:** Experience increasingly challenging puzzles and improved clarity in communication with Nabu as you advance through the game's 20 levels.

## Getting started

### Requirements

- Node.js
- MongoDB
- A modern web browser

### Quickstart

1. Clone the repository to your local machine.
2. Copy `.env.example` to `.env` and fill in your database URL and session secret.
3. Install dependencies with `npm install`.
4. Run the application using `npm start`. The server will listen on the port specified in your `.env` file.

### License

Copyright (c) 2024.
