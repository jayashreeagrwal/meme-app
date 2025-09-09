Here is the README content up to the specified line.

-----

# Meme Voting Arena 

Welcome to the **Meme Voting Arena**, a full-stack platform where the community decides the best memes\!

## Project Overview

This project is a dynamic, full-stack application that allows users to upload their favorite memes and vote on submissions from other users. It features user authentication, CRUD operations for memes, a leaderboard, and a personalized user experience.

The goal is to create a distinct, innovative, and memorable project that stands out from conventional submissions.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://www.google.com/search?q=%5Bhttps://nextjs.org/docs/app/building-your-application/optimizing/fonts%5D\(https://nextjs.org/docs/app/building-your-application/optimizing/fonts\)) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

### Frontend

  - **Meme Feed**: A grid or list of memes showing the image, title, and live vote counts.
  - **Upvote & Downvote Buttons**: Interactive buttons that update the vote count in real-time or near real-time.
  - **Meme Upload Form**: A form available exclusively to logged-in users.
  - **Leaderboard Page**: A dedicated page displaying the top 5 memes based on net votes.

### Backend

  - **User Authentication**: Secure user registration, login, and profile management.
  - **Protected Routes**: Middleware that uses **JWT** for authorization, ensuring only authenticated users can access specific routes like uploading or voting.
  - **CRUD for Memes**:
      - `GET /api/memes`: Retrieve all memes.
      - `POST /api/memes`: Add a new meme.
      - `PUT /api/memes/:id/vote`: Cast an upvote or downvote.
      - `DELETE /api/memes/:id`: Admin-only route to delete a meme.
  - **Voting Rules**: Each user can vote once per meme, with the ability to toggle their vote.
  - **Leaderboard Endpoint**: Returns the top 5 memes sorted by net votes.



## Desclaimer: 
1. The Add new user feature does not work due to some Supabase Issue, instead of any code issue... working on fixing that
<img width="1178" height="730" alt="image" src="https://github.com/user-attachments/assets/7259541a-0770-4af0-b088-1fab23d64000" />

2. It was made sure that the use of AI was only limited to debugging purposes for this peoject however the frontend was cleaned (upscaled and aligned) using AI tools.

3. For any other features you may wish for to be included, drop by at jayashreeagrwal [at] gmail [dot] com

## A demo run video: https://drive.google.com/drive/folders/1_4xUjzUeGwhBaVMrkYntR_EEz0M1Z_nC?usp=sharing
