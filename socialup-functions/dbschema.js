let db = {
  users: [
    {
      userId: 'randomCharacters',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2021-04-03T21:37:39.293Z',
      imageUrl: 'path/to/image',
      bio: "Hi, I'm new user, nice to meet you",
      website: 'https://user.com',
      location: 'City, State'
    }
  ],
  scream: [
    {
      userHandle: 'user',
      body: 'This is a sample scream',
      createdAt: '2021-04-03T21:37:39.293Z',
      likeCount: 5,
      commentCount: 3,
      userImage: 'path/to/image'
    }
  ],
  comments: [
    {
      userHandle: 'user',
      screamId: 'randomCharacters',
      body: 'nice one!',
      createdAt: '2021-04-03T21:37:39.293Z'
    }
  ],
  notification: [
    {
      recipient: 'user',
      sender: 'john',
      read: 'true | false',
      screamId: 'randomCharacters',
      type: 'like | comment',
      createdAt: '2021-04-03T21:37:39.293Z'
    }
  ]
};
const userDetails = {
  // Redux data
  credentials: {
    userId: 'lkj45b6kjl4b65uh45',
    email: 'user@email.com',
    handle: 'user',
    createdAt: '2021-04-03T21:37:39.293Z',
    imageUrl: 'path/to/image',
    bio: "Hi, I'm new user, nice to meet you",
    website: 'https://user.com',
    location: 'City, State'
  },
  likes: [
    {
      userHandle: 'user',
      screamId: 'randomCharacters'
    },
    {
      userHandle: 'user',
      screamId: 'randomCharacters'
    }
  ]
};
