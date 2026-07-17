const demoCurrentUser = {
    id: "demo-user",
    firstName: "Ruwaidah",
    lastName: "Alfakhri",
    username: "ruwaidah.demo",
    email: "demo@connectapp.dev",
    bio: "Full-stack developer building modern web applications.",
    image: "/assets/demo-profile.png",
    image_id: null,
    public_id: null,
};

const demoFriends = [
    {
        id: "friendship-1",
        friendId: "demo-friend-1",
        firstName: "Daniel",
        lastName: "Morgan",
        username: "daniel.m",
        email: "daniel@example.com",
        bio: "React developer",
        image: "https://i.pravatar.cc/150?img=12",
        friend: true,
    },
    {
        id: "friendship-2",
        friendId: "demo-friend-2",
        firstName: "Maya",
        lastName: "Wilson",
        username: "maya.w",
        email: "maya@example.com",
        bio: "UI designer and frontend developer",
        image: "https://i.pravatar.cc/150?img=32",
        friend: true,
    },
    {
        id: "friendship-3",
        friendId: "demo-friend-3",
        firstName: "James",
        lastName: "Lee",
        username: "james.dev",
        email: "james@example.com",
        bio: "Node.js developer",
        image: "https://i.pravatar.cc/150?img=11",
        friend: true,
    },
];

const demoFriendRequests = [
    {
        id: "request-1",
        userSendRequest: "demo-request-user-1",
        userRecieveRequest: "demo-user",
        firstName: "Sophia",
        lastName: "Taylor",
        username: "sophia.t",
        bio: "Frontend developer",
        image: "https://i.pravatar.cc/150?img=47",
    },
];

const demoSearchUsers = [
    {
        id: "demo-search-user-1",
        firstName: "Olivia",
        lastName: "Brown",
        username: "olivia.b",
        bio: "Software tester",
        image: "https://i.pravatar.cc/150?img=45",
        friend: false,
        friendReq: null,
    },
    {
        id: "demo-search-user-2",
        firstName: "Ethan",
        lastName: "Clark",
        username: "ethan.c",
        bio: "Full-stack JavaScript developer",
        image: "https://i.pravatar.cc/150?img=13",
        friend: false,
        friendReq: null,
    },
];

const demoMessages = {
    "demo-friend-1": {
        friend: demoFriends[0],
        numberOfMsgUnread: 2,
        messages: [
            {
                id: "message-1",
                senderId: "demo-friend-1",
                receiverId: "demo-user",
                text: "Hey! Your messaging app looks great.",
                isRead: false,
                create_at: "2026-07-16T15:30:00.000Z",
            },
            {
                id: "message-2",
                senderId: "demo-user",
                receiverId: "demo-friend-1",
                text: "Thank you! I’m improving the interface.",
                isRead: true,
                create_at: "2026-07-16T15:32:00.000Z",
            },
            {
                id: "message-3",
                senderId: "demo-friend-1",
                receiverId: "demo-user",
                text: "The glass theme looks very professional.",
                isRead: false,
                create_at: "2026-07-16T15:35:00.000Z",
            },
        ],
    },

    "demo-friend-2": {
        friend: demoFriends[1],
        numberOfMsgUnread: 1,
        messages: [
            {
                id: "message-4",
                senderId: "demo-friend-2",
                receiverId: "demo-user",
                text: "Would you like to work on a React project?",
                isRead: false,
                create_at: "2026-07-15T18:20:00.000Z",
            },
        ],
    },

    "demo-friend-3": {
        friend: demoFriends[2],
        numberOfMsgUnread: 0,
        messages: [
            {
                id: "message-5",
                senderId: "demo-user",
                receiverId: "demo-friend-3",
                text: "I pushed the latest changes.",
                isRead: true,
                create_at: "2026-07-14T12:15:00.000Z",
            },
            {
                id: "message-6",
                senderId: "demo-friend-3",
                receiverId: "demo-user",
                text: "Perfect. I’ll review them today.",
                isRead: true,
                create_at: "2026-07-14T12:20:00.000Z",
            },
        ],
    },
};

const demoNotifications = [
    {
        id: "notification-1",
        type: "friend_request",
        text: "Sophia Taylor sent you a friend request.",
        isRead: false,
        create_at: "2026-07-16T16:00:00.000Z",
    },
    {
        id: "notification-2",
        type: "message",
        text: "Daniel sent you a new message.",
        isRead: false,
        create_at: "2026-07-16T15:35:00.000Z",
    },
    {
        id: "notification-3",
        type: "friend_accepted",
        text: "Maya accepted your friend request.",
        isRead: true,
        create_at: "2026-07-14T11:00:00.000Z",
    },
];

export {
    demoCurrentUser,
    demoFriends,
    demoFriendRequests,
    demoSearchUsers,
    demoMessages,
    demoNotifications,
};