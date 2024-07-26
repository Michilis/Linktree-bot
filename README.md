# Linktree Bot

A Telegram bot for managing and sharing Linktree profiles.

## Features

- User authentication and profile management with Telegram account.
- Profile privacy settings (public or private).
- Link ordering and categorization.
- Profile analytics (total clicks, unique visitors, most popular links).
- Customizable Linktree pages with pre-set templates.
- Command to add or remove links via Telegram.
- Admin panel for managing users and monitoring usage.
- Comprehensive help menu.

## Commands

- `/start`: Initiate the bot and setup your profile.
- `/linktree`: Show your Linktree.
- `/linktree @username`: Show specified user's Linktree.
- `/addlink name url`: Add a new link to your profile.
- `/removelink name`: Remove a link from your profile.
- `/setpublic`: Make your profile public.
- `/setprivate`: Make your profile private.
- `/analytics`: View your profile's analytics.
- `/customize`: Customize your Linktree page.
- `/help`: Display help menu.

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your environment variables in a `.env` file.
4. Initialize the database with the provided SQL script.
5. Start the server: `npm start`.

## Database Setup

Use the following SQL script to set up the database:

```sql
CREATE TABLE profiles (
  username VARCHAR(255) PRIMARY KEY,
  links JSONB,
  public BOOLEAN DEFAULT true
);
