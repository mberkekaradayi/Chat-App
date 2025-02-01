"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import { useSearchParams } from "next/navigation";

export default function ChatPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [messageToDelete, setMessageToDelete] = useState(null);
  const messagesEndRef = useRef(null);

  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Logged-in user's email

  // Fetch users with unread message counts
  useEffect(() => {
    const fetchUsersWithUnreadCounts = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get(
          "http://localhost:3001/auth/users"
        );
        // Filter out the logged-in user
        let filteredUsers = usersResponse.data.filter(
          (user) => user.email !== email
        );

        // Fetch unread messages count
        const unreadResponse = await axios.get(
          "http://localhost:3001/auth/unread-messages",
          { params: { user_email: email } }
        );

        const unreadCounts = unreadResponse.data.reduce((acc, item) => {
          acc[item.sender_email] = item.unread_count;
          return acc;
        }, {});

        // Attach unread count to each user
        filteredUsers = filteredUsers.map((user) => ({
          id: user.id,
          email: user.email,
          avatar: "/avatars/avatar3.png",
          unreadCount: unreadCounts[user.email] || 0,
        }));

        setContacts(filteredUsers);
      } catch (error) {
        console.error("Error fetching users with unread counts:", error);
      }
    };

    fetchUsersWithUnreadCounts();
  }, [email]);

  /* Handle contact selection */
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact.email);
    markMessagesAsRead(contact.email, email);
  };

  const markMessagesAsRead = async (sender_email, recipient_email) => {
    try {
      await axios.put("http://localhost:3001/auth/messages/mark-read", {
        sender_email,
        recipient_email,
      });

      // Update unread message count in the UI
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.email === sender_email
            ? { ...contact, unreadCount: 0 }
            : contact
        )
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  /* Fetch messages for the selected chat */
  const fetchMessages = async (recipient_email) => {
    try {
      const response = await axios.get("http://localhost:3001/auth/messages", {
        params: { sender_email: email, recipient_email },
      });
      setMessages(response.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  /* Send a new message */
  const handleSendMessage = async () => {
    if (!selectedContact || inputMessage.trim() === "") return;

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/messages",
        {
          sender_email: email, // Logged-in user's email
          recipient_email: selectedContact.email, // Contact's email
          content: inputMessage,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setInputMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  /* Handle Enter key for sending messages */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /** 🔹 Auto-scroll to the latest message */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /** 🔹 Confirm and delete a message */
  const confirmDeleteMessage = (id) => {
    setMessageToDelete(id);
  };

  const handleDeleteMessage = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/auth/messages/${messageToDelete}`
      );
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageToDelete)
      );
      setMessageToDelete(null);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <Sidebar
        contacts={contacts}
        onSelectContact={handleSelectContact}
        userEmail={email}
      />

      <div className="w-3/4 h-full bg-gray-700 flex flex-col rounded-lg shadow-lg relative">
        <div className="p-4 bg-gray-800 text-lg font-bold rounded-t-lg flex items-center gap-3 ">
          {selectedContact && (
            <>
              <img
                src={selectedContact.avatar}
                alt={selectedContact.email}
                className="w-8 h-8 rounded-full"
              />
              <span>{selectedContact.email}</span>
            </>
          )}
        </div>

        <div className="flex-grow p-4 overflow-y-auto space-y-4 relative">
          {selectedContact ? (
            messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end ${
                    message.sender_email === email
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    key={message.id}
                    className={`flex items-end ${
                      message.sender_email === email
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative flex items-center justify-between p-3 rounded-lg shadow-lg mt-3 ${
                        message.sender_email === email
                          ? "bg-blue-600 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                      style={{
                        // maxWidth: "70%", // Restrict message width
                        whiteSpace: "pre-wrap", // Allow wrapping
                        wordWrap: "break-word", // Handle long words
                      }}
                    >
                      {/* Message Text */}
                      <div className="flex-grow">{message.content}</div>

                      {/* Delete Button */}
                      <button
                        className="text-gray-300 hover:text-red-500 ml-3"
                        onClick={() => confirmDeleteMessage(message.id)}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        🗑️
                      </button>
                      <div className="text-xs text-gray-300 mt-1">
                        {new Date(message.timestamp).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-center text-slate-300">
                No messages yet. Start the conversation!
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-center text-slate-300">
              Select a contact to start chatting!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedContact && (
          <div className="p-4 bg-gray-800 flex items-center gap-2 rounded-b-lg">
            <button
              className="p-2 bg-gray-600 rounded-full text-white hover:bg-gray-700"
              onClick={() => setInputMessage((prev) => prev + "😊")}
            >
              😊
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-grow p-2 rounded bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="ml-3 p-2 bg-blue-600 rounded text-white hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        )}

        {messageToDelete && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
              <p className="text-white mb-4">
                Are you sure you want to delete this message?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={handleDeleteMessage}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={() => setMessageToDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
