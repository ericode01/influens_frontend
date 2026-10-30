# Influens

**An AI script writer that learns how *you* sell.**

Influens helps social media creators write product scripts (for short videos, reels, livestreams and sponsored posts) in their own voice. You don't write a long prompt or pick a generic "tone". You show it how you already write, and it carries on from there.

> This repository is the web frontend. It talks to a separate Influens backend that stores generators and runs the AI model.

---

## The idea

Every creator has a style: how they open, the jokes they make, how hard they push the sale, the words they keep coming back to. Generic AI copywriters lose all of that, and the output sounds like an ad anyone could have written.

Influens turns the problem around. **Your past scripts are the instructions.**

1. **Teach it with five examples.** Make a *script generator* by giving it five scripts you've already written. For each one, add the product name and some keywords or a short description of the product.
2. **Give it something new.** Next time you have a product to promote, enter its name and a few keywords.
3. **Get three drafts in your voice.** The generator uses your examples to write three script options that sound like you.
4. **Edit, save, repeat.** Polish the draft you like in the built-in editor. Save it as *In progress* or *Completed*, and come back to it whenever you want.

A creator can keep several generators side by side, for example one for beauty products, one for tech reviews and one for a client's brand voice. Each one keeps its own history of scripts.

```
  Your 5 example scripts            New product
  (product + keywords + script)     (name + keywords)
              │                            │
              ▼                            ▼
     ┌──────────────────┐        ┌────────────────────┐
     │ Script generator │ ─────▶ │ 3 drafts that      │ ──▶ edit ──▶ save
     │ (your style)     │        │ sound like you     │
     └──────────────────┘        └────────────────────┘
```

### Why examples instead of prompts

- **Easier.** Creators already have scripts they're proud of. Pasting five of them is quicker and more accurate than describing your style in words.
- **More faithful.** Examples capture rhythm, structure and personality that a description like "fun and energetic" misses.
- **Reusable.** You set up a generator once and use it for every new product, so your voice stays consistent across campaigns.

---

## Features

- **Sign in** with Google, Instagram or email and password (via NextAuth)
- **Script generators dashboard:** see and manage all your generators
- **Generator creator:** a five-step wizard for adding your example scripts
- **Script creator:** generate three AI options for a new product and edit them inline
- **Script editor:** reopen and revise saved scripts
- **Script history:** each generator's past scripts, filterable by status

## Tech stack

- [Next.js 12](https://nextjs.org/) with React 17
- [MUI 5](https://mui.com/) and Emotion for the UI
- [NextAuth.js](https://next-auth.js.org/) for authentication
- A separate REST backend for storing generators and running script generation

## Project structure

```
pages/
  index.js                         Landing page and sign in
  api/auth/[...nextauth].js        Auth providers and session handling
  generators/scriptgenerators/
    index.js                       List of your script generators
    scriptgeneratorcreator/        Five-example wizard for a new generator
    scriptgenerator/
      index.js                     One generator and its script history
      scriptcreator/               Generate and save a new script
      scripteditor/                Edit an existing script
src/
  content/Generators/              Page headers and tables for the generator pages
  layouts/, components/, theme/    Shared UI
```

## Getting started

### Requirements

- Node.js 16 or newer
- A running Influens backend

### Environment variables

Copy the template and fill in your own values:

```bash
cp .env.example .env
```

When `PROD=true` the app calls `PROD_INFLUENS_BACKEND`. Otherwise it calls `LOCAL_HOST`.

### Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

### Backend endpoints used

| Endpoint | Purpose |
| --- | --- |
| `POST signin` | Email and password sign in |
| `GET get_script_generators/:userId` | List a user's generators |
| `POST add_script_generator` | Create a generator from five examples |
| `GET get_script_generator_name/:id` | Generator details |
| `GET get_recent_scripts/:generatorId` | A generator's script history |
| `POST generate_script_options` | Generate three script drafts |
| `POST add_new_script` | Save a new script |
| `GET get_recent_script/:scriptId` | Load one script |
| `POST edit_script` | Update a saved script |

## Status

Influens is an early preview.
