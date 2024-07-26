module.exports = {
  welcome: `
  Welcome to Linktree Bot!
  Use /addlink to add new links to your profile.
  Use /removelink to remove links from your profile.
  Use /setpublic to make your profile public.
  Use /setprivate to make your profile private.
  Use /analytics to view your profile's analytics.
  Use /customize to customize your Linktree page.
  For help, use /help.
  `,
  profileCreated: 'Profile created successfully.',
  profileUpdated: 'Profile updated successfully.',
  linkAdded: 'Link added successfully.',
  linkRemoved: 'Link removed successfully.',
  noProfileFound: 'No profile found. Please create a profile first.',
  profilePublic: 'Profile set to public.',
  profilePrivate: 'Profile set to private.',
  customize: `
  Customize your Linktree:
  1. Theme: /settheme [theme_name]
  2. Layout: /setlayout [layout_name]
  `,
  help: `
  /start - Initiate the bot and setup your profile.
  /linktree - Show your Linktree.
  /linktree @username - Show specified user's Linktree.
  /addlink name url - Add a new link to your profile.
  /removelink name - Remove a link from your profile.
  /setpublic - Make your profile public.
  /setprivate - Make your profile private.
  /analytics - View your profile's analytics.
  /customize - Customize your Linktree page.
  `
};
