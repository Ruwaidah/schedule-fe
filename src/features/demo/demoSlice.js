import { createSlice } from "@reduxjs/toolkit";
import {
    demoCurrentUser,
    demoFriends,
    demoFriendRequests,
    demoSearchUsers,
    demoMessages,
    demoNotifications,
} from "../../data/demoData";

const isStoredDemo = localStorage.getItem("demoMode") === "true";

const initialState = {
    isDemoMode: isStoredDemo,
    user: isStoredDemo ? demoCurrentUser : null,
    friends: isStoredDemo ? demoFriends : [],
    friendRequests: isStoredDemo ? demoFriendRequests : [],
    searchUsers: isStoredDemo ? demoSearchUsers : [],
    messages: isStoredDemo ? demoMessages : {},
    notifications: isStoredDemo ? demoNotifications : [],
};

const demoSlice = createSlice({
    name: "demo",
    initialState,

    reducers: {
        startDemoMode: (state) => {
            state.isDemoMode = true;
            state.user = demoCurrentUser;
            state.friends = demoFriends;
            state.friendRequests = demoFriendRequests;
            state.searchUsers = demoSearchUsers;
            state.messages = demoMessages;
            state.notifications = demoNotifications;

            localStorage.setItem("demoMode", "true");
            localStorage.setItem("id", "demo-user");
        },

        stopDemoMode: (state) => {
            state.isDemoMode = false;
            state.user = null;
            state.friends = [];
            state.friendRequests = [];
            state.searchUsers = [];
            state.messages = {};
            state.notifications = [];

            localStorage.removeItem("demoMode");
            localStorage.removeItem("id");
        },

        sendDemoMessage: (state, action) => {
            const { friendId, text } = action.payload;
            const thread = state.messages[friendId];

            if (!thread || !text?.trim()) return;

            thread.messages.push({
                id: `demo-message-${Date.now()}`,
                senderId: "demo-user",
                receiverId: friendId,
                text: text.trim(),
                isRead: true,
                create_at: new Date().toISOString(),
            });
        },

        markDemoThreadRead: (state, action) => {
            const friendId = String(action.payload);
            const thread = state.messages[friendId];

            if (!thread) return;

            thread.numberOfMsgUnread = 0;

            thread.messages.forEach((message) => {
                if (message.receiverId === "demo-user") {
                    message.isRead = true;
                }
            });
        },

        acceptDemoFriendRequest: (state, action) => {
            const requestId = action.payload;

            const request = state.friendRequests.find(
                (item) => item.id === requestId
            );

            if (!request) return;

            state.friends.push({
                id: `friendship-${Date.now()}`,
                friendId: request.userSendRequest,
                firstName: request.firstName,
                lastName: request.lastName,
                username: request.username,
                bio: request.bio,
                image: request.image,
                friend: true,
            });

            state.friendRequests = state.friendRequests.filter(
                (item) => item.id !== requestId
            );
        },

        rejectDemoFriendRequest: (state, action) => {
            state.friendRequests = state.friendRequests.filter(
                (item) => item.id !== action.payload
            );
        },

        deleteDemoFriend: (state, action) => {
            const friendId = String(action.payload);

            state.friends = state.friends.filter(
                (friend) => String(friend.friendId) !== friendId
            );

            delete state.messages[friendId];
        },

        sendDemoFriendRequest: (state, action) => {
            const userId = String(action.payload);

            state.searchUsers = state.searchUsers.map((user) =>
                String(user.id) === userId
                    ? {
                        ...user,
                        friendReq: {
                            userSendRequest: "demo-user",
                            userRecieveRequest: userId,
                        },
                    }
                    : user
            );
        },

        updateDemoProfile: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload,
            };
        },

        markDemoNotificationsRead: (state) => {
            state.notifications.forEach((notification) => {
                notification.isRead = true;
            });
        },
    },
});

export const {
    startDemoMode,
    stopDemoMode,
    sendDemoMessage,
    markDemoThreadRead,
    acceptDemoFriendRequest,
    rejectDemoFriendRequest,
    deleteDemoFriend,
    sendDemoFriendRequest,
    updateDemoProfile,
    markDemoNotificationsRead,
} = demoSlice.actions;

export default demoSlice.reducer;