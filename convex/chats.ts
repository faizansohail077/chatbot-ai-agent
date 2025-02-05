import { useMutation } from 'convex/react'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'


export const listChats = query({
    handler: async (ctx) => {
        const userId = await ctx.auth.getUserIdentity()

        if (!userId) throw new Error("UnAuthenticated")

        const chats = await ctx.db
            .query("chats")
            .withIndex("by_user", q => q.eq("userId", userId.subject))
            .order("desc")
            .collect();

        return chats
    },
});

export const createChat = mutation({
    args: {
        title: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if (!identity) throw new Error('Not authenticated')

        const chat = await ctx.db.insert("chats", {
            title: args.title,
            userId: identity.subject,
            createdAt: Date.now()
        })

        return chat
    }
})

export const deleteChat = mutation({
    args: {
        id: v.id("chats")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Not authenticated')

        const chat = await ctx.db.get(args.id)
        if (!chat || chat.userId !== identity.subject) throw new Error('Not authorized')

        // delete all messages in the chat
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_chat", q => q.eq("chatId", args.id))
            .collect()


        for (const message of messages) {
            await ctx.db.delete(message._id)
        }

        await ctx.db.delete(args.id)
    }
})
